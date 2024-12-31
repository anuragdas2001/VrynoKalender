import { PageLoader } from "../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";

export const LoginPageLoader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <PageLoader />
    </div>
  );
};
