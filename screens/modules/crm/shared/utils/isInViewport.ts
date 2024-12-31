export function isInViewport(parent: HTMLElement, child: HTMLElement) {
  var parentRect = parent.getBoundingClientRect();
  var childRect = child.getBoundingClientRect();
  return (
    childRect.left >= parentRect.left && parentRect.right > childRect.right
  );
}
