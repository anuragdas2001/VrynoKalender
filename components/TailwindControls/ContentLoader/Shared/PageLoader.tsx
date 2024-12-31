import { paramCase } from "change-case";
import React from "react";

export const PageLoader = ({ scale = 2 }: { scale?: number }) => {
  return (
    <div
      className="page-loader"
      style={{ transform: `scale(${scale})` }}
      data-testid={paramCase(`search-loading`)}
    >
      <div className="strip"></div>
      <div className="strip"></div>
      <div className="strip"></div>
    </div>
  );
};
