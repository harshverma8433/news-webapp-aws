/* eslint-disable react/prop-types */
import { useState } from "react";

const ReplyForm = ({ comId, onReplySubmit }) => {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    console.log("Replying to:", comId, "with text:", replyText);
    onReplySubmit(comId, replyText);
    setReplyText("");
  };

  return (
    <div>
      <input
        type="text"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Reply</button>
    </div>
  );
};

export default ReplyForm;
