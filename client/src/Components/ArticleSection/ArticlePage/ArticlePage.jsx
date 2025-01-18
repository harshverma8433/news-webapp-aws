/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Article from "../Article/Article";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../Context/SearchContext";
import Loading from "../../Loader/Loader.jsx";
const ArticlePage = ({ hamburger, myArticle }) => {
  const navigate = useNavigate();

  const { search, category } = useContext(SearchContext);
  const [sorting, setSorting] = useState("default");
  const [articles, setArticle] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading

  const filterArticles = articles
    .filter((article) => {
      const matchesCategory =
        category === "all news" || article.category.toLowerCase() === category;
      const matchesSearch = article.summary
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sorting === "title") {
        return a.title.localeCompare(b.title);
      } else if (sorting === "author") {
        return a.author.localeCompare(b.author);
      } else if (sorting === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sorting === "likes") {
        return b.likes - a.likes; // Sorting by likes in descending order
      } else {
        return 0; // Default sorting
      }
    });

  const handleSorting = (event) => {
    setSorting(event.target.value);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      const url = myArticle
        ? `${import.meta.env.VITE_APP_API_URL}/myArticles`
        : `${import.meta.env.VITE_APP_API_URL}/getArticles`;

      try {
        const token = localStorage.getItem("jwt");

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setArticle(response.data.articles);
        } else if (response.status === 401) {
          alert(response.data.message);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [myArticle, navigate]);

  return (
    <div className="overflow-y-scroll custom-scrollbar flex  flex-col h-[710px]">
      <div
        className={
          hamburger
            ? `flex justify-between items-center px-10`
            : `flex justify-between items-center px-5 pt-4`
        }
      >
        <h1 className="text-3xl tracking-wider font-serif">
          Category : {category}
        </h1>
        <select
          onChange={handleSorting}
          className="focus:outline-0 w-80 bg-slate-900 text-white rounded-lg px-2 py-2 my-4 cursor-pointer"
        >
          <option
            className="bg-slate-900 text-white rounded-lg px-2 py-2 cursor-pointer"
            value="default"
          >
            Default
          </option>
          <option
            className="bg-slate-900 text-white rounded-lg px-2 py-2 cursor-pointer"
            value="title"
          >
            Sort By: Title
          </option>
          <option
            className="bg-slate-900 text-white rounded-lg px-2 py-2 cursor-pointer"
            value="author"
          >
            Sort By: Author
          </option>
          <option
            className="bg-slate-900 text-white rounded-lg px-2 py-2 cursor-pointer"
            value="date"
          >
            Sort By: Date
          </option>
        </select>
      </div>
      <div
        className={
          hamburger
            ? `flex flex-wrap pl-9 gap-x-2 py-6 gap-y-2`
            : "grid grid-cols-3 gap-2 px-3 my-5"
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            {filterArticles.length > 0 ? (
              filterArticles.map((article, index) => (
                <Article hamburger={hamburger} key={index} article={article} />
              ))
            ) : (
              <h1 className="text-3xl text-slate-900 tracking-wider font-serif">
                No articles found
              </h1>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
