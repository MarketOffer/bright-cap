import LegalPageLayout, {
  LegalSection,
  P,
  UL,
  A,
  MailLink,
  TelLink,
} from "@/components/LegalPageLayout";

const Terms = () => (
  <LegalPageLayout
    title="Website Terms | BrightCap"
    description="The terms that apply when you use brightcap.capital, operated by RM Incorporations Ltd, trading as BrightCap."
    path="/terms"
    heading="Website Terms"
    lastUpdated="Last updated: 27 July 2026"
  >
    <LegalSection heading="1. About this website">
      <P>This website is operated by RM Incorporations Ltd, trading as BrightCap.</P>
      <P>
        RM Incorporations Ltd is a private limited company registered in England and Wales under
        company number 16715037. Its registered office is 16 Pettitts Lane, Dry Drayton, Cambridge,
        England, CB23 8BT.
      </P>
      <P>
        You can contact us at <MailLink email="support@brightcap.capital" /> or on{" "}
        <TelLink tel="0800 086 2278" href="tel:08000862278" />.
      </P>
    </LegalSection>

    <LegalSection heading="2. Using the website">
      <P>
        By using brightcap.capital, you agree to these terms. If you do not agree, please do not use
        the website.
      </P>
      <P>
        You may use the website only for lawful purposes. You must not misuse it, attempt to gain
        unauthorised access, introduce malicious code, interfere with its operation or use its
        content in a misleading or unlawful way.
      </P>
      <P>
        Browsing the website, making an enquiry or booking a call does not by itself make you an
        investor, client, partner or contracting party of BrightCap or RM Incorporations Ltd.
      </P>
    </LegalSection>

    <LegalSection heading="3. General information only">
      <P>
        The public website provides general information about BrightCap, its business and its
        property strategy.
      </P>
      <P>
        It does not provide personal financial, investment, tax, legal, mortgage or other regulated
        advice. Nothing on the public website is a personal recommendation or an invitation or offer
        to buy, sell or subscribe for an investment.
      </P>
      <P>
        You should obtain your own independent professional advice and carry out your own due
        diligence before making any legal, financial or investment decision.
      </P>
    </LegalSection>

    <LegalSection heading="4. Specific opportunities">
      <P>No specific investment can be accepted through this public website.</P>
      <P>
        If BrightCap discusses a particular opportunity with an eligible recipient, it will be
        communicated separately and will be subject to its own risk information, due diligence and
        definitive legal documentation.
      </P>
      <P>
        Any investment would be made in the relevant property-specific company or SPV described in
        those documents, not in the BrightCap trading name merely by using this website.
      </P>
      <P>
        The definitive documents for a particular opportunity will take precedence over any general
        information on this website.
      </P>
    </LegalSection>

    <LegalSection heading="5. Property and investment risk">
      <P>
        Property investment is illiquid and involves risk. Property values, rents, costs, finance
        terms, project timings and market conditions can change.
      </P>
      <P>
        Capital and returns are not guaranteed. An investor may receive back less than they invest
        and may be unable to realise an investment when expected.
      </P>
      <P>
        Any target, forecast, illustration or past performance that appears in separately issued
        opportunity material is not a guarantee of a future result. Past performance is not a
        reliable indicator of future results.
      </P>
    </LegalSection>

    <LegalSection heading="6. Accuracy and availability">
      <P>
        We take reasonable care over the public website, but its content is general, may be
        summarised and may become out of date.
      </P>
      <P>
        We do not promise that the website or any content will always be available, uninterrupted,
        secure, complete, accurate or free from errors.
      </P>
      <P>We may update, suspend or withdraw any part of the website without notice.</P>
    </LegalSection>

    <LegalSection heading="7. Intellectual property">
      <P>
        Unless otherwise stated, RM Incorporations Ltd or its licensors own the intellectual-property
        rights in the website and its content.
      </P>
      <P>
        You may view the website and print or download reasonable extracts for your own lawful,
        non-commercial use.
      </P>
      <P>
        You must not reproduce, republish, sell, license, modify, remove an attribution from or
        commercially exploit a material part of the website without our prior written permission,
        except where the law allows it.
      </P>
      <P>Third-party names, logos and content remain the property of their respective owners.</P>
    </LegalSection>

    <LegalSection heading="8. Third-party services and links">
      <P>
        The website may link to third-party websites and embeds the Cal.eu scheduling service.
        Third-party services are operated under their own terms and privacy notices.
      </P>
      <P>
        Links are provided for convenience and context. Unless we expressly say otherwise, a link
        does not mean that we endorse or control the third-party service or all of its content.
      </P>
      <P>We are not responsible for the availability or content of a third-party website.</P>
    </LegalSection>

    <LegalSection heading="9. Our responsibility">
      <P>
        Nothing in these terms excludes or limits liability where doing so would be unlawful,
        including liability for death or personal injury caused by negligence, fraud or fraudulent
        misrepresentation.
      </P>
      <P>Subject to that, RM Incorporations Ltd is not responsible for a loss caused by:</P>
      <UL>
        <li>
          reliance on general public-website content instead of obtaining appropriate advice and
          reviewing definitive documents;
        </li>
        <li>an event outside our reasonable control;</li>
        <li>the unavailability or conduct of a third-party service; or</li>
        <li>unauthorised or unlawful use of the website.</li>
      </UL>
      <P>
        These website terms do not limit any liability or obligation expressly accepted in definitive
        documentation for a specific transaction.
      </P>
    </LegalSection>

    <LegalSection heading="10. Privacy and cookies">
      <P>
        Our <A href="/privacy">Privacy Notice</A> explains how we use personal data. Our{" "}
        <A href="/cookies">Cookies Notice</A> explains the technologies used by the website and the
        embedded scheduler.
      </P>
    </LegalSection>

    <LegalSection heading="11. Changes to these terms">
      <P>
        We may update these terms from time to time. The version displayed when you use the website
        applies to that use.
      </P>
    </LegalSection>

    <LegalSection heading="12. Governing law">
      <P>
        These terms and any non-contractual dispute arising from the public website are governed by
        English law.
      </P>
      <P>
        The courts of England and Wales will have jurisdiction, except where mandatory law gives an
        individual the right to bring proceedings elsewhere.
      </P>
    </LegalSection>

    <LegalSection heading="13. Contact">
      <P>RM Incorporations Ltd, trading as BrightCap</P>
      <P>Company number: 16715037</P>
      <P>Registered office: 16 Pettitts Lane, Dry Drayton, Cambridge, England, CB23 8BT</P>
      <P>
        Email: <MailLink email="support@brightcap.capital" />
      </P>
      <P>
        Telephone: <TelLink tel="0800 086 2278" href="tel:08000862278" />
      </P>
    </LegalSection>
  </LegalPageLayout>
);

export default Terms;
