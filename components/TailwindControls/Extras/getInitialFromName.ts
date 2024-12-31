export function getInitialsFromName(text: string) {
  const splitName = text.split(" ");
  return (splitName[0][0] + splitName[1][0]).toString().toUpperCase();
}
