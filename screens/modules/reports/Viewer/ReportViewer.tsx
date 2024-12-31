import { ViewerWrapperProps } from "./ViewerWrapper";
// use the dynamic import to load the report viewer wrapper: https://nextjs.org/docs/advanced-features/dynamic-import
import dynamic from "next/dynamic";
import { Config } from "../../../../shared/constants";
export const ReportViewer = dynamic<ViewerWrapperProps>(
  async () => {
    await import("@mescius/activereportsjs").then((d) =>
      d.Core.setLicenseKey(Config.activeReportJSKey)
    );
    return (await import("./ViewerWrapper")).default;
  },
  { ssr: false }
);
