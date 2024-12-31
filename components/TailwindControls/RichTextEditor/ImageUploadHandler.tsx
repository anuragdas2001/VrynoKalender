import { Config } from "../../../shared/constants";
import { cookieUserStore } from "../../../shared/CookieUserStore";

export async function ImageUploadHandler(image: File) {
  if (!image) return;
  const form = new FormData();
  form.append("file", image);
  try {
    const response = await fetch(Config.fileFetchUrl(), {
      method: "POST",
      body: form,
      headers: {
        Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
      },
    }).then((response) => response.json());
    return response.fileId;
  } catch (error) {}
}
