import { createContext, useContext } from "react";
import { LinkedAccount, Platform } from "./UserEmailSettingsConstants";

interface contextMeta<T> {
  records: T[];
  loading: boolean;
}

export const UserEmailSettingsContext = createContext<{
  accounts: contextMeta<LinkedAccount>;
  platforms: contextMeta<Platform>;
}>({
  accounts: { records: [], loading: false },
  platforms: { records: [], loading: false },
});

export const useLinkedAccountContext = () => {
  const { records, loading } = useContext(UserEmailSettingsContext).accounts;
  return { accounts: records, loading: loading };
};

export const usePlatformContext = () => {
  const { records, loading } = useContext(UserEmailSettingsContext).platforms;
  return { platforms: records, loading: loading };
};
