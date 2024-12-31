export interface IConversionDropdownListType {
  value: string;
  label: string;
  dataType: string;
  uniqueName: string;
  dataTypeMetadata: any;
}

export interface IMappingDropdownType {
  value: string;
  label: string;
  dataType: string;
}

export interface IGenericConversionBEData {
  id: string | null;
  sourceFieldUniqueName: string;
  sourceModuleUniqueName: string;
  destinationFieldUniqueName: string | null;
  destinationModuleUniqueName: string | null;
}
