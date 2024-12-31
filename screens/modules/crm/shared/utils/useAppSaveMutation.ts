import {
  crmPath,
  mutationsOptionsApp,
} from "../../../../../shared/apolloClient";
import { useMutation } from "@apollo/client";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { IAppSaveMutationParams } from "./operations";
import { BaseEntity } from "../../../../../models/BaseEntity";
import { TFunction } from "next-i18next";

export const useAppSaveMutation = <T>({
  appPath = crmPath,
  onCompleted,
}: IAppSaveMutationParams<T>) => {
  return useMutation<SaveData<T>, SaveVars<T>>(SAVE_MUTATION, {
    ...mutationsOptionsApp<SaveData<T>>(appPath, onCompleted),
    onError: (error) => {
      Toast.error(error.message);
    },
  });
};

export const postSaveMutation = <T extends BaseEntity>(
  data: SaveData<T> | null | undefined,
  t: TFunction,
  successMessage?: string,
  onSuccess: (data: T) => void = () => {}
) => {
  if (
    data &&
    data.save.data &&
    data.save.data.id &&
    data.save.messageKey.endsWith("-success")
  ) {
    if (successMessage) {
      Toast.success(successMessage);
    }
    onSuccess(data.save.data);
    return;
  }
  if (data && data.save.messageKey) {
    Toast.error(data.save.messageKey);
    return;
  }
  Toast.error(t("common:unknown-message"));
};
