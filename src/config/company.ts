/**
 * Single source of truth for BrightCap's legal and contact details.
 * BrightCap is the public brand; RM Incorporations Ltd is the legal operator.
 */
export interface CompanyDetails {
  brand: string;
  legalName: string;
  companyType: string;
  jurisdiction: string;
  companyNumber: string;
  registeredOffice: string;
  website: string;
  email: string;
  telephone: string;
  telephoneHref: string;
  legalDisclosure: string;
}

export const company: CompanyDetails = {
  brand: "BrightCap",
  legalName: "RM Incorporations Ltd",
  companyType: "Private limited company",
  jurisdiction: "England and Wales",
  companyNumber: "16715037",
  registeredOffice:
    "16 Pettitts Lane, Dry Drayton, Cambridge, England, CB23 8BT",
  website: "https://brightcap.capital/",
  email: "support@brightcap.capital",
  telephone: "0800 086 2278",
  telephoneHref: "tel:08000862278",
  legalDisclosure:
    "BrightCap is a trading name of RM Incorporations Ltd, a private limited company registered in England and Wales under company number 16715037. Registered office: 16 Pettitts Lane, Dry Drayton, Cambridge, England, CB23 8BT.",
};

export const currentYear = new Date().getFullYear();
