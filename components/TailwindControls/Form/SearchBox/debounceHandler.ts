export function handleDebounceSearch({
  fieldName,
  handleOnDebounce = () => {},
  setProcessingData = () => {},
  ref,
}: {
  fieldName: string;
  handleOnDebounce: (value: string | any) => void;
  setProcessingData?: (value: boolean) => void;
  ref?: any;
}) {
  let timeout: any = null;
  const input = document.getElementById(fieldName);
  if (ref?.current) {
    ref?.current?.addEventListener("keyup", function (e: any) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        setProcessingData(true);
        handleOnDebounce(ref?.current?.value);
      }, 1000);
    });
  } else {
    input?.addEventListener("keyup", function (e: any) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        setProcessingData(true);
        handleOnDebounce(e?.target?.value);
      }, 1000);
    });
  }
}
