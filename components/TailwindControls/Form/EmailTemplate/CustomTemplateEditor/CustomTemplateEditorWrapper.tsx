import { Formik, FormikValues } from "formik";
import React from "react";
import { CustomTemplateEditor } from "./CustomTemplateEditor";
import { User } from "../../../../../models/Accounts";

type CustomTemplateEditorWrapperProps = {
  editMode: boolean;
  html?: string;
  user: User | null;
  setHtmlEditorCursorLocation?: (value: number) => void;
};

export type propertyType = {
  name: string;
  label: string;
  icon: React.ReactElement;
  style: string;
  startTag: string;
  endTag: string;
  visible?: boolean;
};

const properties: propertyType[] = [
  {
    name: "normal",
    label: "",
    icon: <></>,
    style: "",
    startTag: "<p>",
    endTag: "</p>",
    visible: false,
  },
  {
    name: "heading1",
    label: "H1",
    icon: <p>H1</p>,
    style: "",
    startTag: `<h1>`,
    endTag: `</h1>`,
  },
  {
    name: "heading2",
    label: "H2",
    icon: <p>H2</p>,
    style: "",
    startTag: `<h2>`,
    endTag: `</h2>`,
  },
  {
    name: "heading3",
    label: "H3",
    icon: <p>H3</p>,
    style: "",
    startTag: `<h3>`,
    endTag: `</h3>`,
  },
  {
    name: "heading4",
    label: "H4",
    icon: <p>H4</p>,
    style: "",
    startTag: `<h4>`,
    endTag: `</h4>`,
  },
  {
    name: "heading5",
    label: "H5",
    icon: <p>H5</p>,
    style: "",
    startTag: `<h5>`,
    endTag: `</h5>`,
  },
  {
    name: "heading6",
    label: "H6",
    icon: <p>H6</p>,
    style: "",
    startTag: `<h6>`,
    endTag: `</h6>`,
  },
];

export const CustomTemplateEditorWrapper = ({
  editMode,
  html,
  user,
  setHtmlEditorCursorLocation = () => {},
}: CustomTemplateEditorWrapperProps) => {
  const [currentSelectedProperty, setCurrentSelectedProperty] =
    React.useState<propertyType>({
      name: "normal",
      label: "",
      icon: <></>,
      style: "",
      startTag: "<p>",
      endTag: "</p>",
      visible: false,
    });

  return (
    <CustomTemplateEditor
      html={html}
      properties={properties}
      editMode={editMode}
      user={user}
      currentSelectedProperty={currentSelectedProperty}
      setCurrentSelectedProperty={setCurrentSelectedProperty}
      setHtmlEditorCursorLocation={setHtmlEditorCursorLocation}
    />
  );
};
