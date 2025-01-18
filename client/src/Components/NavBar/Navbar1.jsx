import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io";
import { RiLinkedinLine } from "react-icons/ri";
import { AiFillYoutube } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
const NavBar = () => {
  const socialicons = [
    {
      id: 1,
      icon: <FaFacebookF />,
      color: "border-blue-600",
      text: "text-blue-600",
      to: "/facebook",
    },
    {
      id: 2,
      icon: <FaXTwitter />,
      color: "border-white",
      text: "text-white",
      to: "/twitter",
    },
    {
      id: 3,
      icon: <IoLogoInstagram />,
      color: "border-pink-600",
      text: "text-pink-600",
      to: "/instagram",
    },
    {
      id: 4,
      icon: <RiLinkedinLine />,
      color: "border-blue-500",
      text: "text-blue-500",
      to: "/linkedin",
    },
    {
      id: 5,
      icon: <AiFillYoutube />,
      color: "border-red-600",
      text: "text-red-600",
      to: "/youtube",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-900 text-white">
      <div className="flex items-center justify-between px-8 w-full h-16 ">
        <Link to="/">
          <FaHome className="text-2xl" />
        </Link>

        {
          <h1 className="text-3xl font-serif tracking-widest">
            THE NEWS OF INDIA
          </h1>
        }
        <div className="flex gap-x-6">
          {socialicons.map((item) => {
            return (
              <div
                key={item.id}
                className={`border rounded-full text-2xl cursor-pointer px-1 py-1 ${item.color} ${item.text} border-2 font-semibold`}
              >
                <h1>{item.icon}</h1>
              </div>
            );
          })}
        </div>
      </div>

      <hr />
    </div>
  );
};

export default NavBar;
