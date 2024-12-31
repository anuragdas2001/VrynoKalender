import { useRouter } from "next/router";
import React, { useContext } from "react";
import Link from "next/link";
import BackArrowIcon from "remixicon-react/ArrowLeftLineIcon";
import { MessageListContext } from "../../../../../pages/_app";

export type GenericBackHeaderProps = {
  children?: React.ReactElement;
  onClick?: () => void;
  heading?: string | React.JSX.Element;
  headingHtml?: React.ReactElement;
  subHeading?: string;
  showBackButton?: boolean;
  replaceBackButton?: boolean;
  replaceBackButtonChildren?: React.ReactElement;
  keepSpaceBelow?: boolean;
  addButtonInFlexCol?: boolean;
  id?: string;
  headerTopCss?: null | string;
};

const GenericBackHeader = ({
  children,
  onClick,
  heading,
  headingHtml,
  subHeading,
  showBackButton = true,
  replaceBackButton = false,
  replaceBackButtonChildren,
  keepSpaceBelow = true,
  addButtonInFlexCol = false,
  id,
  headerTopCss = null,
}: GenericBackHeaderProps) => {
  const router = useRouter();
  const { appMessage, instanceMessage } = useContext(MessageListContext);

  const bottomMargin = keepSpaceBelow ? "mb-2" : "";
  return (
    <div
      className={`w-full min-h-[53px] justify-between bg-vryno-header-color py-2 px-6 flex shadow-md z-[500] ${
        headerTopCss != null
          ? headerTopCss
          : `${`${
              appMessage?.length > 0 && instanceMessage?.length > 0
                ? `top-[120px] sm:top-[126px] md:top-[100px]`
                : appMessage?.length > 0 || instanceMessage?.length > 0
                ? `top-[100px] sm:top-[106px] md:top-[80px]`
                : "top-20 sm:top-[86px] md:top-[60px]"
            } `}`
      } ${
        addButtonInFlexCol
          ? "flex-col sm:flex-row sm:items-center"
          : "flex-row items-center"
      } ${
        !router.pathname.includes("settings") ? "sticky" : ""
      } ${bottomMargin}`}
      id={id ? `back-header-${id}` : `back-header`}
      data-testid={id ? `back-header-${id}` : `back-header`}
    >
      <div className="flex items-center">
        {showBackButton ? (
          <Link href={``} legacyBehavior>
            <a
              onClick={(e) => {
                e.preventDefault();
                onClick ? onClick() : history.back();
              }}
              id={id ? `back-header-link-${id}` : `back-header-link`}
              data-testid={id ? `back-header-link-${id}` : `back-header-link`}
              className={`w-auto h-full rounded-full bg-gray-500 hover:bg-vryno-theme-light-blue border p-1`}
            >
              <BackArrowIcon size={12} className="text-white cursor-pointer" />
            </a>
          </Link>
        ) : (
          replaceBackButton && replaceBackButtonChildren
        )}
        {headingHtml ? (
          headingHtml
        ) : (
          <span className="font-medium text-md md:text-md lg:text-lg ml-2 flex flex-col whitespace-nowrap text-vryno-label-gray">
            {heading}
            {subHeading && (
              <span className="text-xsm text-vryno-theme-light-blue">
                {subHeading}
              </span>
            )}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};
export default GenericBackHeader;
