import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { FormikValues, useFormikContext } from "formik";
import { INavigation } from "../../../../../../../models/INavigation";
import { IModuleMetadata } from "../../../../../../../models/IModuleMetadata";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { IGenericModel } from "../../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type NavigationFormFieldsProps = {
  data: INavigation | null;
  editMode: boolean;
  saveLoading: boolean;
  handleSave: () => void;
  onCancel: () => void;
  currentNavigationGroup: string;
  navigationByGroupKey: INavigation[];
  navigationItems: INavigation[];
  genericModels: IGenericModel;
  allModulesFetched: boolean;
};

const NavigationFormFields = ({
  data,
  editMode,
  saveLoading,
  handleSave,
  onCancel,
  currentNavigationGroup,
  navigationByGroupKey,
  navigationItems,
  genericModels,
  allModulesFetched,
}: NavigationFormFieldsProps) => {
  const { t } = useTranslation(["common"]);
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [navTypeMetadataError, setNavTypeMetadataError] = useState<
    string | undefined
  >(undefined);
  const [orderError, setOrderError] = React.useState<string>();
  const [modulesFetched, setModulesFetched] = useState<IModuleMetadata[]>([]);

  React.useEffect(() => {
    setFieldValue("groupKey", currentNavigationGroup);
  }, [currentNavigationGroup]);
  const [navigationAlreadyExist, setNavigationAlreadyExist] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (values["navType"] === "module" && allModulesFetched) {
      let moduleInfoFromStore: IModuleMetadata[] = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model !== undefined)
          ?.filter(
            (moduleItem: IModuleMetadata) =>
              moduleItem.name !== "quotedItem" &&
              moduleItem.name !== "orderedItem" &&
              moduleItem.name !== "invoicedItem" &&
              moduleItem.name !== "purchaseItem"
          ),
      ];
      setModulesFetched([...moduleInfoFromStore]);
      setFieldValue(
        "navTypeMetadata",
        data?.navTypeMetadata[Object.keys(data?.navTypeMetadata || {})[0]]
      );
    }
  }, [values["navType"], allModulesFetched]);

  React.useEffect(() => {
    let orderExist = false;
    if (values["order"]) {
      navigationByGroupKey.forEach((item) => {
        if (item.order === Number(values["order"])) {
          orderExist = true;
        }
      });
    }
    orderExist && data?.order !== values["order"]
      ? setOrderError("Order already exist")
      : setOrderError(undefined);
  }, [values["order"]]);

  React.useEffect(() => {
    if (editMode) return;
    let highestOrder = 0;
    navigationByGroupKey.forEach((item) =>
      highestOrder < item.order ? (highestOrder = item.order) : highestOrder
    );
    setFieldValue("order", highestOrder + 1);
  }, [navigationByGroupKey]);

  React.useEffect(() => {
    if (!values["navType"]) return;
    if (values["navType"] === "link") {
      const isValidUrl = () => {
        var urlPattern = new RegExp(
          "^(https:\\/\\/)" + // validate protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
            "(\\#[-a-z\\d_]*)?$",
          "i"
        );
        return !!urlPattern.test(values["navTypeMetadata"]);
      };

      if (!isValidUrl()) {
        setNavTypeMetadataError("Please enter a valid url");
      } else {
        setNavTypeMetadataError(undefined);
      }
    } else if (values["navType"] === "module") {
      setNavTypeMetadataError(undefined);
    }
  }, [values["navType"], values["navTypeMetadata"]]);

  React.useEffect(() => {
    let navigationName = `${values["label"]}`;
    let navigationAlreadyExist = navigationItems.filter(
      (navigation) =>
        navigation?.navTypeMetadata?.moduleName?.toLocaleLowerCase() ===
        navigationName?.toLocaleLowerCase()
    );
    if (navigationAlreadyExist.length > 0) {
      setNavigationAlreadyExist("Field already exist");
    } else {
      setNavigationAlreadyExist(null);
    }
  }, [values["label"]]);

  React.useEffect(() => {
    if (!values["label"] && !editMode) {
      setFieldValue("name", values["label"]);
    }
    if (values["label"] && !editMode) {
      let navigationName = `${values["label"]}`;
      setFieldValue("name", navigationName);
    }
  }, [values["label"]]);

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <FormInputBox
          required={true}
          name="label"
          label="Navigation Label"
          type="text"
        />
        <FormInputBox
          required={true}
          name="name"
          label="Navigation name"
          type="text"
          disabled={true}
          externalError={
            !editMode && navigationAlreadyExist ? navigationAlreadyExist : ""
          }
        />
        <FormDropdown
          required={true}
          name={"navType"}
          label={"Navigation Type"}
          disabled={editMode}
          options={[
            { label: "Link", value: "link" },
            { label: "Module", value: "module" },
          ]}
          onChange={(selectedOption) => {
            setFieldValue("navType", selectedOption.currentTarget.value);
            setFieldValue("navTypeMetadata", undefined);
          }}
        />
        {values["navType"] === "module" ? (
          <FormDropdown
            required={true}
            name={"navTypeMetadata"}
            label={"Navigation Type Metadata"}
            options={modulesFetched.map((module) => {
              return {
                label: module.systemDefined
                  ? module.label.en
                  : `${module.label.en} (${module.name})`,
                value: module.name,
              };
            })}
            onChange={(selectedOption) => {
              setFieldValue(
                "navTypeMetadata",
                selectedOption.currentTarget.value
              );
            }}
            disabled={
              !values["navType"] || (editMode && data?.systemDefined === true)
            }
          />
        ) : (
          <FormInputBox
            required={true}
            name="navTypeMetadata"
            label="Navigation Type Metadata"
            externalError={navTypeMetadataError}
            disabled={
              !values["navType"] || (editMode && data?.systemDefined === true)
            }
          />
        )}
        <FormInputBox
          name="groupKey"
          label="Group Key"
          type="text"
          disabled={true}
        />
        <div className={`hidden`}>
          <FormInputBox
            required={true}
            name="order"
            label="Order"
            type="number"
            externalError={orderError}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          disabled={saveLoading}
          onClick={onCancel}
          kind="back"
          userEventName="navigation-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          loading={saveLoading}
          disabled={
            navigationAlreadyExist
              ? true
              : !values["label"] || !values["navType"]
              ? true
              : values["navType"] === "module" && !values["navTypeMetadata"]
              ? true
              : saveLoading ||
                navTypeMetadataError !== undefined ||
                orderError !== undefined
          }
          onClick={() => {
            handleSave();
          }}
          kind="primary"
          userEventName="navigation-save:submit-click"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};

export default NavigationFormFields;
