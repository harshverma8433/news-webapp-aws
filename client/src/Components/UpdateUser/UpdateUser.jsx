import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState();
  const [updatePayload, setupdatePayload] = useState({
    username: "",
    email: "",
    password: "",
  });

  const loadFile = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleupdatePayload = (event) => {
    const { name, value } = event.target;
    setupdatePayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const submitupdateForm = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", updatePayload.username);
      formData.append("email", updatePayload.email);
      formData.append("password", updatePayload.password);
      if (file) {
        formData.append("image", file);
      }

      const uri = `${import.meta.env.VITE_APP_API_URL}/updateuser/${id}`;
      const token = localStorage.getItem("jwt");
      const response = await axios.post(uri, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if ([201, 202].includes(response.status)) {
        toast(response.data.message);
      } else if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the profile.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uri = `${import.meta.env.VITE_APP_API_URL}/user`;
        const token = localStorage.getItem("jwt");
        const response = await axios.get(uri, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        setupdatePayload({
          username: user.username,
          email: user.email,
        });
        setFileUrl(user.image);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-slate-950">
      <div className="absolute inset-0 bg-slate-950 bg-opacity-30 backdrop-blur-2xl z-0"></div>
      <div className="relative bg-slate-800 text-white rounded-xl z-10 p-6 sm:p-16">
        <RxCross2
          onClick={() => navigate("/")}
          className="absolute z-10 text-2xl top-4 right-4 cursor-pointer"
        />
        <form
          method="post"
          className="space-y-5"
          onSubmit={submitupdateForm}
          encType="multipart/form-data"
        >
          <div className="">
            <h3 className="text-2xl font-bold">Update your account</h3>
          </div>

          <div className="flex items-center space-x-6 pb-2">
            <div className="shrink-0">
              <img
                id="preview_img"
                className="h-16 w-16 object-cover rounded-full"
                src={file ? URL.createObjectURL(file) : fileUrl}
                alt="Current Profile"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                onChange={loadFile}
                className="text-slate-700 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
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
                  value={updatePayload.username}
                  onChange={handleupdatePayload}
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
                  readOnly
                  value={updatePayload.email}
                  onChange={handleupdatePayload}
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button className="w-full py-3 px-4 text-sm font-semibold rounded bg-slate-700 hover:bg-slate-600 text-white focus:outline-none cursor-pointer">
              Update account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
