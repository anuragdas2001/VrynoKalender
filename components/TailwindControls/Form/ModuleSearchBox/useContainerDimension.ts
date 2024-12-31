import { RefObject, useEffect, useState } from "react";

export const useContainerDimensions = (
  myRef: RefObject<HTMLInputElement> | null,
  lookupRef: RefObject<HTMLDivElement> | null
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

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef && myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimensions;
};
