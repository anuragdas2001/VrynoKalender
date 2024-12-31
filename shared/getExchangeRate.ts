import Axios from "axios";
export const getExchangeRate = async (currencyCode: string): Promise<any> => {
  const response = await Axios.get(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyCode.toLowerCase()}.json`
  );
  return response;
};
