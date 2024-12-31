import React from "react";

const generateHash = (id: string | string[] | undefined) => {
  let sum = 0;
  if (typeof id === "string") {
    for (let i = 0; i < id.length; i++) {
      sum = sum + id.charCodeAt(i);
    }
  }

  return (sum % 19) + 1;
};
export default generateHash;
