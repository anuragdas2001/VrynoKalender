import React from "react";
import { Designer, DesignerProps } from "@mescius/activereportsjs-react";

// eslint-disable-next-line react/display-name
const DesignerWrapper = (props: DesignerWrapperProps) => {
  const ref = React.useRef<Designer>(null);
  React.useEffect(() => {
    if (props.reportUri) {
      ref.current?.setReport({ id: props.reportUri });
    }
  }, [props.reportUri]);
  return <Designer {...props} ref={ref} />;
};

export type DesignerWrapperProps = DesignerProps & { reportUri?: string };

export default DesignerWrapper;
