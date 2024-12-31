import React from "react";
import { Content, Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { PageIcons } from "../VrynoIcon";
import ImageUrlPicker from "./ImageUrlPicker";
import {
  Bold,
  Edit3,
  Italic,
  RotateCcw,
  RotateCw,
  Underline as underline,
} from "react-feather";
import { ImageUploadHandler } from "./ImageUploadHandler";
import { Config } from "../../../shared/constants";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";

export type NotesEditorProps = {
  name: string;
  label?: string;
  isHtml?: boolean;
  disabled: boolean;
  data?: Content;
  handleNoteChange: (notes: Record<string, any> | string) => void;
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const handleImageAdd = async (item: File) => {
    const fileId = await ImageUploadHandler(item);
    if (fileId) {
      editor
        .chain()
        .focus()
        .setImage({ src: `${Config.fileFetchUrl()}${fileId}` })
        .run();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-evenly py-1">
        <div
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "text-blue-500" : "text-gray-500"
          }
        >
          {PageIcons(Bold, 20, "cursor-pointer")}
        </div>
        <div
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic") ? "text-blue-500" : "text-gray-500"
          }
        >
          {PageIcons(Italic, 20, "cursor-pointer")}
        </div>
        <div
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive("underline") ? "text-blue-500" : "text-gray-500"
          }
        >
          {PageIcons(underline, 20, "cursor-pointer text-gray-500")}
        </div>
        <div onClick={() => editor.chain().focus().toggleHighlight().run()}>
          {PageIcons(Edit3, 20, "cursor-pointer text-gray-500")}
        </div>
      </div>
      <div className="flex flex-row justify-evenly py-2">
        <div>
          <ImageUrlPicker onChange={(item: File) => handleImageAdd(item)} />
        </div>
        <div
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="cursor-pointer text-gray-500"
        >
          {`<br>`}
        </div>
        <div onClick={() => editor.chain().focus().undo().run()}>
          {PageIcons(RotateCcw, 20, "cursor-pointer text-gray-500")}
        </div>
        <div onClick={() => editor.chain().focus().redo().run()}>
          {PageIcons(RotateCw, 20, "cursor-pointer text-gray-500")}
        </div>
      </div>
    </div>
  );
};

function Tiptap(props: NotesEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Placeholder, Underline, Highlight],
  });

  React.useEffect(() => {
    if (editor !== null) {
      editor.on("update", ({ editor }) => {
        if (!props.isHtml) {
          props.handleNoteChange(editor.getJSON());
        } else {
          props.handleNoteChange(editor.getHTML());
        }
      });
      if (props.data) {
        editor.commands.setContent(props.data);
      }
    }
  }, [editor]);

  const divFlexCol = "flex-col";

  return (
    <div className={`flex ${divFlexCol} `}>
      <label htmlFor={props.name} className={`mb-1 text-md tracking-wide`}>
        {props.label}
      </label>
      <div className="border border-vryno-gray rounded-sm py-2 px-2">
        <EditorContent editor={editor} className="mb-2 rounded-sm" />
        <div className="w-full border-b mt-2 mb-4 border-gray-200 col-span-full"></div>
        <MenuBar editor={editor} />
      </div>
    </div>
  );
}
export default Tiptap;
