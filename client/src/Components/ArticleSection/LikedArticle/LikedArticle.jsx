import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LikedArticle = () => {
  const navigate = useNavigate();

  const [likedArticles, setLikedArticles] = useState([]);

  useEffect(() => {
    const fetchLikedArticles = async () => {
      try {
        const url = `${import.meta.env.VITE_APP_API_URL}/likedArticles`;
        const token = localStorage.getItem("jwt"); // Get token from local storage
        if (!token) {
          return;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`, // Set the Authorization header
          },
        });

        if (response.status === 200) {
          setLikedArticles(response.data.articles);
        } else {
          toast.error("Failed to fetch liked articles.");
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log("error  occur");
      }
    };

    fetchLikedArticles();
  }, []);

  // Function to truncate summary to a specified number of words
  const truncateSummary = (summary, maxWords) => {
    const words = summary.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return summary;
  };

  const navigateArticleDetails = async (id) => {
    const url = `${import.meta.env.VITE_APP_API_URL}/isAuthorized`;
    const token = localStorage.getItem("jwt"); // Get token from local storage

    const isAuth = await axios.get(url, {
      headers: {
        Authorization: `${token}`, // Set the Authorization header
      },
    });

    if ([201, 202, 401].includes(isAuth.status)) {
      toast.error(isAuth.data.message);
      navigate("/login");
    } else if (isAuth.status === 200) {
      navigate(`/articleDetails/${id}`);
    }
  };

  return (
    <div className=" py-6">
      <Toaster />
      <h1 className="font-semibold text-3xl font-serif pl-12 pt-6">
        Liked Articles
      </h1>
      <div className="flex flex-col space-y-7 items-center mt-6">
        {likedArticles.length > 0 ? (
          likedArticles.map((article) => (
            <div
              onClick={() => navigateArticleDetails(article._id)}
              key={article._id}
              className="bg-slate-800 shadow-md p-4 w-[80%] rounded-md cursor-pointer"
            >
              <div className="flex">
                <img
                  src={article.image}
                  alt=""
                  className="w-60 h-36 object-cover mr-4 rounded-md"
                />
                <div className="flex flex-col">
                  <h1 className="text-white font-bold text-xl mb-2">
                    {article.title}
                  </h1>
                  <h1 className="text-white mb-2">{article.category}</h1>
                  <h1 className="text-gray-400 mb-2">
                    {new Date(article.createdAt).toLocaleString()}
                  </h1>
                  <p className="text-gray-300">
                    {truncateSummary(article.summary, 20)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No liked articles found.</p>
        )}
      </div>
    </div>
  );
};

export default LikedArticle;
