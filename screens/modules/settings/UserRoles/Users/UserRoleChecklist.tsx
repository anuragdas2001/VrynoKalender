import { ChangeEvent } from "react";

export const UserRoleChecklist = ({
  handleCheckboxSelect,
  options,
  roleIds,
}: {
  handleCheckboxSelect: (value: ChangeEvent<HTMLInputElement>) => void;
  options: {
    label: string;
    value: string;
  }[];
  roleIds: string[];
}) => {
  return (
    <div className="flex flex-col my-4">
      <div className="mb-2.5 text-sm tracking-wide text-vryno-label-gray">
        <span>Roles</span>
        <span className="font-[900] text-[#a91f1f]">*</span>
      </div>
      {options.length ? (
        <div className="flex gap-x-2 items-center">
          {options.map((item) => {
            return (
              <div key={item.value} className={"flex items-center text-xsm"}>
                <input
                  checked={roleIds.includes(item.value)}
                  value={item.value}
                  type="checkbox"
                  name={"roleIds"}
                  id={item.value}
                  className="hover:text-emerald-400 mr-2 cursor-pointer"
                  onChange={(e) => handleCheckboxSelect(e)}
                />
                <label
                  htmlFor={item.value}
                  className={"w-max cursor-pointer text-vryno-label-gray"}
                >
                  {item.label}
                </label>
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-vryno-label-gray">No Roles</span>
      )}
    </div>
  );
};
