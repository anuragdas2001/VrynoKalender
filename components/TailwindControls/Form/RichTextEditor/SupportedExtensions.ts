import { SuggestionOptions } from "@tiptap/suggestion";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Mention from "@tiptap/extension-mention";

export function getTiptapExtensions(
  supportMentions: boolean | undefined,
  mentionSuggestions: Omit<SuggestionOptions<any>, "editor"> | undefined,
  supportsSuggestions: boolean = true
) {
  const extensions: Array<any> = [
    StarterKit,
    Image,
    Placeholder,
    Underline,
    Highlight,
  ];

  if (supportMentions) {
    const mentionConfig: any = {
      HTMLAttributes: {
        class: "note-mention",
      },
    };
    if (supportsSuggestions) {
      mentionConfig.suggestion = mentionSuggestions;
    }

    extensions.push(Mention.configure(mentionConfig));
  }
  return extensions;
}
