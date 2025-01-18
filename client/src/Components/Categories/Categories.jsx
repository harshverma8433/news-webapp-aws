/* eslint-disable react/prop-types */
import { IoDocumentText } from "react-icons/io5";
import { FaVoteYea } from "react-icons/fa";
import { MdSportsHandball } from "react-icons/md";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { TiSocialYoutube } from "react-icons/ti";
import { MdLocalMovies } from "react-icons/md";
import { MdPsychologyAlt } from "react-icons/md";
import { MdScience } from "react-icons/md";
import { GrTechnology } from "react-icons/gr";

const Categories = ({ active, handleCategory }) => {
  const categoryItems = [
    { id: 1, name: "All News", icon: <IoDocumentText />, navigateLink: "/" },
    { id: 2, name: "Politics", icon: <FaVoteYea />, navigateLink: "/" },
    { id: 3, name: "Sports", icon: <MdSportsHandball />, navigateLink: "/" },
    {
      id: 4,
      name: "Business",
      icon: <PiBuildingOfficeFill />,
      navigateLink: "/",
    },
    {
      id: 5,
      name: "Social Media",
      icon: <TiSocialYoutube />,
      navigateLink: "/",
    },
    {
      id: 6,
      name: "Entertainment",
      icon: <MdLocalMovies />,
      navigateLink: "/",
    },
    { id: 7, name: "Health", icon: <MdPsychologyAlt />, navigateLink: "/" },
    { id: 8, name: "Science", icon: <MdScience />, navigateLink: "/" },
    { id: 9, name: "Technology", icon: <GrTechnology />, navigateLink: "/" },
    { id: 10, name: "History", icon: <GrTechnology />, navigateLink: "/" },
  ];

  const isActive = (categoryName) =>
    active === categoryName ? "bg-gray-600" : "";

  return (
    <div className="pb-6 bg-slate-900">
      <hr className="border border-slate-800" />
      <h1 className="text-center py-4 text-2xl tracking-wider font-serif">
        Categories
      </h1>
      <hr className="border border-slate-800 bg-slate-900" />

      <div className="flex flex-col justify-center items-center gap-y-5 mt-6">
        {categoryItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCategory(item.name, item.navigateLink)}
            className={`flex rounded-xl items-center pl-8 gap-x-3 w-52 h-12 hover:bg-slate-400 cursor-pointer ${isActive(
              item.name
            )}`}
          >
            <h1 className="text-2xl">{item.icon}</h1>
            <h1 className="text-xl">{item.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
