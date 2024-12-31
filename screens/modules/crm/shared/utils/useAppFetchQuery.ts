import { crmPath, queryOptionsApp } from "../../../../../shared/apolloClient";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { useQuery } from "@apollo/client";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { IAppFetchQueryParams } from "./operations";

export const useAppFetchQuery = <T>({
  appPath = crmPath,
  fetchPolicy,
  nextFetchPolicy = "standby",
  variables,
  completeData = (data: any) => {},
  completeResponse = false,
  onDataRecd = (_: T[]) => {},
}: IAppFetchQueryParams<T>) =>
  useQuery<FetchData<T>, FetchVars>(FETCH_QUERY, {
    ...queryOptionsApp(appPath, fetchPolicy, nextFetchPolicy),
    variables,
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
