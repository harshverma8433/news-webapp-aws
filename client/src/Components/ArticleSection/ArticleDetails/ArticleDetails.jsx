import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import DefaultComponent from "../../Comment/DefaultComponent/DefaultComponent";
import NavBar from "../../NavBar/Navbar1";

const ArticleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [articleDetails, setArticleDetails] = useState({});
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const token = localStorage.getItem("jwt"); // Get token from local storage

        const url = `${import.meta.env.VITE_APP_API_URL}/getArticle/${id}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`, // Set the Authorization header
          },
        });

        if (response.status === 201) {
          navigate("/login");
        } else if (response.status === 200) {
          setArticleDetails(response.data.article);
          setIsLiked(response.data.article.isLiked);
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        console.error("Error fetching article details:", error);
      }
    };

    fetchArticleDetails();
  }, [id, navigate]);

  const handleLikeToggle = async () => {
    try {
      const uri = `${import.meta.env.VITE_APP_API_URL}/likeArticle/${id}`;
      const token = localStorage.getItem("jwt"); // Get token from local storage

      const response = await axios.post(
        uri,
        {},
        {
          headers: {
            Authorization: `${token}`, // Set the Authorization header
          },
        }
      );

      if (response.status === 200) {
        setIsLiked(response.data.isLiked);
        toast.success(
          response.data.isLiked ? "Article liked!" : "Article unliked!"
        );
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col ">
        <div className="flex  justify-center">
          <div className="flex flex-col lg:flex-row w-screen h-[50%] justify-center   lg:space-x-8 p-4">
            <div className="lg:w-[60%] h-[60%]  mt-12">
              <h1 className="font-semibold text-3xl font-serif">
                {articleDetails.title}
              </h1>
              <p className="py-3 text-lg tracking-wide">
                <span className="text-red-500">Published On</span>:{" "}
                {new Date(articleDetails.createdAt).toLocaleString()} By{" "}
                {articleDetails.author}
              </p>
              <img
                alt="Article"
                src={articleDetails.image}
                className="w-full h-[50%]   rounded-md shadow-md"
              />
              <p className="pt-8 text-xl tracking-wide leading-8">
                {articleDetails.summary}
              </p>
            </div>

            <div className="pt-14 text-3xl pl-0 lg:pl-20">
              {isLiked ? (
                <FaHeart
                  onClick={handleLikeToggle}
                  className="text-red-500 cursor-pointer"
                  aria-label="Unlike article"
                />
              ) : (
                <FaRegHeart
                  onClick={handleLikeToggle}
                  className="cursor-pointer"
                  aria-label="Like article"
                />
              )}
            </div>
          </div>
        </div>

        <div className="">
          <DefaultComponent articleId={id} />
        </div>
      </div>
    </>
  );
};

export default ArticleDetails;
