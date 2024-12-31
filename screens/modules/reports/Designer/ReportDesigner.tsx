import { DesignerWrapperProps } from "./DesignerWrapper";
import dynamic from "next/dynamic";
import { Config } from "../../../../shared/constants";

export const ReportDesigner = dynamic<DesignerWrapperProps>(
  async () => {
    await import("@mescius/activereportsjs").then((d) =>
      d.Core.setLicenseKey(Config.activeReportJSKey)
    );
    return (await import("./DesignerWrapper")).default;
  },
  { ssr: false }
);
