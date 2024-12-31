import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { getFullUserName } from "../../../../../Shared/getFullUserName";

import MentionList from "./NoteMentionList";
import {
  LazyQueryResult,
  OperationVariables,
  QueryLazyOptions,
} from "@apollo/client";

export default function getNoteSuggestions(
  getSearchResults: (
    options?: QueryLazyOptions<OperationVariables> | undefined
  ) => Promise<LazyQueryResult<any, OperationVariables>>
) {
  return {
    items: ({ query }: { query: any }) => {
      return getSearchResults({
        variables: {
          serviceName: "accounts",
          modelName: "user",
          text: query,
        },
      }).then((response) => {
        return response.data.quest.data.map((item: any) => ({
          id: item.rowId,
          label: getFullUserName({
            firstName: item.values.first_name,
            lastName: item.values.last_name,
          }),
        }));
      });
    },

    render: () => {
      let component: any;
      let popup: any;

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },

        onUpdate(props: any) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0]?.setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === "Escape") {
            popup[0]?.hide();

            return true;
          }

          return component?.ref?.onKeyDown(props);
        },

        onExit() {
          popup && popup[0]?.destroy();
          component?.destroy();
        },
      };
    },
  };
}
