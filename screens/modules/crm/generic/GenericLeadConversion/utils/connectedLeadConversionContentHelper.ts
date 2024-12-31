import { LazyQueryExecFunction, LazyQueryResult } from "@apollo/client";
import {
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import { BaseGenericObjectType } from "../../../../../../models/shared";
import { toast } from "react-toastify";
import {
  ILeadContactOrganization,
  IRelatedLeadModuleVariables,
} from "./genericLeadConversionInterfaces";

export const commonContactOrganizationFetchField = [
  "id",
  "createdBy",
  "createdAt",
  "name",
  "recordStatus",
  "moduleName",
];

const handleContactOrganizationResponseData = (
  response: LazyQueryResult<FetchData<BaseGenericObjectType>, FetchVars>,
  pageNumber: number,
  setResponseData: (value: { name: string; data: {} }) => void,
  leadContactOrganizationState: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  }
) => {
  if (!response?.data?.fetch?.data) {
    toast.error(response?.data?.fetch?.message);
    return;
  }
  const name = response.data?.fetch.messageKey.split("-")[0];
  let recordFound = false;
  if (
    (name === "contact" || name === "organization") &&
    response?.data &&
    response.data.fetch?.data?.length
  ) {
    recordFound = true;
    setResponseData({
      name: name,
      data: {
        ...leadContactOrganizationState[name],
        id: response.data?.fetch.data.map((value) => value?.id),
        available: true,
        data: response.data?.fetch.data,
        showTable: true,
        checked: true,
        selectedId:
          pageNumber === 1
            ? response.data?.fetch.data[0].id
            : leadContactOrganizationState[name].selectedId,
        selectedItem:
          pageNumber === 1
            ? [response.data?.fetch.data[0]]
            : leadContactOrganizationState[name].selectedItem,
        itemsCount: response.data?.fetch.count,
        currentPageNumber: pageNumber,
        processed: true,
      },
    });
  }
  if (
    (name === "contact" || name === "organization") &&
    recordFound === false
  ) {
    setResponseData({
      name: name,
      data: {
        ...leadContactOrganizationState[name],
        available: false,
        createNew: true,
        checked: true,
        processed: true,
      },
    });
  }
};

export const contactOrganizationRequestHandler = (
  dataVariableObject: IRelatedLeadModuleVariables | null,
  pageNumber: number,
  fetchContactData: LazyQueryExecFunction<
    FetchData<BaseGenericObjectType>,
    FetchVars
  >,
  fetchOrganizationData: LazyQueryExecFunction<
    FetchData<BaseGenericObjectType>,
    FetchVars
  >,
  setResponseData: (value: { name: string; data: {} }) => void,
  leadContactOrganizationState: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  }
) => {
  if (!dataVariableObject) return;
  const requestObject = {
    variables: {
      ...dataVariableObject.variables,
      pageNumber: pageNumber,
    },
  };
  if (requestObject.variables.modelName === "contact") {
    fetchContactData(requestObject).then((response) =>
      handleContactOrganizationResponseData(
        response,
        pageNumber,
        setResponseData,
        leadContactOrganizationState
      )
    );
  }
  if (requestObject.variables.modelName === "organization") {
    fetchOrganizationData(requestObject).then((response) =>
      handleContactOrganizationResponseData(
        response,
        pageNumber,
        setResponseData,
        leadContactOrganizationState
      )
    );
  }
};
