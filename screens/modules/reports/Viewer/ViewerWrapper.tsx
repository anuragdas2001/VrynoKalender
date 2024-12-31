import React from "react";
import { Viewer } from "@mescius/activereportsjs-react";
import { Props as ViewerProps } from "@mescius/activereportsjs-react";
import { PageReport, Rdl } from "@mescius/activereportsjs/lib/ar-js-core";

// eslint-disable-next-line react/display-name
const ViewerWrapper = (props: ViewerWrapperProps) => {
  // const [loading, setLoading] = React.useState(false);
  const ref = React.useRef<Viewer>(null);
  React.useEffect(() => {
    if (props.reportFile && props.reportParams) {
      ref.current?.Viewer.open(props.reportFile, {
        ReportParams: props.reportParams,
      }).then((e) => {
        console.log(e);
      });
      return;
    }
    if (props.reportFile) {
      ref.current?.Viewer.open(props.reportFile).then((e) => {
        console.log(e);
      });
      return;
    }
  }, [props.reportFile, props.reportParams]);
  return (
    <>
      <Viewer {...props} ref={ref} />
    </>
  );
};

export type ViewerWrapperProps = ViewerProps & {
  reportFile?: Rdl.Report | PageReport;
  reportParams?: {
    Name: string;
    Value: any;
  }[];
};

export default ViewerWrapper;
