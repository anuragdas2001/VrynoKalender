import { cookieUserStore } from "../../../shared/CookieUserStore";

export const fetchGatewayFile = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const method = "GET";
    if (url) {
      fetch(url, {
        method: method,
        mode: "cors",
        headers: {
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          resolve(response);
        });
    }
    // reject("Empty url not allowed");
  });
};
