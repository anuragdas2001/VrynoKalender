import { cookieUserStore } from "../../../../shared/CookieUserStore";

export const getSecureImageObjectURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!url) {
      console.error("URL is not provided");
      return reject(new Error("URL is not provided"));
    }
    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const imageObjectURL = URL.createObjectURL(blob);
        resolve(imageObjectURL);
      })
      .catch((error) => {
        console.error("Error fetching the image:", error);
        reject(error);
      });
  });
};
