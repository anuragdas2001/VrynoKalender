import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";

const NotesMentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item.id, label: item.label });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: any }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="notes-mention-items">
      {props.items.length ? (
        props.items.map((item: any, index: number) => (
          <Button
            key={index}
            id="notes-mention-items"
            customStyle={`notes-mention-item ${
              index === selectedIndex ? "is-selected" : ""
            }`}
            onClick={() => selectItem(index)}
            userEventName="notes-mention-item-click"
          >
            {item.label}
          </Button>
        ))
      ) : (
        <div className="notes-mention-item">No result</div>
      )}
    </div>
  );
});

NotesMentionList.displayName = "NotesMentionList";

export default NotesMentionList;
