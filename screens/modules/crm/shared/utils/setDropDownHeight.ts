export function setDropDownHeight(ref: any, innerRef: any) {
  if (ref.current !== null) {
    const element = ref.current;
    const elementove = innerRef.current;
    let elDistanceToTop =
      window.pageYOffset + element.getBoundingClientRect().top;
    if (elementove != null) {
      elementove.style.position = "fixed";
      elementove.style.right = "65px";
      elementove.style.zIndex = 500;
      elementove.style.display = "block";
      if (elDistanceToTop < 500) {
        elementove.style.top = `${element.getBoundingClientRect().top + 30}px`;
      } else {
        elementove.style.top = `${element.getBoundingClientRect().top - 157}px`;
      }
    }

    return elDistanceToTop;
  }
}
