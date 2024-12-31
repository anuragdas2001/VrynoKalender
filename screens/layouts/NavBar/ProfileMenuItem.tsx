import { INavigation } from "../../../models/INavigation";
import router from "next/router";
import React from "react";
import Link from "next/link";
import Button from "../../../components/TailwindControls/Form/Button/Button";

export const ProfileMenuItem = ({
  dropdownList,
  item,
  emailAndProfileNav,
  setDropDownListVisible,
}: {
  dropdownList: Record<
    string,
    {
      icon: JSX.Element;
      id: string;
      url?: string;
      onClick?: () => void;
    }
  >;
  item: Partial<INavigation>;
  emailAndProfileNav: INavigation[];
  setDropDownListVisible: (value: boolean) => void;
}) => {
  if (!item.uniqueName) return null;

  const defaultRender = emailAndProfileNav.length <= 0;
  const isButton = dropdownList[item.uniqueName]?.onClick;
  const id = defaultRender ? item.id : dropdownList[item.uniqueName]?.id;
  const icon = defaultRender ? item.icon : dropdownList[item.uniqueName]?.icon;
  const url = defaultRender ? item.url : dropdownList[item.uniqueName]?.url;
  const onClick = defaultRender
    ? item.onClick
    : dropdownList[item.uniqueName]?.onClick;
  if (isButton) {
    return (
      <Button
        id={`profile-menu-item-${id}`}
        key={id}
        customStyle={`p-2 w-full cursor-pointer flex flex-row items-center ${
          defaultRender ? "border-b" : ""
        }  border-gray-100 hover:bg-vryno-dropdown-hover text-gray-400`}
        onClick={(e) => {
          if (!item.uniqueName) return null;
          e.preventDefault();
          setDropDownListVisible(false);
          onClick?.();
        }}
        renderChildrenOnly={true}
        userEventName={`profile-menu-item-${id}:action-click`}
      >
        <>
          {icon}
          <span className="text-xs text-gray-600">{item.label.en}</span>
        </>
      </Button>
    );
  }
  if (!url) return <span data-unique-name={item.uniqueName}>no url</span>;
  return (
    <Link href={url} key={item.uniqueName} legacyBehavior passHref>
      <a
        data-unique-name={item.uniqueName}
        id={id}
        className={`p-2 cursor-pointer flex flex-row items-center border-gray-100 hover:bg-vryno-dropdown-hover text-gray-400 ${
          defaultRender ? "border-b" : ""
        }`}
        onClick={(e) => {
          setDropDownListVisible(false);
        }}
      >
        {icon}
        <span className="text-xs text-gray-600">{item.label.en}</span>
      </a>
    </Link>
  );
};
