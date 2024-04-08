import { useState } from "react";

const std = [];
while (std.length < 9) {
  const options = ["square", "circle", "delta"];
  std.push({ id: Date.now() + std.length, type: options[Math.floor(Math.random() * 3)] });
}
export default function DropGame() {
    const [boxes, setBoxes] = useState(std);
  function dragElement(e,data) {
    e.dataTransfer.dropEffect = "copy";
    e.dataTransfer.setData("application/my-app", data["id"]);
  }
  function dragOverElement(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  function dropElement(e,data) {
    e.preventDefault();
    const copy = [...boxes];
    const idOfElementToPast = e.dataTransfer.getData("application/my-app");
    const indexPastElement = boxes.findIndex(e =>e["id"] == idOfElementToPast)
    const indexOfPrevElement = boxes.findIndex(e =>e["id"] == data["id"])
    copy.splice(indexPastElement,1)
    copy.splice(indexOfPrevElement,0,boxes[indexPastElement])
    setBoxes(copy)
  }
  return (
    <div className="drop_game">
      <div className="playground">
        {boxes.map((data) => {
          return (
            <p
            className={data["type"]}
              tabIndex={0}
              draggable
              onDragStart={(e) => dragElement(e,data)}
              onDragOver={(e) => dragOverElement(e)}
              onDrop={(e) => dropElement(e, data)}
              key={data["id"]}>
              {data["type"]}
            </p>
          );
        })}
      </div>
    </div>
  );
}