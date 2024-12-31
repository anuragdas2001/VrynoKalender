import { useLazyQuery } from "@apollo/client";
import { get } from "lodash";
import React from "react";
import { FETCH_QUERY } from "../../graphql/queries/fetchQuery";
import { AccountModels } from "../../models/Accounts";

export type GetUserProfileInitialsProps = {
  value: string;
};

export const GetUserProfileInitials = ({
  value,
}: GetUserProfileInitialsProps) => {
  const [searchResults, setSearchResults] = React.useState<
    Record<string, string>
  >({});
  const [searchResultsLoading, setSearchResultsLoading] =
    React.useState<boolean>(false);

  const [getSearchedResults] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "standby",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (data) => {
      if (data?.fetch?.data && data?.fetch?.data?.length > 0) {
        setSearchResults(data.fetch.data[0]);
        setSearchResultsLoading(false);
        return;
      } else {
        setSearchResults({});
        setSearchResultsLoading(false);
        return;
      }
    },
  });

  React.useEffect(() => {
    getSearchedResults({
      variables: {
        modelName: AccountModels.User,
        fields: ["firstName", "lastName", "middleName", "id"],
        filters: [{ operator: "eq", name: "id", value: [value] }],
      },
    }).then();
    return;
  }, [value]);

  return (
    <div className="w-8 h-7 sm:w-10 sm:h-9 text-xs sm:text-xsm flex flex-row cursor-pointer justify-center items-center rounded-full bg-vryno-theme-blue-secondary text-white">
      {searchResultsLoading ? (
        <span>...</span>
      ) : searchResults && Object.keys(searchResults)?.length > 0 ? (
        <>
          <span>{`${
            get(searchResults, "firstName", "")
              ? get(searchResults, "firstName", "")[0]?.toUpperCase()
              : ""
          }`}</span>
          <span>{`${
            get(searchResults, "middleName", "")
              ? get(searchResults, "middleName", "")[0]?.toUpperCase()
              : ""
          }`}</span>
          <span>{`${
            get(searchResults, "lastName", "")
              ? get(searchResults, "lastName", "")[0]?.toUpperCase()
              : ""
          }`}</span>
        </>
      ) : (
        <span>N/A</span>
      )}
    </div>
  );
};
