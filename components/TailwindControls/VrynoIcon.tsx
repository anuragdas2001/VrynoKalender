import { RemixiconReactIconComponentType } from "remixicon-react";
import { Icon } from "react-feather";

type SupportedIcons = RemixiconReactIconComponentType | Icon;

export function VrynoLoginRegisterFormIcons(Icon: SupportedIcons) {
  return VrynoIcon(Icon, { className: "text-vryno-icon-gray" });
}

export function PageIcons(
  Icon: SupportedIcons,
  size = 24,
  color = "text-green-500"
) {
  return VrynoIcon(Icon, { className: `${color} cursor-pointer`, size });
}
const defaultHandler = () => {};

export const VrynoBlueIcon = (
  Icon: SupportedIcons,
  { size = 24, className = "", onClick = defaultHandler } = {}
) =>
  VrynoIcon(Icon, {
    className: `text-vryno-theme-blue ${className}`,
    size: size,
    onClick: onClick,
  });

export function VrynoIcon(
  Icon: SupportedIcons,
  { className = "", size = 24, onClick = defaultHandler } = {}
) {
  return <Icon className={className} size={size} onClick={onClick} />;
}
