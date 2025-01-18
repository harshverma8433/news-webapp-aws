import { useState, useEffect, useContext } from "react";
import { MdAccountCircle } from "react-icons/md";
import Categories from "../Categories/Categories";
import { FiEdit } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { GrArticle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./SideBar.css";
import { SearchContext } from "../Context/SearchContext";

// eslint-disable-next-line react/prop-types
const SideBar = ({ setHamburger }) => {
  const { setCategory } = useContext(SearchContext);
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt"); // Get token from local storage

      try {
        const url = `${import.meta.env.VITE_APP_API_URL}/user`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        });
        if (response.status === 200) {
          setUser(response.data);
        } else {
          // console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const logOut = async () => {
    localStorage.removeItem("jwt"); // Remove token from local storage
    setUser(null);
    alert("LogOut SuccessFully");
    navigate("/");
  };

  const handleCategory = (category, navigateLink) => {
    setCategory(category.toLowerCase());
    setActive(category);
    if (navigateLink) {
      navigate(navigateLink);
    }
  };

  return (
    <div>
      <div className="flex flex-col py-1 justify-between w-60 h-screen bg-slate-900 text-white">
        <div className="flex justify-between px-4">
          <div className="tracking-widest">
            <h1 className="text-3xl font-serif pt-1 text-center text-white">
              The News Of India
            </h1>
          </div>
        </div>

        <div className="flex-grow h-96 overflow-y-scroll custom-scrollbar">
          <div className="flex flex-col items-center bg-slate-900 mt-2">
            {user ? (
              <div className="py-6 flex flex-col items-center">
                <img
                  src={user.image}
                  className="w-36 h-36 rounded-full"
                  alt=""
                />

                <Link
                  to="/addArticle"
                  className={`flex rounded-xl items-center pl-7 mt-6 gap-x-6 w-52 h-12 hover:bg-slate-400 cursor-pointer`}
                >
                  <h1 className="text-2xl">
                    <AiOutlinePlus />
                  </h1>
                  <h1 className="text-xl">Add Article</h1>
                </Link>

                <Link
                  to="/myArticle"
                  onClick={() => setHamburger(false)}
                  className={`flex rounded-xl items-center pl-7 mt-2 gap-x-6 w-52 h-12 hover:bg-slate-400 cursor-pointer ${
                    active === "My Article" ? "bg-gray-600" : ""
                  }`}
                >
                  <h1 className="text-2xl">
                    <GrArticle />
                  </h1>
                  <h1 className="text-xl">My Article</h1>
                </Link>

                <Link
                  to="/likeArticle"
                  onClick={() => setHamburger(false)}
                  className={`flex rounded-xl items-center pl-7 mt-2 gap-x-6 w-52 h-12 hover:bg-slate-400 cursor-pointer ${
                    active === "My Article" ? "bg-gray-600" : ""
                  }`}
                >
                  <h1 className="text-2xl">
                    <FaRegHeart />
                  </h1>
                  <h1 className="text-xl">Liked Articles</h1>
                </Link>

                <Link
                  to={`/updatePage/${user._id}`}
                  className={`flex rounded-xl items-center pl-7 mt-4 gap-x-6 w-52 h-12 hover:bg-slate-400 cursor-pointer`}
                >
                  <h1 className="text-2xl">
                    <FiEdit />
                  </h1>
                  <h1 className="text-xl">Edit Profile</h1>
                </Link>

                <div
                  onClick={logOut}
                  className="flex rounded-xl items-center pl-7 mt-4 gap-x-6 w-52 h-12 hover:bg-slate-400 cursor-pointer"
                >
                  <h1 className="text-2xl">
                    <IoLogOutOutline />
                  </h1>
                  <h1 className="text-xl">Log Out</h1>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="my-6 flex gap-x-2 items-center border border-white px-4 py-1 rounded-full"
              >
                <MdAccountCircle className="text-2xl" />
                <p className="text-lg"> Sign In</p>
              </button>
            )}
          </div>

          <Categories handleCategory={handleCategory} active={active} />
        </div>
      </div>
    </div>
  );
};

export default SideBar;