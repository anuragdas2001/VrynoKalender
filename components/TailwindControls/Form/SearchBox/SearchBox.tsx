import React from "react";
import SearchBoxContent from "./SearchBoxContent";
import FormInputBox from "../InputBox/FormInputBox";
import { BasicLookupType, SearchBoxProps } from "./SearchBoxProps";
import { GeneralStoreContext } from "../../../../stores/RootStore/GeneralStore/GeneralStore";
import {
  searchByDisplayExpression,
  searchByHelper,
} from "../../../../screens/modules/crm/shared/components/Form/FormFields/recordLookupHelpers";

function SearchBox<T extends BasicLookupType>(props: SearchBoxProps<T>) {
  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const { genericModels, allLayoutFetched } = generalModelStore;
  const [layoutFetch, setLayoutFetch] = React.useState(allLayoutFetched);
  const [searchBy, setSearchBy] = React.useState(props.searchBy);
  const [fieldDisplayExpression, setFieldDisplayExpression] = React.useState(
    props.fieldDisplayExpression
  );

  React.useEffect(() => {
    if (!layoutFetch) {
      //IMPORTANT: On every other component which dynamically send searchBy, send field
      //NOTE: Field is absolutely compulsory, but (At the time of writing this comment) EmailNotificationForm &  SendEmailFormFields
      //send searchBy and fieldDisplayExpression explicitly.
      if (props.field) {
        setSearchBy(searchByHelper(props.field, genericModels));
        setFieldDisplayExpression(searchByDisplayExpression(props.field));
      }
      setLayoutFetch(allLayoutFetched);
    }
  }, [allLayoutFetched]);

  const mergedProps = {
    ...props,
    searchBy: searchBy,
    fieldDisplayExpression: fieldDisplayExpression,
  };

  if (layoutFetch && allLayoutFetched) {
    return <SearchBoxContent {...mergedProps} />;
  } else {
    return (
      <FormInputBox
        name={""}
        label={props.label}
        type={"text"}
        allowMargin={props.allowMargin}
        disabled
        onChange={() => {}}
      />
    );
  }
}
export default SearchBox;
