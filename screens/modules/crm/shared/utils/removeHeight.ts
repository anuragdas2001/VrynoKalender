export function removeHeight(ref: any) {
  if (ref.current !== null) {
    const element = ref.current;
    let elDistanceToTop =
      window.pageYOffset + element.getBoundingClientRect().top;
    element.style.height = `auto`;
    return elDistanceToTop;
  }
}
