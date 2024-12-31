import {
  FetchPolicy,
  LazyQueryResult,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import {
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { accountsPath, crmPath } from "../../../../../shared/apolloClient";
import { useAppFetchQuery } from "./useAppFetchQuery";
import { useAppFetchLazyQuery } from "./useAppFetchLazyQuery";
import { useAppSaveMutation } from "./useAppSaveMutation";
import { SaveData } from "../../../../../graphql/mutations/saveMutation";
import { BaseEntity } from "../../../../../models/BaseEntity";

export type LazyFetchQueryResult<T> = LazyQueryResult<FetchData<T>, FetchVars>;

export interface IAppFetchLazyQueryParams<T> {
  appPath?: string;
  onDataRecd?: (data: T[]) => void;
  completeResponse?: boolean;
  completeData?: (data: any) => void;
  fetchPolicy?: WatchQueryFetchPolicy | FetchPolicy;
  nextFetchPolicy?: WatchQueryFetchPolicy | FetchPolicy;
}

export type IFetchLazyQueryParams<T> = Omit<
  IAppFetchLazyQueryParams<T>,
  "appPath"
>;

export interface IAppFetchQueryParams<T> extends IAppFetchLazyQueryParams<T> {
  variables?: FetchVars;
}

export type IFetchQueryParams<T> = Omit<IAppFetchQueryParams<T>, "appPath">;

export interface IAppSaveMutationParams<T> {
  appPath?: string;
  onCompleted?: (data: SaveData<T>) => void;
}

export type ISaveMutationParams<T> = Omit<IAppSaveMutationParams<T>, "appPath">;

export const useCrmFetchLazyQuery = <T>({
  fetchPolicy,
  onDataRecd = (_: T[]) => {},
}: IFetchLazyQueryParams<T> = {}) =>
  useAppFetchLazyQuery({ appPath: crmPath, onDataRecd, fetchPolicy });

export const useAccountsFetchLazyQuery = <T>({
  onDataRecd = (_: T[]) => {},
}: IFetchLazyQueryParams<T> = {}) =>
  useAppFetchLazyQuery({
    appPath: accountsPath,
    onDataRecd,
  });

export const useCrmFetchQuery = <T>({
  variables,
  fetchPolicy,
  onDataRecd = (_: T[]) => {},
}: IFetchQueryParams<T> = {}) =>
  useAppFetchQuery({ appPath: crmPath, variables, onDataRecd, fetchPolicy });

export const useAccountsFetchQuery = <T>({
  fetchPolicy,
  variables,
  nextFetchPolicy,
  onDataRecd = (_: T[]) => {},
}: IFetchQueryParams<T> = {}) =>
  useAppFetchQuery({
    appPath: accountsPath,
    variables,
    onDataRecd,
    fetchPolicy,
    nextFetchPolicy,
  });

export const useCrmSaveMutation = <T extends BaseEntity>() =>
  useAppSaveMutation<T>({ appPath: crmPath });

export const useAccountsSaveMutation = <T extends BaseEntity>({
  onCompleted,
}: {
  onCompleted?: (data: SaveData<T>) => void;
} = {}) => useAppSaveMutation<T>({ appPath: accountsPath, onCompleted });
