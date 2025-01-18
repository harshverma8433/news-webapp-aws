/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import Article2 from "../Article/Article2";
import toast from "react-hot-toast";
const MyArticle = ({ hamburger }) => {
  const [myArticles, setMyArticles] = useState([]);

  console.log(myArticles);
  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const token = localStorage.getItem("jwt"); // Get token from local storage
        if (!token) {
          return;
        }

        const uri = `${import.meta.env.VITE_APP_API_URL}/myArticles`;
        const response = await axios.get(uri, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.status === 200) {
          setMyArticles(response.data.articles);
        }
      } catch (err) {
        toast.error("An error occurred while fetching articles");
      }
    };

    fetchMyArticles();
  }, []);

  return (
    <div className="overflow-y-scroll custom-scrollbar  flex flex-col  h-[710px] ">
      <h1 className="text-5xl font-serif tracking-wide pt-5 pl-6">
        My Articles
      </h1>
      <div
        className={
          hamburger
            ? `flex  justify-between items-center px-10 `
            : `flex justify-between items-center px-5 pt-4 `
        }
      ></div>
      <div
        className={
          hamburger
            ? ` flex  flex-wrap pl-9 gap-x-2 py-6 gap-y-2  min-h-screen`
            : "grid grid-cols-3 gap-2 px-3 my-5 "
        }
      >
        {myArticles.length > 0 ? (
          myArticles.map((article, index) => (
            <Article2 hamburger={hamburger} key={index} article={article} />
          ))
        ) : (
          <h1 className="text-3xl text-slate-900 tracking-wider font-serif">
            No articles found
          </h1>
        )}
      </div>
    </div>
  );
};

export default MyArticle;
