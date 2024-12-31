export function navigationSizeChecker(parent: any, child: any) {
  var parentRect = parent.getBoundingClientRect();
  var childRect = child.getBoundingClientRect();
  if (childRect.right === 0 && childRect.width === 0) return false;
  return parentRect.right > childRect.right + childRect.width;
}
