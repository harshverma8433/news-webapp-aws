import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginPayload, setLoginPayload] = useState({
    email: "",
    password: "",
  });

  const handleLoginPayload = (event) => {
    const { name, value } = event.target;
    setLoginPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const submitLoginForm = async (event) => {
    event.preventDefault();
    console.log(loginPayload);
    try {
      const url = `${import.meta.env.VITE_APP_API_URL}/login`;

      const response = await axios.post(url, loginPayload);

      if (response.status === 200) {
        console.log(response);
        localStorage.setItem("jwt", response.data.token);
        toast.success(response.data.message);
        setLoginPayload({
          email: "",
          password: "",
        });
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-200">
      <div className="absolute inset-0 bg-slate-950 backdrop-blur-2xl z-0"></div>
      <div className="relative bg-slate-800 text-white rounded-xl z-10 p-6 sm:p-16">
        <RxCross2
          onClick={() => navigate("/")}
          className="absolute z-10 text-2xl top-4 right-4 cursor-pointer"
        />
        <form className="space-y-5" onSubmit={submitLoginForm}>
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Sign In to your account</h3>
          </div>
          <div>
            <label className="text-sm mb-2 block">Email Id</label>
            <div className="relative flex items-center">
              <input
                name="email"
                type="email"
                required
                className="text-slate-700 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-gray-400"
                placeholder="Enter email"
                value={loginPayload.email}
                onChange={handleLoginPayload}
              />
              <IoMdMail className="absolute right-4 text-slate-500" />
            </div>
          </div>
          <div>
            <label className="text-sm mb-2 block">Password</label>
            <div className="relative flex items-center">
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                required
                className="text-slate-700 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-gray-400"
                placeholder="Enter password"
                value={loginPayload.password}
                onChange={handleLoginPayload}
              />
              {passwordVisible ? (
                <FaRegEye
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 text-slate-500 cursor-pointer"
                />
              ) : (
                <FaRegEyeSlash
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 text-slate-500 cursor-pointer"
                />
              )}
            </div>
          </div>
          <div className="mt-10">
            <button className="w-full py-3 px-4 text-sm font-semibold rounded bg-slate-700 hover:bg-slate-600 text-white focus:outline-none cursor-pointer">
              Sign In
            </button>
          </div>
          <h1 className="text-sm mt-6 flex justify-center">
            Don&apos;t have an account?
            <Link
              to="/register"
              className="text-gray-300 tracking-wide font-semibold hover:underline ml-1 cursor-pointer"
            >
              Register here
            </Link>
          </h1>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
