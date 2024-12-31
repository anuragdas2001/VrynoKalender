export function removeDuplicateObjectsFromTwoArrays(
  firstArray: Array<object>,
  secondArray: Array<object>
) {
  for (let i = 0; i < firstArray.length; i++) {
    let itemFound = false;
    for (let j = 0; j < secondArray.length; j++) {
      if (JSON.stringify(secondArray[j]) === JSON.stringify(firstArray[i])) {
        itemFound = true;
      }
    }
    if (!itemFound) {
      secondArray.push(firstArray[i]);
    }
  }
  return secondArray;
}
