export const uint8ArrayToDataURL = (
  uint8Array: BlobPart,
  contentType: string
) => {
  const blob = new Blob([uint8Array], { type: contentType });
  return URL.createObjectURL(blob);
};
