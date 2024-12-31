export const companyFields = [
  "id",
  "name",
  "instanceAdmins",
  "phoneNumber",
  "billingAddress",
  "billingCity",
  "billingState",
  "billingCountry",
  "billingZipcode",
  "logo",
  "country",
  "email",
  "fax",
  "mobileNumber",
  "employeeCount",
  "website",
  "branding",
  "description",
  "currency",
];

export const companyFieldsInitialValues = {
  name: "",
  instanceAdmins: [],
  phoneNumber: "",
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingCountry: "",
  billingZipcode: "",
  logo: "",
  country: "",
  email: "",
  fax: "",
  mobileNumber: "",
  employeeCount: null,
  website: "",
  branding: "",
  description: "",
  currency: "",
};

export interface ICompanyDetailsData {
  id: string | null;
  instanceAdmins: string[];
  phoneNumber?: string;
  description?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingZipcode?: string;
  logo?: string;
  name?: string;
  currency?: string;
  email?: string;
  fax?: string;
  mobileNumber?: string;
  employeeCount?: number;
  website?: string;
  branding?: string;
  country?: string;
  recordStatus?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  timezone?: string;
}
