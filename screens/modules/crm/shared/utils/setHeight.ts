export function setHeight(ref: any, spaceFromBottom: number = 0) {
  if (ref.current !== null) {
    const element = ref.current;
    let elDistanceToTop =
      window.pageYOffset + element.getBoundingClientRect().top;
    if (spaceFromBottom !== 0) {
      elDistanceToTop = elDistanceToTop + spaceFromBottom;
    }
    element.style.height = `calc(100vh - ${elDistanceToTop}px)`;
    return elDistanceToTop;
  }
}
