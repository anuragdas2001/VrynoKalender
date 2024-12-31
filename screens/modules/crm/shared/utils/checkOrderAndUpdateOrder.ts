export const checkOrder = (
  orderedArray: Partial<{ order: number | null }>[]
) => {
  let checkIfSameOrderFound = false;
  orderedArray?.forEach((orderedItem, index) => {
    if (index !== orderedArray?.length - 1) {
      let checkInArray = orderedArray.slice(index + 1);
      let foundOrderIndex = checkInArray?.findIndex(
        (item) => item.order === orderedItem.order
      );
      if (foundOrderIndex !== -1) checkIfSameOrderFound = true;
    }
  });
  return checkIfSameOrderFound;
};

export const updateorder = (
  orderedArray: Partial<{ order: number | null | undefined }>[]
) => {
  let updatedOrderedArray: Partial<{ order: number | null | undefined }>[] = [
    ...orderedArray,
  ];
  updatedOrderedArray
    ?.slice()
    .sort((itemOne, itemTwo) =>
      (itemOne?.order as number) >= (itemTwo?.order as number) ? 1 : -1
    );
  return updatedOrderedArray.map((item, index) => {
    return { ...item, order: index };
  });
};
