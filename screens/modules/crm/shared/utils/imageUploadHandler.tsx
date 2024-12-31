import { Toast } from "../../../../../components/TailwindControls/Toast";
import { Config, IHostNameConstants } from "../../../../../shared/constants";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";

export type imageUploadHandlerProps = {
  image: File;
  serviceName: string;
  moduleName: string;
  publicUrl?: boolean;
  params?: Partial<IHostNameConstants>;
};

export async function imageUploadHandler({
  image,
  serviceName,
  moduleName,
  publicUrl = true,
  params = undefined,
}: imageUploadHandlerProps) {
  if (!image) return;
  const form = new FormData();
  form.append("file", image);
  try {
    const response = await fetch(
      `${
        publicUrl
          ? Config.metaPublicUploadUrl(params)
          : Config.metaPrivateUploadUrl(params)
      }${serviceName}/${moduleName}/`,
      {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
        },
      }
    ).then((response) => response.json());
    if (!response.fileId && response.detail) {
      Toast.error(response.detail);
    }
    return response.fileId;
  } catch (error) {}
}
