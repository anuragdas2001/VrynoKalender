import { cookieUserStore } from "./../../../../../shared/CookieUserStore";

export const getDataFromUrl = async (url: string, data = {}) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
    },
  }).then((response) => response.text());
  return response;
};
