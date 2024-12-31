import { Config } from "../../../../../shared/constants";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";

export async function bulkImportJobUploadHandler(file: File) {
  if (!file) return;
  const form = new FormData();
  form.append("file", file);

  try {
    const response = await fetch(
      `${Config.metaPrivateUploadUrl()}crm/bulkImportJob/`,
      {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
        },
      }
    ).then((response) => response.json());

    return response.fileId;
  } catch (error) {}
}

export async function bulkImportMappingUploadHandler(file: File) {
  if (!file) return;
  const form = new FormData();
  form.append("file", file);

  try {
    const response = await fetch(
      `${Config.metaPrivateUploadUrl()}crm/bulkImportMapping/`,
      {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
        },
      }
    ).then((response) => response.json());

    return response.fileId;
  } catch (error) {}
}
