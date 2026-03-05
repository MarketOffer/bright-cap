import ConstructionSection from "@/components/ConstructionSection";
import ConstructionVariantAccent from "@/components/ConstructionVariantAccent";
import ConstructionVariantStat from "@/components/ConstructionVariantStat";
import ConstructionVariantDash from "@/components/ConstructionVariantDash";
import ConstructionVariantHeading from "@/components/ConstructionVariantHeading";

const variants = [
  { name: "Current", description: "No emphasis on the 25+ year detail", component: ConstructionSection },
  { name: "A — Accent colour", description: "'25+ year Cambridge construction business' highlighted in primary colour", component: ConstructionVariantAccent },
  { name: "B — Pull-quote stat", description: "Large '25+' number pulled out as a standalone stat line", component: ConstructionVariantStat },
  { name: "C — Inline dash", description: "Em-dash sets off '25+ years building in Cambridge' in bold foreground", component: ConstructionVariantDash },
  { name: "D — Updated heading", description: "Title changed to 'Built by 25 years of local expertise'", component: ConstructionVariantHeading },
];

const CompareConstruction = () => (
  <div className="bg-background text-foreground">
    <div className="mx-auto max-w-3xl px-6 pt-16 pb-8">
      <h1 className="text-2xl font-semibold tracking-tight">Construction section — highlight comparison</h1>
      <p className="mt-2 text-sm text-muted-foreground">Scroll to compare each variant side by side.</p>
    </div>
    {variants.map((v) => (
      <div key={v.name}>
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-2">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            {v.name}
          </span>
          <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
        </div>
        <v.component />
      </div>
    ))}
  </div>
);

export default CompareConstruction;
