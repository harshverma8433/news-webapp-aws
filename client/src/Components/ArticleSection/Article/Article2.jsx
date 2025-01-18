/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMoreVert } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

const Article2 = ({ hamburger, article }) => {
  const navigate = useNavigate();
  const [editDelete, setEditDelete] = useState(false);
  const width = hamburger ? "lg:w-[400px] lg:h-64" : "w-full h-72";
  const maxLength = 120;
  const summary =
    article.summary.length > maxLength
      ? `${article.summary.slice(0, maxLength)}...`
      : article.summary;

  // Check user authorization before navigation
  const navigateArticleDetails = async (id) => {
    try {
      const url = `${import.meta.env.VITE_APP_API_URL}/isAuthorized`;
      const token = localStorage.getItem("jwt");

      const isAuth = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if ([201, 202, 401].includes(isAuth.status)) {
        toast(isAuth.data.message);
        navigate("/login");
      } else if (isAuth.status === 200) {
        navigate(`/articleDetails/${id}`);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Error checking authorization. Please try again.");
    }
  };

  // Delete article function
  const deleteArticle = async (id) => {
    try {
      const token = localStorage.getItem("jwt"); // Get token from local storage

      const url = `${import.meta.env.VITE_APP_API_URL}/deleteArticle/${id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `${token}`, // Set the Authorization header
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error("Delete article error:", error);
    }
  };

  // Edit article function
  const editArticle = async (id) => {
    try {
      const token = localStorage.getItem("jwt"); // Get token from local storage

      const url = `${import.meta.env.VITE_APP_API_URL}/isAuthorized`;
      const isAuth = await axios.get(url, {
        headers: {
          Authorization: `${token}`, // Set the Authorization header
        },
      });

      if ([201, 202, 401].includes(isAuth.status)) {
        toast.error(isAuth.data.message);
        navigate("/login");
      } else if (isAuth.status === 200) {
        navigate(`/updateArticleForm/${id}`);
      }
    } catch (error) {
      toast.error("Edit article error:", error);
    }
  };

  return (
    <>
      <div
        className={`relative ${width}  hover:translate-y-[-2px] transition-transform duration-150 cursor-pointer`}
      >
        <MdOutlineMoreVert
          onClick={() => setEditDelete(!editDelete)}
          className="text-3xl absolute z-20 top-2 text-white right-2 cursor-pointer"
        />
        <div
          className="w-full h-auto"
          onClick={() => navigateArticleDetails(article._id)}
        >
          <img
            className={`w-full ${width} rounded-xl object-cover`}
            src={article.image}
            alt="Article"
          />
          <div className="absolute text-white bottom-2/3 top-44 lg:top-auto lg:bottom-2 px-4 space-y-1 bg-gradient-to-t from-black via-transparent to-transparent rounded-b-xl">
            <h1 className="text-3xl lg:text-2xl font-semibold tracking-wide pb-1">
              {summary}
            </h1>
            <div className="flex space-x-2 text-sm lg:text-xs">
              <span className="w-0.5 h-6 bg-red-800"></span>
              <h1>{article.author},</h1>
              <p>{new Date(article.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        {editDelete && (
          <div className="bg-white text-black flex flex-col overflow-hidden rounded-xl absolute right-2 top-10 lg:top-16 shadow-md">
            <button
              onClick={() => editArticle(article._id)}
              className="border border-gray-200 py-3 px-6  hover:bg-gray-200 transition duration-150"
            >
              Edit
            </button>
            <button
              onClick={() => deleteArticle(article._id)}
              className="border border-gray-200 py-3 px-6 hover:bg-gray-200 transition duration-150"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Article2;
