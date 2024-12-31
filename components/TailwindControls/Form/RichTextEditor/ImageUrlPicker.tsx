import React from "react";
import { PageIcons } from "../../VrynoIcon";
import ImageIcon from "remixicon-react/ImageLineIcon";

export default function ImageUrlPicker({
  onChange,
  disabled,
  ...props
}: {
  disabled?: boolean;
  onChange: (url: File) => void;
}) {
  return (
    <div>
      <label htmlFor="image">
        {PageIcons(ImageIcon, 20, "cursor-pointer mx-1 text-vryno-icon-gray")}
      </label>
      <input
        id="image"
        type="file"
        disabled={disabled}
        accept="image/*"
        className="hidden"
        onChange={(event) =>
          event.currentTarget.files &&
          event.currentTarget.files.length > 0 &&
          onChange(event.currentTarget.files[0])
        }
        {...props}
      />
    </div>
  );
}
