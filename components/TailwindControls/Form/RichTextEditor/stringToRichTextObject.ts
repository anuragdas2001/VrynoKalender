export const stringToRichTextObject = (value: string) => {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            text: `${value}`,
            type: "text",
            marks: [],
          },
        ],
      },
    ],
  };
};
