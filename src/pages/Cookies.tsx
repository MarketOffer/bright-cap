import LegalPageLayout, {
  LegalSection,
  LegalSubheading,
  P,
  A,
  MailLink,
} from "@/components/LegalPageLayout";

const Cookies = () => (
  <LegalPageLayout
    title="Cookies Notice | BrightCap"
    description="How brightcap.capital uses cookies, local storage and similar technologies, including the embedded Cal.eu scheduler."
    path="/cookies"
    heading="Cookies Notice"
    lastUpdated="Last updated: 27 July 2026"
  >
    <LegalSection heading="1. About this notice">
      <P>
        This notice explains how brightcap.capital uses cookies, local storage and similar
        technologies.
      </P>
      <P>
        Cookies are small text files placed on a device. Similar technologies can store or read
        information in a browser or device. Some are needed to provide a service or keep it secure;
        others are used for preferences, measurement or advertising.
      </P>
    </LegalSection>

    <LegalSection heading="2. BrightCap’s current use">
      <P>
        BrightCap does not currently use analytics, advertising, remarketing, social-media pixels or
        session-recording technologies on this website.
      </P>
      <P>
        The site may use strictly necessary technology to deliver pages, maintain security and
        prevent misuse. It also embeds the Cal.eu scheduling service so that visitors can see
        availability and book a call.
      </P>
    </LegalSection>

    <LegalSection heading="3. Technologies currently used">
      <LegalSubheading>Service: BrightCap website hosting and security</LegalSubheading>
      <P>
        Purpose: To deliver the website, route requests, maintain security and prevent misuse.
      </P>
      <P>Category: Strictly necessary.</P>
      <P>
        Duration: Session or the short period configured by the relevant hosting or security
        provider.
      </P>

      <LegalSubheading>Service: Cal.eu embedded scheduler</LegalSubheading>
      <P>Provider: Cal.com</P>
      <P>
        Purpose: To display availability, apply time-zone and booking preferences, prevent misuse and
        process a booking requested by the visitor.
      </P>
      <P>
        Category: Functional and, where essential to provide a requested booking, strictly necessary.
      </P>
      <P>
        Duration: Session or the period set by Cal.com for the relevant booking, security or
        preference technology.
      </P>

      <P>
        Cal.com’s privacy information is available at{" "}
        <A href="https://cal.com/privacy">https://cal.com/privacy</A>.
      </P>
    </LegalSection>

    <LegalSection heading="4. Controlling technology">
      <P>
        Most browsers allow you to view, delete or block cookies and site storage. Blocking strictly
        necessary or functional technology may prevent the website or booking calendar from working
        correctly.
      </P>
      <P>
        If our use of technology changes, we will update this notice and obtain consent before using
        any technology where consent is required.
      </P>
    </LegalSection>

    <LegalSection heading="5. Contact">
      <P>
        If you have a question about this notice, email{" "}
        <MailLink email="support@brightcap.capital" />.
      </P>
      <P>RM Incorporations Ltd, trading as BrightCap</P>
      <P>Company number: 16715037</P>
      <P>Registered office: 16 Pettitts Lane, Dry Drayton, Cambridge, England, CB23 8BT</P>
    </LegalSection>
  </LegalPageLayout>
);

export default Cookies;
