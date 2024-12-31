import { DOMParser } from "prosemirror-model";

function elementFromString(value: string) {
  const element = document.createElement("div");
  element.innerHTML = value.trim();

  return element;
}

export function insertHTML(
  { state, view }: { state: any; view: any },
  value: string
) {
  const { selection } = state;
  const element = elementFromString(value);
  const slice = DOMParser.fromSchema(state.schema).parseSlice(element);
  const transaction = state.tr.insert(selection.anchor, slice.content);

  view.dispatch(transaction);
}
