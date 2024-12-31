import React, { useCallback } from "react";
import EmailEditor, { EmailEditorProps } from "react-email-editor";
import { Content } from "@tiptap/react";
import { CustomTemplateEditorWrapper } from "../CustomTemplateEditor/CustomTemplateEditorWrapper";
import _ from "lodash";
import { UserStoreContext } from "../../../../../stores/UserStore";

type ConnectedCustomDragDropTemplateEditorProps = {
  emailEditorRef: any;
  name: string;
  data?: Content;
  showEditor?: boolean;
  addTextToUnlayerEditor?: string;
  insertContentIntoDragDrop?: string;
  setCurrentHtmlContentEditorID?: (value: string) => void;
};

export const ConnectedCustomDragDropTemplateEditor = ({
  emailEditorRef,
  name,
  data,
  showEditor = true,
  addTextToUnlayerEditor = "",
  insertContentIntoDragDrop,
  setCurrentHtmlContentEditorID = () => {},
}: ConnectedCustomDragDropTemplateEditorProps) => {
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;
  const [html, setHtml] = React.useState<string>("");
  const [backgroundColor, setBackgroundColor] = React.useState<string>("#fff");
  const [pointerLocation, setPointerLocation] = React.useState({ x: 0, y: 0 });

  const exportHtml = () => {
    (emailEditorRef?.current as any)?.editor?.exportHtml((data: any) => {
      const { design, html } = data;
      setHtml(html);
    });
  };

  const onLoad = useCallback(async () => {
    if (data && emailEditorRef.current) {
      await emailEditorRef.current.editor.loadDesign(data);
    }
  }, [emailEditorRef, showEditor]);

  return (
    <div className={`w-full h-full overflow-scroll`}>
      {!showEditor && html ? (
        <CustomTemplateEditorWrapper editMode={false} html={html} user={user} />
      ) : (
        <>
          {insertContentIntoDragDrop && (
            <div className="w-full flex items-center p-3 rounded-lg bg-gray-100 mx-3 my-2">
              <span className="text-gray-500">{`Copy and place to desired place in the editor :  `}</span>{" "}
              {insertContentIntoDragDrop}
            </div>
          )}
          <EmailEditor
            ref={emailEditorRef}
            onLoad={onLoad}
            onReady={() => {
              setBackgroundColor("#EEE");
              if (!showEditor) {
                exportHtml();
              }
              emailEditorRef.current.editor.addEventListener(
                "design:updated",
                function (data: any) {
                  var item = data.item;
                  setCurrentHtmlContentEditorID(
                    _.get(item?.values?._meta, "htmlID", null)
                  );
                }
              );
              emailEditorRef.current.editor.init({
                id: "editor",
                projectId: 212017,
              });
            }}
            style={{ padding: "0px", margin: "0px" }}
            options={{ className: "bg-red-300" }}
          />
          <div
            className="w-[300px]  h-[44px] absolute bottom-[10px] right-[8px]"
            style={{ backgroundColor: backgroundColor }}
          ></div>
        </>
      )}
    </div>
  );
};
