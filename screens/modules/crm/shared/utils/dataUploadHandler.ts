import { Config } from "../../../../../shared/constants";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";

export async function dataUploadHandler(
  data: any,
  fileKey: string | null = null,
  moduleName:
    | "emailTemplate"
    | "moduleTemplate"
    | undefined
    | string = "emailTemplate",
  serviceName = "notify",
  dataType = "text/html"
) {
  if (!data && moduleName !== "moduleView") return;
  var file = new FormData();
  file.append(
    "file",
    new Blob([`${dataType == "text/html" ? data : JSON.stringify(data)}`], {
      type: dataType,
    })
  );
  let url = `${Config.metaPrivateUploadUrl()}${serviceName}/${moduleName}/`;
  if (fileKey) {
    url = `${Config.metaPrivateUploadUrl()}${serviceName}/${moduleName}/${fileKey}/`;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      body: file,
      headers: {
        Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
      },
    }).then((response) => response.json());
    return response.fileId;
  } catch (error) {}
}
