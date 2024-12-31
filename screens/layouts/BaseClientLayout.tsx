import BaseLayout from "./BaseLayout";
import React from "react";

export const BaseClientLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return <BaseLayout title={title}>{children}</BaseLayout>;
};
