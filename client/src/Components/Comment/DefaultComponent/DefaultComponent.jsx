/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Import icons for liked/unliked states
import toast from "react-hot-toast";

const DefaultComponent = ({ articleId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [likedComments, setLikedComments] = useState(new Set());
  console.log(user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = `${import.meta.env.VITE_APP_API_URL}/user`;
        const token = localStorage.getItem("jwt");
        const response = await axios.get(url, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        if ([201, 202, 404].includes(response.status)) {
          navigate("/login");
        }

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const uri = `${
          import.meta.env.VITE_APP_API_URL
        }/getcomments/${articleId}`;
        const response = await axios.get(uri);

        if (response.status === 200) {
          const formattedComments = response.data.data.map((comment) => ({
            userId: comment.userId._id,
            comId: comment._id,
            fullName: comment.userId.username,
            text: comment.text,
            avatarUrl: comment.userId.image,
            likes: comment.likes,
            likedByUser: likedComments.has(comment._id), // Check if current user liked this comment
            replies: comment.replies.map((reply) => ({
              userId: reply.userId._id,
              comId: reply._id,
              fullName: reply.userId.username,
              text: reply.text,
              avatarUrl: reply.userId.image,
            })),
          }));
          setData(formattedComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchUser();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, navigate]);

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/likecomment/${commentId}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Add commentId to likedComments state
        setLikedComments((prevLiked) => new Set(prevLiked.add(commentId)));

        // Update data state to reflect the like
        setData((prevData) =>
          prevData.map((comment) =>
            comment.comId === commentId
              ? { ...comment, likes: comment.likes + 1, likedByUser: true }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleUnlikeComment = async (commentId) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/unlikecomment/${commentId}`,
        {},
        {
          headers: {
            Authorization: `${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        // Remove commentId from likedComments state
        setLikedComments((prevLiked) => {
          const newLiked = new Set(prevLiked);
          newLiked.delete(commentId);
          return newLiked;
        });

        // Update data state to reflect the unlike
        setData((prevData) =>
          prevData.map((comment) =>
            comment.comId === commentId
              ? { ...comment, likes: comment.likes - 1, likedByUser: false }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error unliking comment:", error);
    }
  };

  const handleCommentSubmit = async (newComment) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/addcomment`,
        {
          text: newComment.text,
          articleId: articleId,
          userId: user._id,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const newCommentData = {
          userId: response.data.data.userId._id,
          comId: response.data.data._id,
          fullName: response.data.data.userId.username,
          text: response.data.data.text,
          avatarUrl: response.data.data.userId.image,
          replies: [],
        };
        setData((prevData) => [...prevData, newCommentData]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReplySubmit = async (commentId, replyText) => {
    if (!replyText || replyText.trim() === "") {
      toast.error("Reply text is empty or undefined");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/replycomment/${commentId}`,
        {
          text: replyText,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const updatedComment = response.data.data;
        setData((prevData) =>
          prevData.map((comment) =>
            comment.comId === updatedComment._id
              ? {
                  ...comment,
                  replies: updatedComment.replies.map((reply) => ({
                    userId: reply.userId._id,
                    comId: reply._id,
                    fullName: reply.userId.username,
                    text: reply.text,
                    avatarUrl: reply.userId.image,
                  })),
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/deletecomment/${commentId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Remove the comment from the state
        setData((prevData) =>
          prevData.filter((comment) => comment.comId !== commentId)
        );
      } else {
        console.error("Failed to delete the comment:", response.data);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/updatecomment/${commentId}`,
        { text: newText },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update the comment in the state
        setData((prevData) =>
          prevData.map((comment) =>
            comment.comId === commentId
              ? { ...comment, text: newText }
              : comment
          )
        );
      } else {
        toast.error("Failed to update the comment:", response.data);
      }
    } catch (error) {
      toast.error("Error updating comment:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <CommentSection
      currentUser={{
        currentUserId: user._id,
        currentUserImg: user.image,
        currentUserFullName: user.username,
      }}
      commentData={data}
      onReplyAction={(replyData) => {
        const { repliedToCommentId, text } = replyData;

        if (!repliedToCommentId || !text) {
          alert(
            "Reply text or comment ID is undefined or null. Please ensure you entered text."
          );
          return;
        }

        handleReplySubmit(repliedToCommentId, text);
      }}
      onSubmitAction={(data) => handleCommentSubmit(data)}
      renderLikeButton={(comment) => (
        <span
          onClick={() =>
            comment.likedByUser
              ? handleUnlikeComment(comment.comId)
              : handleLikeComment(comment.comId)
          }
        >
          {comment.likedByUser ? (
            <AiFillHeart color="red" />
          ) : (
            <AiOutlineHeart />
          )}
        </span>
      )}
      onDeleteAction={(commentId) => handleDeleteComment(commentId)}
      onEditAction={(commentId, newText) =>
        handleEditComment(commentId, newText)
      }
      currentData={(data) => {
        console.log("Current data:", data);
      }}
    />
  );
};

export default DefaultComponent;
