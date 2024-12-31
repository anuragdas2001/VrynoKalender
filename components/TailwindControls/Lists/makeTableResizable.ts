export const makeTableResizable = (tableId: string) => {
  const table = document.getElementById(tableId) as HTMLElement;
  const columns = table.getElementsByTagName("th");
  const columnCount = columns.length;

  for (let i = 0; i < columnCount; i++) {
    const currentCol = columns[i];
    let isResizing = false;
    let startX: number, startWidth: number;

    currentCol.style.position = "relative";

    const handle = document.createElement("div");
    handle.style.position = "absolute";
    handle.style.height = "100%";
    handle.style.width = "10px";
    handle.style.right = "0";
    handle.style.top = "0";
    handle.style.cursor = "col-resize";
    currentCol.appendChild(handle);

    handle.addEventListener("mousedown", (e) => {
      isResizing = true;
      startX = e.pageX;
      startWidth = currentCol.offsetWidth;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });

    const handleMouseMove = (e: any) => {
      if (isResizing) {
        const newWidth = startWidth + (e.pageX - startX);

        // Check if the new width is greater than the current width
        if (newWidth > startWidth) {
          currentCol.style.width = newWidth + "px";
        } else {
          // If the new width is less than the current width, do not decrease it
          currentCol.style.width = "auto";
          currentCol.style.minWidth = startWidth + "px";
        }
      }
    };

    const handleMouseUp = () => {
      isResizing = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }
};
