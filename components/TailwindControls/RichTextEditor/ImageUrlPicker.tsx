import React from "react";
import { PageIcons } from "../VrynoIcon";
import { Image } from "react-feather";

export default function ImageUrlPicker({
  onChange,
  ...props
}: {
  onChange: (url: File) => void;
}) {
  return (
    <div>
      <label htmlFor="image">
        {PageIcons(Image, 20, "cursor-pointer mx-1 text-gray-500")}
      </label>
      <input
        id="image"
        type="file"
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
