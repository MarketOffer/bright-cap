import LegalPageLayout, {
  LegalSection,
  LegalSubheading,
  P,
  UL,
  A,
  MailLink,
} from "@/components/LegalPageLayout";

const Privacy = () => (
  <LegalPageLayout
    title="Privacy Notice | BrightCap"
    description="How RM Incorporations Ltd, trading as BrightCap, collects and uses personal data through brightcap.capital and general BrightCap enquiries."
    path="/privacy"
    heading="Privacy Notice"
    lastUpdated="Last updated: 27 July 2026"
  >
    <LegalSection heading="1. Who we are">
      <P>
        RM Incorporations Ltd, trading as BrightCap, is the controller of personal data collected
        through brightcap.capital and general BrightCap enquiries.
      </P>
      <P>
        RM Incorporations Ltd is a private limited company registered in England and Wales under
        company number 16715037. Its registered office is 16 Pettitts Lane, Dry Drayton, Cambridge,
        England, CB23 8BT.
      </P>
      <P>
        You can contact us about this notice or your personal data at{" "}
        <MailLink email="support@brightcap.capital" />.
      </P>
      <P>
        If you progress to a particular property joint venture, the relevant property-specific
        company may become a separate controller and will provide any additional privacy information
        required.
      </P>
      <P>
        MarketOffer is a separate business. This notice does not describe how MarketOffer uses
        personal data.
      </P>
    </LegalSection>

    <LegalSection heading="2. The information we collect">
      <P>We may collect:</P>
      <UL>
        <li>
          your name, email address, telephone number, job title, company and other contact details;
        </li>
        <li>
          information you provide in an enquiry, when booking a call or during later correspondence;
        </li>
        <li>
          your professional or business background and any information you choose to provide about
          your investment experience, eligibility, interests or circumstances;
        </li>
        <li>meeting details, notes and records of our communications with you;</li>
        <li>
          documents or other information you voluntarily provide if a potential joint venture
          progresses; and
        </li>
        <li>
          basic technical and security information generated when you use the website, such as your
          IP address, browser and device type, requested page, date and time, and security or
          diagnostic logs.
        </li>
      </UL>
      <P>
        Please do not send us special-category personal data, criminal-offence data or information
        about another person unless we have asked for it and you are authorised to provide it.
      </P>
      <P>The public website does not collect payment-card or bank-account details.</P>
    </LegalSection>

    <LegalSection heading="3. Where the information comes from">
      <P>
        Most information comes directly from you when you contact us, book a call or correspond with
        us.
      </P>
      <P>We may also receive professional contact information from:</P>
      <UL>
        <li>a person who introduces you to us;</li>
        <li>the company or organisation you work with;</li>
        <li>professional advisers or counterparties involved in a potential transaction; or</li>
        <li>
          publicly available professional and company sources, such as company websites, Companies
          House or professional networking profiles.
        </li>
      </UL>
      <P>
        Where we obtain your information from another source and are required to do so, we will
        provide this privacy information within the period required by law.
      </P>
    </LegalSection>

    <LegalSection heading="4. How and why we use your information">
      <P>We use personal data for the following purposes and lawful bases:</P>

      <LegalSubheading>Responding to enquiries and arranging calls</LegalSubheading>
      <P>
        We use your information to respond to you, arrange a requested call and communicate about
        the matters you raise. We rely on our legitimate interests in operating and developing
        BrightCap and, where you ask us to take steps with a view to a possible agreement, taking
        steps at your request before entering a contract.
      </P>

      <LegalSubheading>Assessing a possible business relationship or joint venture</LegalSubheading>
      <P>
        We may use relevant professional, business, experience and eligibility information to
        consider whether there may be a genuine fit and to carry out proportionate due diligence. We
        rely on our legitimate interests in evaluating and structuring potential business
        relationships and protecting BrightCap and prospective counterparties.
      </P>

      <LegalSubheading>Progressing and administering a relationship</LegalSubheading>
      <P>
        If discussions progress, we use information to conduct due diligence, prepare and negotiate
        documents, manage the relationship and maintain appropriate records. We rely on taking
        requested steps before a contract, performing a contract, complying with legal obligations
        and our legitimate interests in administering the relationship and establishing, exercising
        or defending legal claims.
      </P>

      <LegalSubheading>Operating and protecting the website and business</LegalSubheading>
      <P>
        We use technical and security information to deliver the website, maintain security,
        investigate faults, prevent misuse and keep appropriate business records. We rely on our
        legitimate interests in operating a secure and reliable website and business and, where
        applicable, compliance with legal obligations.
      </P>

      <LegalSubheading>Relevant business communications</LegalSubheading>
      <P>
        We may occasionally send relevant BrightCap business updates where the law permits. Depending
        on the circumstances, we rely on consent or our legitimate interests in developing
        professional business relationships. You can opt out at any time by replying to the message
        or emailing <MailLink email="support@brightcap.capital" />.
      </P>

      <P>
        Where we rely on legitimate interests, we consider the necessity of the processing and its
        effect on the people concerned. You may object as explained below.
      </P>
    </LegalSection>

    <LegalSection heading="5. If you do not provide information">
      <P>
        You are not legally required to provide personal data through this public website. If you do
        not provide information needed to answer an enquiry or arrange a call, we may be unable to
        respond or proceed.
      </P>
      <P>
        If a specific opportunity progresses, some information may be required for legal,
        due-diligence, contractual or lender requirements. We will explain this at the relevant time.
      </P>
    </LegalSection>

    <LegalSection heading="6. Booking a call through Cal.eu">
      <P>
        The website uses an embedded scheduling service supplied by Cal.com and loaded from
        app.cal.eu.
      </P>
      <P>
        When the scheduler loads, your browser connects to Cal.eu. If you book a call, the details
        you enter, your selected time and related booking information are processed through that
        service and made available to us so that we can administer the meeting.
      </P>
      <P>
        Cal.com also processes information under its own privacy terms. You can read the Cal.com
        Privacy Policy at <A href="https://cal.com/privacy">https://cal.com/privacy</A>.
      </P>
    </LegalSection>

    <LegalSection heading="7. Who we share information with">
      <P>We share personal data only where reasonably necessary with:</P>
      <UL>
        <li>
          providers that support our website, hosting, security, email, document storage,
          communications and scheduling, including Cal.com for bookings;
        </li>
        <li>
          our directors, personnel and professional advisers who need the information for their work;
        </li>
        <li>
          a relevant property-specific company and its professional advisers if a particular
          opportunity progresses;
        </li>
        <li>
          prospective or actual lenders, funders, investors, counterparties and due-diligence
          providers where relevant to a proposed transaction and subject to appropriate
          confidentiality arrangements;
        </li>
        <li>
          regulators, courts, law-enforcement bodies or other authorities where required or permitted
          by law; and
        </li>
        <li>
          a prospective buyer, seller or reorganised entity if our business or assets are
          restructured, provided the information is used only as permitted by law.
        </li>
      </UL>
      <P>We do not sell personal data.</P>
    </LegalSection>

    <LegalSection heading="8. International transfers">
      <P>
        Some service providers may process personal data outside the United Kingdom. Where UK
        data-protection law restricts a transfer, we use an applicable adequacy regulation or require
        appropriate contractual safeguards and any additional measures that are reasonably necessary.
      </P>
      <P>
        You may contact <MailLink email="support@brightcap.capital" /> for further information about
        the safeguard used for a relevant transfer.
      </P>
    </LegalSection>

    <LegalSection heading="9. How long we keep information">
      <P>
        We keep personal data only for as long as reasonably necessary for the purpose for which it
        was collected, including legal, accounting, regulatory and reporting requirements.
      </P>
      <P>Normally:</P>
      <UL>
        <li>
          an enquiry, booking and related correspondence that does not progress is retained for up to
          24 months after the last meaningful contact;
        </li>
        <li>
          information relating to a potential or completed business relationship, joint venture,
          transaction or associated due diligence may be retained for up to six years after the
          relationship or relevant matter ends;
        </li>
        <li>
          records needed to meet a legal or regulatory obligation or to establish, exercise or defend
          legal claims may be kept for longer where necessary; and
        </li>
        <li>
          routine technical and security logs are retained for the period set by the relevant system,
          normally no longer than 12 months unless needed to investigate a security event.
        </li>
      </UL>
      <P>We may retain a minimal record of an opt-out so that we can respect it.</P>
      <P>
        Our service providers may hold information for different periods under their own retention
        policies and our account settings.
      </P>
    </LegalSection>

    <LegalSection heading="10. Security">
      <P>
        We use proportionate organisational and technical measures intended to protect personal data
        from unauthorised access, alteration, disclosure, loss or destruction. No internet
        transmission or storage system is completely secure.
      </P>
      <P>
        Access is limited to people and providers that need the information for an authorised
        purpose.
      </P>
    </LegalSection>

    <LegalSection heading="11. Your rights">
      <P>Depending on the circumstances, you may have the right to:</P>
      <UL>
        <li>ask for a copy of your personal data;</li>
        <li>ask us to correct inaccurate or incomplete data;</li>
        <li>ask us to delete personal data;</li>
        <li>ask us to restrict how personal data is used;</li>
        <li>object to processing based on legitimate interests;</li>
        <li>receive certain data in a portable format;</li>
        <li>withdraw consent at any time where processing relies on consent; and</li>
        <li>complain to the Information Commissioner’s Office.</li>
      </UL>
      <P>
        These rights are not absolute and may not apply in every circumstance. We may need to verify
        your identity before acting on a request.
      </P>
      <P>
        To exercise a right, email <MailLink email="support@brightcap.capital" />.
      </P>
    </LegalSection>

    <LegalSection heading="12. Your right to object to direct marketing">
      <P>
        You have the right to object at any time to the use of your personal data for direct
        marketing. We will stop using it for that purpose when you object.
      </P>
      <P>
        You can opt out by using any unsubscribe method in the communication, replying to the sender
        or emailing <MailLink email="support@brightcap.capital" />.
      </P>
    </LegalSection>

    <LegalSection heading="13. Automated decisions">
      <P>
        BrightCap does not use personal data collected through the public website to make decisions
        based solely on automated processing that have legal or similarly significant effects.
      </P>
    </LegalSection>

    <LegalSection heading="14. Complaints">
      <P>
        Please contact us first if you have a concern so that we can try to resolve it.
      </P>
      <P>
        You also have the right to complain to the Information Commissioner’s Office, the UK
        regulator for data protection. Information about making a complaint is available at{" "}
        <A href="https://ico.org.uk/make-a-complaint/">https://ico.org.uk/make-a-complaint/</A>.
      </P>
    </LegalSection>

    <LegalSection heading="15. Changes to this notice">
      <P>
        We may update this notice when our processing or the law changes. The latest version will
        appear on this page with a revised “Last updated” date. If a change materially affects how we
        use information already held, we will take reasonable steps to bring it to the attention of
        the people affected.
      </P>
    </LegalSection>

    <LegalSection heading="16. Contact">
      <P>RM Incorporations Ltd, trading as BrightCap</P>
      <P>Company number: 16715037</P>
      <P>Registered office: 16 Pettitts Lane, Dry Drayton, Cambridge, England, CB23 8BT</P>
      <P>
        Email: <MailLink email="support@brightcap.capital" />
      </P>
    </LegalSection>
  </LegalPageLayout>
);

export default Privacy;
