export function getInitialsFromEmail(text: string) {
  let initials = "";
  const splitEmail = text.split("@")[0];
  let specialCharacterIndex = /[*?+^${}[\]().@_|\\]/.exec(splitEmail);
  if (specialCharacterIndex) {
    let firstArray = splitEmail.split(
      splitEmail[specialCharacterIndex.index]
    )[0];
    let secondArray = splitEmail.split(
      splitEmail[specialCharacterIndex.index]
    )[1];
    initials = firstArray[0] + secondArray[0];
  } else initials = text[0];
  return initials;
}
