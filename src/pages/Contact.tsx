import LegalPageLayout, {
  LegalSection,
  P,
  A,
  MailLink,
  TelLink,
} from "@/components/LegalPageLayout";

const Contact = () => (
  <LegalPageLayout
    title="Contact BrightCap | Cambridge Property Investment"
    description="Contact BrightCap, a trading name of RM Incorporations Ltd. General enquiries by email or telephone, plus full company information."
    path="/contact"
    heading="Contact BrightCap"
  >
    <LegalSection heading="General enquiries">
      <P>
        Email: <MailLink email="support@brightcap.capital" />
      </P>
      <P>
        Telephone: <TelLink tel="0800 086 2278" href="tel:08000862278" />
      </P>
    </LegalSection>

    <LegalSection heading="Company information">
      <P>BrightCap is a trading name of RM Incorporations Ltd.</P>
      <P>
        RM Incorporations Ltd is a private limited company registered in England and Wales under
        company number 16715037.
      </P>
      <P>Registered office: 16 Pettitts Lane, Dry Drayton, Cambridge, England, CB23 8BT.</P>
    </LegalSection>

    <LegalSection heading="MarketOffer enquiries">
      <P>
        For MarketOffer landlord or provider enquiries, please visit{" "}
        <A href="https://marketoffer.co.uk/">marketoffer.co.uk</A>.
      </P>
      <P>MarketOffer is a separate business.</P>
    </LegalSection>
  </LegalPageLayout>
);

export default Contact;
