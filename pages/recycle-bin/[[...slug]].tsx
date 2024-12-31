import React, { Dispatch, SetStateAction, useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GenericAuthenticationLayout } from "../../screens/layouts/GenericAuthenticationLayout";
import { GenericContainer } from "../../screens/layouts/GenericContainer";
import { RecycleBinScreen } from "../../screens/modules/recyclebin/RecycleBinScreen";

type MassDeleteSessionIdContextType = {
  massRecycleBinSessionId: Record<string, string[]>;
  setMassRecycleBinSessionId: Dispatch<
    SetStateAction<Record<string, string[]>>
  >;
};

export const MassRecycleBinSessionIdContext =
  React.createContext<MassDeleteSessionIdContextType>({
    massRecycleBinSessionId: {},
    setMassRecycleBinSessionId: () => {},
  });

export const useMassRecycleBinSessionId = () => {
  const context = useContext(MassRecycleBinSessionIdContext);
  if (!context) {
    throw new Error(
      "useMassRecycleBinSessionId must be used within a MassRecycleBinSessionIdProvider"
    );
  }
  return context;
};

function Index() {
  const { t, i18n } = useTranslation(["settings"]);
  const [massRecycleBinSessionId, setMassRecycleBinSessionId] = React.useState<
    Record<string, string[]>
  >({});
  return (
    <GenericAuthenticationLayout title={t("Recycle Bin")}>
      <MassRecycleBinSessionIdContext.Provider
        value={{ massRecycleBinSessionId, setMassRecycleBinSessionId }}
      >
        <GenericContainer>
          <RecycleBinScreen />
        </GenericContainer>
      </MassRecycleBinSessionIdContext.Provider>
    </GenericAuthenticationLayout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "recycle-bin"])),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: false } }, // See the "paths" section below
    ],
    fallback: true, // See the "fallback" section below
  };
}
export default Index;
