import React from "react";
import SearchIcon from "remixicon-react/SearchLineIcon";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import { sliderWindowType } from "../../../modules/crm/shared/components/SliderWindow";

export type GlobalSearchProps = {
  disableSearchButton: boolean;
  navbarColor?: string;
  navbarTextColor: string;
  setGlobalSearchModal: (value: sliderWindowType) => void;
};

export const GlobalSearch = ({
  disableSearchButton,
  navbarColor,
  navbarTextColor,
  setGlobalSearchModal,
}: GlobalSearchProps) => {
  return (
    <>
      <Button
        id="global-search-button"
        kind="invisible"
        buttonType="invisible"
        onClick={() => setGlobalSearchModal("")}
        disabled={disableSearchButton}
        userEventName="open-globalSearch-modal-click"
      >
        <SearchIcon size={22} color={navbarTextColor} />
      </Button>
    </>
  );
};
