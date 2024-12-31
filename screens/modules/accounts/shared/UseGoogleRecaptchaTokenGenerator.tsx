import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useGoogleRecaptchaTokenGenerator = (action: string) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  function ensureExecuteIsSet() {
    return new Promise<(action?: string) => Promise<string>>(function (
      resolve
    ) {
      (function waitForExecute() {
        if (executeRecaptcha) return resolve(executeRecaptcha);
        setTimeout(waitForExecute, 30);
      })();
    });
  }

  return async () => {
    const execute = await ensureExecuteIsSet();

    return await execute(action);
  };
};
