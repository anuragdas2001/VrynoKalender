import React from "react";
import { propertyType } from "./CustomTemplateEditorWrapper";
import { FormikValues, useFormikContext } from "formik";
import Button from "../../Button/Button";
import { User } from "../../../../../models/Accounts";

type CustomTemplateEditorProps = {
  properties: propertyType[];
  editMode: boolean;
  html?: string;
  user: User | null;
  currentSelectedProperty: propertyType;
  setCurrentSelectedProperty: (value: propertyType) => void;
  setHtmlEditorCursorLocation: (value: number) => void;
};

export const CustomTemplateEditor = ({
  properties,
  editMode = false,
  html,
  user,
  currentSelectedProperty,
  setCurrentSelectedProperty,
  setHtmlEditorCursorLocation,
}: CustomTemplateEditorProps) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [showPreview, setShowPreview] = React.useState<boolean>(editMode);

  return (
    <div className="h-[600px] bg-white w-full rounded-md">
      <div className={`w-full h-full gap-x-2 px-4 py-2`}>
        <div className="my-2 ">
          <div className="w-full flex items-center justify-between">
            <label className={`font-medium text-gray-600`}>
              {showPreview ? `HTML Output : ` : `HTML Code : `}
            </label>
            <div>
              <Button
                id={`${
                  showPreview ? "cancel-preview-button" : "show-preview-button"
                }`}
                userEventName={
                  showPreview
                    ? "cancel-show-preview-button-click"
                    : "show-preview-button-click"
                }
                kind={"next"}
                buttonType="thin"
                onClick={() => setShowPreview(!showPreview)}
                customStyle={`flex flex-row items-center justify-center py-2 px-6 w-40 rounded-md bg-vryno-theme-light-blue text-white`}
              >
                {showPreview ? "Show Code" : "Show Preview"}
              </Button>
            </div>
          </div>
        </div>
        {!showPreview ? (
          <textarea
            name="htmlEditor"
            value={html ? html : values["htmlEditor"]}
            placeholder="Enter Html code here"
            onChange={(e) => {
              setHtmlEditorCursorLocation(e.target.selectionStart);
              setFieldValue("htmlEditor", e.currentTarget.value);
            }}
            onClick={(e) => {
              setHtmlEditorCursorLocation(
                (e.target as HTMLTextAreaElement).selectionStart
              );
            }}
            disabled={html ? true : false}
            className={`w-full h-[525px] card-scroll overflow-auto outline-none rounded-lg bg-gray-100`}
          />
        ) : (
          <div
            className={`w-full h-[525px] card-scroll overflow-y-auto`}
            dangerouslySetInnerHTML={{
              __html: `${
                html
                  ? html
                  : values["htmlEditor"]
                  ? values["htmlEditor"]
                  : `<div className="text-gray-500">No content</div>`
              }`,
            }}
          />
        )}
      </div>
    </div>
  );
};
