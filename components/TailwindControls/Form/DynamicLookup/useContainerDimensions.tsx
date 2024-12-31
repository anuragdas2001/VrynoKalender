import React from "react";
import { RefObject } from "react";

export const useContainerDimensions = (
  myRef: RefObject<HTMLInputElement> | null,
  lookupRef: RefObject<HTMLDivElement> | null,
  setPanelState: (panelState: boolean) => void
) => {
  const getDimensions = () => {
    if (!myRef || !myRef.current) {
      return {
        width: 0,
        height: 0,
      };
    }
    return {
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight,
    };
  };

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef && myRef.current) {
      setDimensions(getDimensions());
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        lookupRef &&
        lookupRef.current &&
        !lookupRef.current.contains(event.target as Node)
      ) {
        setPanelState(false);
      }
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [myRef]);

  return dimensions;
};
