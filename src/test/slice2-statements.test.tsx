import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import HNWStatement from "@/components/statements/HNWStatement";
import SCSIStatement from "@/components/statements/SCSIStatement";
import { renderStatementSnapshot } from "@/legal/statements/renderStatementSnapshot";
import {
  getStatement,
  segmentsToText,
  type StatementVersion,
} from "@/legal/statements/statementDefinitions";

const FIXTURES = path.resolve(__dirname, "fixtures");

const readFixture = (name: string) =>
  fs.readFileSync(path.join(FIXTURES, name), "utf8").trim();

/** Plain text of the whole statement, one block per line, for the line-by-line diff. */
const statementText = (version: StatementVersion): string[] => {
  const statement = getStatement(version);
  const lines: string[] = [statement.title];
  for (const block of statement.blocks) {
    switch (block.type) {
      case "lead":
      case "paragraph":
      case "declaration":
        lines.push(segmentsToText(block.segments));
        break;
      case "condition":
        lines.push(`${block.letter} ${segmentsToText(block.segments)}`);
        block.options.forEach((o) => lines.push(`☐ ${o}`));
        if (block.followUp) lines.push(segmentsToText(block.followUp));
        break;
      case "connector":
        lines.push(block.value);
        break;
      case "rule":
        lines.push("---");
        break;
      case "signature":
        lines.push(block.value);
        break;
    }
  }
  return lines;
};

// Transcribed independently from brief §2.1 / §2.2 (SI 2024/301 Schs 3 and 4).
const HNW_EXPECTED = [
  "HIGH NET WORTH INDIVIDUAL INVESTOR STATEMENT",
  "If you meet condition A or B below, you may choose to be classified as a high net worth individual for the purposes of the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005.",
  "In the last financial year, did you have:",
  "A) An annual income of £100,000 or more? Income does NOT include any one-off pension withdrawals.",
  "☐ No",
  "☐ Yes",
  "If yes, please specify your income (as defined above) to the nearest £10,000 in the last financial year [£________]",
  "AND/OR",
  "B) Net assets of £250,000 or more? Net assets do NOT include: your home (primary residence), any loan secured on it or any equity released from it; your pension (or any pension withdrawals) or any rights under insurance contracts. Net assets are total assets minus any debts you owe.",
  "☐ No",
  "☐ Yes",
  "If yes, please specify your net assets (as defined above) to the nearest £100,000 in the last financial year [£________]",
  "OR",
  "C) None of these apply to me.",
  "☐ Yes",
  "---",
  "I declare that I have answered yes to A and/or B, and wish to be treated as a high net worth individual.",
  "I understand that this means:",
  "a) I can receive financial promotions where the contents may not comply with rules made by the Financial Conduct Authority (FCA);",
  "b) I can expect no protection from the FCA, the Financial Ombudsman Service or the Financial Services Compensation Scheme.",
  "I am aware that it is open to me to seek advice from someone who specialises in advising on investments.",
  "I accept that I could lose all of the money I invest.",
  "Signature ______________________ Date ______________",
];

const SCSI_EXPECTED = [
  "SELF-CERTIFIED SOPHISTICATED INVESTOR STATEMENT",
  "If you meet condition A, B, C or D below, you may choose to be classified as a self-certified sophisticated investor for the purposes of the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005.",
  "Have you:",
  "A) Worked in a professional capacity in the private equity sector, or in the provision of finance for small and medium enterprises, in the last two years?",
  "☐ No",
  "☐ Yes",
  "If yes, what is/was the name of the business/organisation? [________]",
  "B) Been the director of a company with an annual turnover of at least £1 million, in the last two years?",
  "☐ No",
  "☐ Yes",
  "If yes, what is/was the name of the company, and its Companies House number (or international equivalent)? [________]",
  "C) Made two or more investments in an unlisted company, in the last two years?",
  "☐ No",
  "☐ Yes",
  "If yes, how many investments in unlisted companies have you made in the last two years? [________]",
  "D) Been a member of a network or syndicate of business angels for more than six months, and are still a member?",
  "☐ No",
  "☐ Yes",
  "If yes, what is the name of the network or syndicate? [________]",
  "OR",
  "E) None of these apply to me.",
  "☐ Yes",
  "---",
  "I declare that I have answered yes to A and/or B and/or C and/or D and wish to be treated as a self-certified sophisticated investor.",
  "I understand that this means:",
  "a) I can receive financial promotions where the contents may not comply with rules made by the Financial Conduct Authority (FCA); and",
  "b) I can expect no protection from the FCA, the Financial Ombudsman Service or the Financial Services Compensation Scheme.",
  "I am aware that it is open to me to seek advice from someone who specialises in advising on investments.",
  "I accept that I could lose all of the money I invest.",
  "Signature ______________________ Date ______________",
];

describe("Slice 2 — prescribed statements", () => {
  it("2.1 snapshot HTML is byte-exact against the committed fixtures", () => {
    expect(renderStatementSnapshot("FPO_SCH5_PT1_SI2024-301")).toBe(
      readFixture("hnw-statement.html")
    );
    expect(renderStatementSnapshot("FPO_SCH5_PT2_SI2024-301")).toBe(
      readFixture("scsi-statement.html")
    );
  });

  it("2.2 every legally-bold phrase renders inside <strong>", () => {
    const { container } = render(<HNWStatement />);
    const bold = Array.from(container.querySelectorAll("strong")).map((n) =>
      n.textContent
    );
    expect(bold).toEqual([
      "condition A or B below",
      "income of £100,000 or more",
      "Net assets of £250,000 or more",
      "no protection",
      "I accept that I could lose all of the money I invest.",
    ]);

    const scsi = render(<SCSIStatement />).container;
    expect(Array.from(scsi.querySelectorAll("strong")).map((n) => n.textContent)).toEqual([
      "condition A, B, C or D below",
      "no protection",
      "I accept that I could lose all of the money I invest.",
    ]);
  });

  it("2.3 '£1 million' in the SCSI statement is NOT bold", () => {
    const { container } = render(<SCSIStatement />);
    const bolded = Array.from(container.querySelectorAll("strong, u")).some((n) =>
      (n.textContent ?? "").includes("£1 million")
    );
    expect(bolded).toBe(false);
    expect(container.textContent).toContain("annual turnover of at least £1 million");
  });

  it("2.4 'NOT' in HNW conditions A and B is underlined", () => {
    const { container } = render(<HNWStatement />);
    const underlined = Array.from(container.querySelectorAll("u")).map((n) => n.textContent);
    expect(underlined).toEqual(["NOT", "NOT"]);
    expect(container.querySelector('[data-block="hnw-a"] u')?.textContent).toBe("NOT");
    expect(container.querySelector('[data-block="hnw-b"] u')?.textContent).toBe("NOT");
  });

  it("2.5 no name field exists inside either statement DOM subtree", () => {
    render(
      <>
        <HNWStatement />
        <SCSIStatement />
      </>
    );
    const sections = document.querySelectorAll("[data-statement-version]");
    expect(sections).toHaveLength(2);
    sections.forEach((section) => {
      expect(section.querySelectorAll("input, textarea, select, label")).toHaveLength(0);
      expect(section.textContent?.toLowerCase()).not.toContain("full name");
    });
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("2.6 rendered statements match brief §2 line by line", () => {
    expect(statementText("FPO_SCH5_PT1_SI2024-301")).toEqual(HNW_EXPECTED);
    expect(statementText("FPO_SCH5_PT2_SI2024-301")).toEqual(SCSI_EXPECTED);
  });

  it("2.7 void figures from the superseded statements are absent", () => {
    const combined =
      renderStatementSnapshot("FPO_SCH5_PT1_SI2024-301") +
      renderStatementSnapshot("FPO_SCH5_PT2_SI2024-301");
    ["170,000", "430,000", "1.6m"].forEach((figure) => {
      expect(combined).not.toContain(figure);
    });
  });
});
