/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Article = ({ hamburger, article }) => {
  const navigate = useNavigate();

  const width = hamburger ? "w-[400px] h-64" : "w-full h-72";

  const maxLength = 20;
  const summary =
    article.summary.length > maxLength
      ? `${article.summary.slice(0, maxLength)}...`
      : article.summary;

  const navigateArticleDetails = async (id) => {
    try {
      const url = `${import.meta.env.VITE_APP_API_URL}/isAuthorized`;
      const token = localStorage.getItem("jwt"); // Get token from local storage
      if (!token) {
        toast("You Have To Login First!!!");
        navigate("/login");
      }

      const isAuth = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log(isAuth);

      if ([201, 202, 401].includes(isAuth.status)) {
        toast(isAuth.data.message);
        navigate("/login");
      } else if (isAuth.status === 200) {
        navigate(`/articleDetails/${id}`);
      }
    } catch (error) {
      toast.error("Error checking authorization:", error);
    }
  };

  return (
    <>
      <div
        onClick={() => navigateArticleDetails(article._id)}
        className={`cursor-pointer relative ${width} flex hover:translate-y-[-2px] transition-all duration-150`}
      >
        <img
          className={`rounded-xl relative ${width} h-64 object-cover`}
          src={article.image}
          alt={article.summary || "Article Image"}
        />
        <div className="absolute text-white bottom-2 px-4 space-y-1 bg-gradient-to-t from-black via-transparent to-transparent rounded-b-xl">
          <h1 className="text-3xl font-semibold tracking-wide pb-1">
            {summary}
          </h1>
          <div className="flex items-center space-x-2 text-sm">
            <span className="w-0.5 h-6 bg-red-800"></span>
            <h1>{article.author},</h1>
            <p>{new Date(article.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Article;
