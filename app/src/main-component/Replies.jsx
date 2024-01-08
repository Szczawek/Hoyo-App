import addReply from "../replies/addReply";

import CreateComment from "../comments/CreateComment";
export default function Replies() {
  function ss() {
    console.log("Szczawik!")
  }
  return (
    <div className="replies">
      <CreateComment 
      addComment={addReply} loadData={ss}/>
    </div>
  );
}
