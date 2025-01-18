import  { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [registerPayload, setRegisterPayload] = useState({
    username: "",
    email: "",
    password: "",
  });

  const loadFile = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setFile(file);
  };

  const handleRegisterPayload = (event) => {
    const { name, value } = event.target;
    setRegisterPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };
  const submitRegisterForm = async (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("username", registerPayload.username);
    formdata.append("email", registerPayload.email);
    formdata.append("password", registerPayload.password);
    if (!file) {
      alert("please upload an image");
      return;
    }
    formdata.append("image", file);
  
    try {
      const url = `${import.meta.env.VITE_APP_API_URL}/register`;
      const response = await axios.post(url, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        toast.success(response.data.message);
        setRegisterPayload({
          username: "",
          email: "",
          password: "",
        });
        setFile(null);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('An error occurred during registration.');
    }
  };
  

  return (
    <div className='relative min-h-screen flex justify-center items-center bg-slate-950'>
      <div className='absolute inset-0 bg-slate-950 bg-opacity-30 backdrop-blur-2xl z-0'></div>
      <div className='relative bg-slate-800 text-white rounded-xl z-10 p-6 sm:p-16 w-full sm:max-w-md'>
        <RxCross2 onClick={() => navigate("/")} className='absolute z-10 text-2xl top-4 right-4 cursor-pointer' />
        <form
          method="post"
          className="space-y-5"
          onSubmit={submitRegisterForm}
          encType="multipart/form-data"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Create an account</h3>
          </div>

          <div className="flex items-center space-x-6 pb-8">
            <div className="shrink-0">
              <img
                id="preview_img"
                className="h-16 w-16 object-cover rounded-full"
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4V2hNksnmAV1Keq-R04Jsk-hf4s1_eIz4QAz4jdsc7w&s"
                }
                alt="Current Profile"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                onChange={loadFile}
                className="text-slate-700 block w-full text-sm sm:w-auto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </label>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm mb-2 block">Name</label>
              <div className="relative flex items-center">
                <input
                  name="username"
                  type="text"
                  required
                  className="text-slate-700 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-gray-300"
                  placeholder="Enter name"
                  value={registerPayload.username}
                  onChange={handleRegisterPayload}
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Email Id</label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  required
                  className="text-slate-700 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-gray-300"
                  placeholder="Enter email"
                  value={registerPayload.email}
                  onChange={handleRegisterPayload}
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Password</label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  required
                  className="text-slate-700 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-gray-300"
                  placeholder="Enter password"
                  value={registerPayload.password}
                  onChange={handleRegisterPayload}
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button className="w-full py-3 px-4 text-sm font-semibold rounded bg-slate-700 hover:bg-slate-600 text-white focus:outline-none cursor-pointer">
              Create an account
            </button>
          </div>
          <p className="text-sm mt-6 text-center">
            Already have an account?
            <Link
              to="/login"
              className="text-slate-500 font-semibold hover:underline ml-1 cursor-pointer"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegistrationPage;
