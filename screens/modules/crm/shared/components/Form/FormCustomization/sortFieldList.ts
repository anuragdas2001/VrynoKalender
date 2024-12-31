export const sortFieldList = (
  fieldList: {
    fieldName: string;
    order: number;
    dataType: string;
    visible: boolean;
    addInForm: boolean;
    readOnly: boolean;
  }[]
) => {
  if (fieldList?.length <= 0) return fieldList;
  return fieldList.slice().sort((a, b) => (a.order > b.order ? 1 : -1));
};
