import React from "react";

export const TextLoop = ({ messages }: { messages: string[] }) => {
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const timeout =
      messageIndex < messages.length - 1
        ? setTimeout(() => setMessageIndex(messageIndex + 1), 500)
        : null;

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [messages, messageIndex]);

  return (
    <span className="text-vryno-label-gray mt-4">{messages[messageIndex]}</span>
  );
};
