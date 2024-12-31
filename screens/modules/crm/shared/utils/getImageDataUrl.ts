export function imageToUri(url: string, callback: (uri: any) => void) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  var base_image = new Image();
  base_image.src = url;
  base_image.onload = function () {
    canvas.width = base_image.width;
    canvas.height = base_image.height;
    ctx?.drawImage(base_image, 0, 0);
    callback(canvas.toDataURL("image/png"));
    canvas.remove();
  };
}
