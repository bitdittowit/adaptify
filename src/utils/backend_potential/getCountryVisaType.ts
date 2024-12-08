import { Country, VisaType } from "@/types";

const visaFreeCountries: ReadonlySet<Country> = new Set([
  'kz',
]);

export const getCountryVisaType = (country: Country): VisaType => {
  if (visaFreeCountries.has(country)) {
    return 'visa_free';
  }

  return 'visa_required';
};
