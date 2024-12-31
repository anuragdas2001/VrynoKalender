import { cookieUserStore } from "./../../../../../shared/CookieUserStore";
import { Toast } from "../../../../../components/TailwindControls/Toast";

export function downloadFile(url: string, fileName: string) {
  let anchor = document.createElement("a");
  document.body.appendChild(anchor);
  let headers = new Headers();
  headers.append("Authorization", `Bearer ${cookieUserStore.getAccessToken()}`);
  fetch(url, { headers })
    .then((response) => {
      if (response.ok) {
        return response.blob();
      }
      Toast.error("Error downloading file");
      return undefined;
    })
    .then((fetchedBlob) => {
      if (!fetchedBlob) {
        return;
      }
      let objectUrl = window.URL.createObjectURL(fetchedBlob);
      anchor.href = objectUrl;
      anchor.download = fileName;
      anchor.click();
      window.URL.revokeObjectURL(objectUrl);
    });
}
