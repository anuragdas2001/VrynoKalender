export function getTailwindClassesForTextEditor(marks: { type: string }[]) {
  let classes = "";
  for (let i = 0; i < marks.length; i++) {
    if (marks[i].type === "bold") {
      classes = classes + "font-bold" + " ";
    }
    if (marks[i].type === "italic") {
      classes = classes + "italic" + " ";
    }
    if (marks[i].type === "underline") {
      classes = classes + "underline" + " ";
    }
  }
  return classes;
}
