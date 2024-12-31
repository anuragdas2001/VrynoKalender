import React from "react";
import { getSecureImageObjectURL } from "./getSecureImageObjectURL";

export type SecureImageProps = {
  url: string;
  alt: string;
  className: string;
};

export const SecureImage = ({ url, alt, className }: SecureImageProps) => {
  const [imageData, setImageData] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (url) {
      getSecureImageObjectURL(url)
        .then((secureUrl) => {
          setImageData(secureUrl);
        })
        .catch((err) => {
          console.error("Error fetching secure image:", err);
        });
    }
  }, [url]);
  if (!imageData) {
    return <></>;
  }
  return <img src={imageData} alt={alt} className={className} />;
};
