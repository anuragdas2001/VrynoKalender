export const getDateAndTime = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  return `${dd < 10 ? "0" + dd : dd}-${mm < 10 ? "0" + mm : mm}-${yyyy}`;
};
