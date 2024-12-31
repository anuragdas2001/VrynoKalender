import React from "react";
import { getAppPathParts } from "../../../crm/shared/utils/getAppPathParts";
import { camelCase } from "change-case";
import { useLazyQuery } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { IEmailTemplate } from "../../../../../models/shared";
import { getDataFromUrl } from "../../../crm/shared/utils/getDataFromUrl";
import { Config } from "../../../../../shared/constants";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import { CustomTemplateEditorWrapper } from "../../../../../components/TailwindControls/Form/EmailTemplate/CustomTemplateEditor/CustomTemplateEditorWrapper";
import { LoginPageLoader } from "../../../accounts/Login/LoginPageLoader";
import dynamic from "next/dynamic";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { UserStoreContext } from "../../../../../stores/UserStore";
const ConnectedCustomDragDropTemplateEditor = dynamic(
  () =>
    import(
      "../../../../../components/TailwindControls/Form/EmailTemplate/CustomDragDropTemplateEditor/ConnectedCustomDragDropTemplateEditor"
    ).then((module) => module.ConnectedCustomDragDropTemplateEditor),
  { ssr: false }
);

type TemplateViewScreenProps = {
  id: string;
};

export const TemplateViewScreen = observer(
  ({ id }: TemplateViewScreenProps) => {
    const { ui } = getAppPathParts();
    const modelName = camelCase(ui || "");
    const heightRef = React.useRef(null);
    const userContext = React.useContext(UserStoreContext);
    const { user } = userContext;
    const [emailTemplate, setEmailTemplate] = React.useState<any>({});
    const emailEditorRef = React.useRef(null);
    const [dataFetchProcessing, setDataFetchProcessing] =
      React.useState<boolean>(true);
    const [fetchTemplate] = useLazyQuery<FetchData<IEmailTemplate>, FetchVars>(
      FETCH_QUERY,
      {
        fetchPolicy: "no-cache",
        onCompleted: async (responseOnCompletion) => {
          if (responseOnCompletion?.fetch?.data?.length) {
            let fetchedData = responseOnCompletion.fetch.data[0];
            let fileKeyData = await getDataFromUrl(
              `${Config.metaPrivateUploadUrl()}${
                modelName === "moduleTemplate" ? "crm" : "notify"
              }/${modelName}/${responseOnCompletion.fetch.data[0].fileKey}`
            ).then((data) => data);
            setEmailTemplate({
              ...fetchedData,
              fileKey: fileKeyData,
              templateModuleName: fetchedData.templateModuleName,
            });
          }
          setDataFetchProcessing(false);
        },
      }
    );

    React.useEffect(() => {
      if (modelName) {
        setDataFetchProcessing(true);
        fetchTemplate({
          context: {
            headers: {
              vrynopath: modelName === "moduleTemplate" ? "crm" : "notify",
            },
          },
          variables: {
            modelName: modelName,
            fields: ["id", "templateModuleName", "contentType", "fileKey"],
            filters: [{ operator: "eq", name: "id", value: id }],
          },
        });
      } else {
        setDataFetchProcessing(false);
      }
    }, [modelName]);

    React.useEffect(() => {
      if (heightRef) {
        setHeight(heightRef);
      }
    });

    if (dataFetchProcessing && Object.keys(emailTemplate).length <= 0) {
      return <LoginPageLoader />;
    } else {
      return (
        <Formik initialValues={{}} onSubmit={() => {}}>
          {() => (
            <div ref={heightRef} className="p-6 overflow-y-auto">
              <div className="bg-white py-5 px-6 w-full rounded-2xl shadow-sm">
                {typeof JSON.parse(emailTemplate["fileKey"]) === "string" ? (
                  <CustomTemplateEditorWrapper
                    editMode={true}
                    html={emailTemplate["fileKey"]}
                    user={user}
                  />
                ) : (
                  <ConnectedCustomDragDropTemplateEditor
                    emailEditorRef={emailEditorRef}
                    name={"fileKey"}
                    data={
                      emailTemplate && emailTemplate["fileKey"]
                        ? JSON.parse(emailTemplate["fileKey"])
                        : null
                    }
                    showEditor={false}
                  />
                )}
              </div>
            </div>
          )}
        </Formik>
      );
    }
  }
);
