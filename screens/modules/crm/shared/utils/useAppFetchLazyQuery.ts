import { crmPath, queryOptionsApp } from "../../../../../shared/apolloClient";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { useLazyQuery } from "@apollo/client";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { IAppFetchLazyQueryParams } from "./operations";
import { boolean } from "yup";

export const useAppFetchLazyQuery = <T>({
  appPath = crmPath,
  onDataRecd = (_: T[]) => {},
  completeData = (data: any) => {},
  completeResponse = false,
  fetchPolicy,
  nextFetchPolicy,
}: IAppFetchLazyQueryParams<T> = {}) =>
  useLazyQuery<FetchData<T>, FetchVars>(FETCH_QUERY, {
    ...queryOptionsApp(
      appPath,
      fetchPolicy || "standby",
      nextFetchPolicy || "standby"
    ),
    onCompleted: (data: FetchData<T>) => {
      if (completeResponse) {
        completeData(data);
      } else if (data?.fetch?.data) {
        onDataRecd(data.fetch.data);
      }
    },
    onError: (error) => {
      Toast.error(error.message);
    },
  });
