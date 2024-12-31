export function checkOverflow(element: any) {
  if (element) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }
}
