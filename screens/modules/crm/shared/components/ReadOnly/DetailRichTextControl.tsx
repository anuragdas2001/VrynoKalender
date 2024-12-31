import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { NoDataControl } from "./NoDataControl";
import ViewRichTextEditor from "../../../../../../components/TailwindControls/Form/RichTextEditor/ViewRichTextEditor";
import getNoteSuggestions from "../../../generic/GenericModelDetails/Notes/NoteSuggestions";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_QUERY } from "../../../../../../graphql/queries/searchQuery";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";

export const DetailRichTextControl = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  richTextOverflowScroll,
  displayType,
  appName,
  modelName,
  showFieldEditInput = false,
  updateModelFieldData,
  fixedWidth,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "data"
  | "field"
  | "truncateData"
  | "fontSize"
  | "fontColor"
  | "richTextOverflowScroll"
  | "displayType"
  | "appName"
  | "modelName"
  | "showFieldEditInput"
  | "updateModelFieldData"
  | "fixedWidth"
>) => {
  const [richTextData, setRichTextData] = React.useState();
  const [noteSuggestions, setNoteSuggestions] = React.useState<any>();
  const [editInputDetails, setEditInputDetails] =
    React.useState<IEditInputDetails>({
      visible: false,
      fieldData: null,
      id: undefined,
    });

  const [getSearchResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
    onError: (error) => {
      console.error(error);
    },
  });

  React.useEffect(() => {
    if (data[field.value]) {
      try {
        const obj = JSON.parse(data[field.value]);
        if (obj && typeof obj === "object") {
          setRichTextData(obj);
        } else {
          setRichTextData(data[field.value]);
        }
      } catch (e) {
        setRichTextData(data[field.value]);
      }
    }
  }, [data?.[field?.value || ""]]);

  React.useEffect(() => {
    if (field.value === "note") {
      setNoteSuggestions(getNoteSuggestions(getSearchResults));
    }
  }, []);

  if (editInputDetails?.visible) {
    return (
      <FieldEditInput
        field={field.field}
        appName={appName}
        modelName={modelName}
        editInputDetails={editInputDetails}
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        updateModelFieldData={updateModelFieldData ?? null}
      />
    );
  }

  if (data[field.value] && richTextData) {
    if (field.value === "note") {
      return (
        <ViewRichTextEditor
          data={richTextData}
          supportMentions={true}
          mentionSuggestions={noteSuggestions}
          fontSize={fontSize}
          fontColor={fontColor}
          truncateData={truncateData}
          richTextOverflowScroll={richTextOverflowScroll}
          displayType={displayType}
        />
      );
    } else {
      return (
        <div
          className={
            showFieldEditInput ? "flex items-center gap-x-1 group" : ""
          }
        >
          <ViewRichTextEditor
            data={richTextData}
            fontSize={fontSize}
            fontColor={fontColor}
            truncateData={truncateData}
            richTextOverflowScroll={richTextOverflowScroll}
            displayType={displayType}
            field={field}
            fixedWidth={fixedWidth}
          />
          <ShowFieldEdit
            setEditInputDetails={(value: IEditInputDetails) =>
              setEditInputDetails(value)
            }
            dataToDisplay={richTextData}
            field={field.field}
            showFieldEditInput={showFieldEditInput}
            id={data?.["id"]}
          />
        </div>
      );
    }
  } else
    return (
      <div
        className={showFieldEditInput ? "flex items-center gap-x-1 group" : ""}
      >
        <NoDataControl
          dataTestId={`${field?.label || "rich-text"}--`}
          fontSize={fontSize}
        />
        <ShowFieldEdit
          setEditInputDetails={(value: IEditInputDetails) =>
            setEditInputDetails(value)
          }
          dataToDisplay={""}
          field={field.field}
          showFieldEditInput={showFieldEditInput}
          id={data?.["id"]}
        />
      </div>
    );
};
