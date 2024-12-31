import { get } from "lodash";
import { ICustomField } from "../../../../../models/ICustomField";
import { GenericListHeaderType } from "../../../../../components/TailwindControls/Lists/GenericList";

const modelDefaultFieldsList: Record<string, string[]> = {
  Contact: [
    "image",
    "firstName",
    "name",
    "email",
    "phoneNumber",
    "address",
    "city",
    "state",
    "country",
    "zipcode",
    "ownerId",
    "industryId",
    "parentContactId",
    "relationshipTypeId",
    "description",
  ],
  Organisation: [
    "organisationName",
    "phoneNumber",
    "email",
    "address",
    "cityId",
    "stateId",
    "countryId",
    "zipcode",
    "status",
    "industry",
    "parentContact",
    "website",
    "linkedin",
    "taxNumber",
    "registrationNumber",
  ],
  Lead: [
    "firstName",
    "lastName",
    "leadOwner",
    "leadAssignee",
    "phoneNumber",
    "email",
    "address",
    "cityId",
    "stateId",
    "countryId",
    "zipcode",
    "status",
    "source",
    "website",
    "score",
    "stageId",
    "opportunity",
    "description",
  ],
  Deal: [
    "name",
    "dealOwnerName",
    "instanceId",
    "description",
    "expectedRevenue",
    "dealSource",
    "contactId",
    "dealPipelineId",
    "dealStageId",
    "dealTypeId",
    "phoneNumber",
    "probability",
  ],
};

export function getVisibleFieldsList(fieldsList: ICustomField[]) {
  return fieldsList.filter((field) => field.visible);
}

//func
export function getCustomFieldsArray(fieldsList: ICustomField[]) {
  if (!fieldsList?.length) return [];
  const fieldsArray = [];
  for (let i = 0; i < fieldsList?.length; i++) {
    if (fieldsList[i].visible && !fieldsList[i].systemDefined) {
      fieldsArray.push(`fields.${fieldsList[i].name}`);
    }
  }
  return fieldsArray;
}

export function getVisibleModuleFieldsArray(
  fieldsList: Array<ICustomField>,
  modelName: string,
  modifyFields: boolean = false
) {
  const fieldsArray = [];
  for (let i = 0; i < fieldsList?.length; i++) {
    if (fieldsList[i].visible) {
      if (
        fieldsList[i].name === "relatedTo" &&
        modifyFields &&
        ["task", "meeting", "callLog"].includes(modelName)
      ) {
        fieldsArray.push(`relatedTo { moduleName, recordId, createdAt }`);
      } else if (
        fieldsList[i].name === "repeat" &&
        modifyFields &&
        modelName === "task"
      ) {
        fieldsArray.push(`repeat { frequency, termType, termValue }`);
      } else if (
        fieldsList[i].name === "discount" &&
        modifyFields &&
        (modelName === "quote" ||
          modelName === "invoice" ||
          modelName === "salesOrder" ||
          modelName === "purchaseOrder")
      ) {
        fieldsArray.push(
          `discount { amount, format { type, ratio, precision }, discount, displayAs { en } }`
        );
      } else if (
        fieldsList[i].name === "taxes" &&
        modifyFields &&
        (modelName === "quote" ||
          modelName === "invoice" ||
          modelName === "salesOrder" ||
          modelName === "purchaseOrder")
      ) {
        fieldsArray.push(
          `taxes { id, tax, amount, format { type, ratio, precision }, selected, displayAs { en } }`
        );
      } else {
        fieldsArray.push(fieldsList[i].name);
      }
    }
  }
  // fieldsArray.push("fields", "isSample");
  fieldsArray.push("id");
  return fieldsArray;
}

export function getVisibleFieldsArray(
  fieldsList: Array<ICustomField>,
  exceptionFields: string[] = []
) {
  const fieldsArray = [];
  for (let i = 0; i < fieldsList?.length; i++) {
    if (exceptionFields.includes(fieldsList[i].name)) {
      fieldsArray.push(fieldsList[i].name);
    } else if (fieldsList[i].visible) {
      if (fieldsList[i].systemDefined) {
        fieldsArray.push(fieldsList[i].name);
      } else {
        fieldsArray.push(`fields.${fieldsList[i].name}`);
      }
    }
  }
  // fieldsArray.push("isSample");
  fieldsArray.push("id");
  return fieldsArray;
}

export function getNamesOnlyFromField(fieldsArray: string[]) {
  if (!fieldsArray?.length) return fieldsArray;
  const result: string[] = [];
  for (const field of fieldsArray) {
    result.push(
      field.includes("fields.") ? field.slice(field.indexOf(".") + 1) : field
    );
  }
  return result;
}

export function getAllFieldsArray(fieldsList: Array<ICustomField>) {
  let fieldsArray = ["id"];
  for (let i = 0; i < fieldsList.length; i++) {
    if (fieldsList[i].visible) {
      fieldsArray.push(fieldsList[i].name);
    }
  }
  return fieldsArray;
}

//NOTE: Deprecated
export function getFieldsArrayForModel(
  fieldsList: Array<ICustomField>,
  modelName: string,
  allowCustomFields: boolean = false
) {
  let fieldsArray = [];
  if (modelDefaultFieldsList[modelName]) {
    for (let i = 0; i < modelDefaultFieldsList[modelName].length; i++) {
      const fieldName = fieldsList.filter(
        (field) => field.name === modelDefaultFieldsList[modelName][i]
      );
      if (fieldName) {
        fieldsArray.push(modelDefaultFieldsList[modelName][i]);
      }
    }
  } else {
    for (let i = 0; i < fieldsList.length; i++) {
      if (fieldsList[i].visible && fieldsList[i].systemDefined) {
        fieldsArray.push(fieldsList[i].name);
      }
    }
  }
  fieldsArray.push("fields", "isSample");
  return fieldsArray;
}

//NOTE: Deprecated
export function getSystemDefinedFieldsArray(fieldsList: Array<ICustomField>) {
  let fieldsArray = ["fields", "isSample"];
  for (let i = 0; i < fieldsList.length; i++) {
    if (fieldsList[i].visible && fieldsList[i].systemDefined) {
      fieldsArray.push(fieldsList[i].name);
    }
  }
  return fieldsArray;
}

export function getAllFieldsObjectArray(fieldsList: Array<ICustomField>) {
  let fieldsArray = [];
  for (let i = 0; i < fieldsList.length; i++) {
    if (fieldsList[i].visible) {
      fieldsArray.push({
        value: fieldsList[i].name,
        label: fieldsList[i].label["en"],
        dataType: fieldsList[i].dataType,
      });
    }
  }
  return fieldsArray;
}

export function getAllCustomViewFieldsArray(
  fieldsList: Array<ICustomField>,
  customViewFieldsList: Array<string>,
  exceptionFields: string[] = []
): GenericListHeaderType[] {
  const fieldsArray: GenericListHeaderType[] = [];
  for (let i = 0; i < customViewFieldsList.length; i++) {
    const field = fieldsList.filter(
      (f) =>
        f.name === customViewFieldsList[i].split(".").pop() &&
        (exceptionFields.includes(f.name) || f.visible)
    );
    if (field?.length) {
      fieldsArray.push({
        columnName: field[0]["name"],
        label: get(field[0]["label"], "en"),
        dataType: field[0].dataType,
        field: field[0],
        systemDefined: field[0].systemDefined,
      });
    }
  }
  return fieldsArray;
}

export function getAllFieldsObjectArrayForModal(
  fieldsList: Array<ICustomField>,
  modelName: string,
  exceptionFields: string[] = []
): GenericListHeaderType[] {
  const fieldsArray: GenericListHeaderType[] = [];
  if (modelDefaultFieldsList[modelName]) {
    for (let i = 0; i < modelDefaultFieldsList[modelName].length; i++) {
      const field = fieldsList.filter(
        (f) =>
          f.name === modelDefaultFieldsList[modelName][i] &&
          (exceptionFields.includes(f.name) || f.visible)
      );
      if (field.length && field[0].visible) {
        fieldsArray.push({
          columnName: field[0]["name"],
          label: get(field[0]["label"], "en"),
          dataType: field[0].dataType,
          field: field[0],
          systemDefined: field[0].systemDefined,
        });
      }
    }
    for (let i = 0; i < fieldsList.length; i++) {
      if (fieldsList[i].visible) {
        const fieldName = fieldsArray.filter(
          (field) => field.columnName === fieldsList[i].name
        );
        if (fieldName.length === 0) {
          fieldsArray.push({
            columnName: fieldsList[i].name,
            label: fieldsList[i].label["en"],
            dataType: fieldsList[i].dataType,
            field: fieldsList[i],
            systemDefined: fieldsList[i].systemDefined,
          });
        }
      }
    }
  } else {
    for (let i = 0; i < fieldsList.length; i++) {
      if (fieldsList[i].visible) {
        fieldsArray.push({
          columnName: fieldsList[i].name,
          label: fieldsList[i].label["en"],
          dataType: fieldsList[i].dataType,
          field: fieldsList[i],
          systemDefined: fieldsList[i].systemDefined,
        });
      }
    }
  }
  return fieldsArray;
}
