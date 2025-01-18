import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const UpdateArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [updatenewsPayload, setupdatenewsPayload] = useState({
    title: "",
    author: "",
    summary: "",
    category: "",
  });

  useEffect(() => {
    const fetchUpdateArticleDetails = async () => {
      try {
        const uri = `${import.meta.env.VITE_APP_API_URL}/getArticle/${id}`;
        const token = localStorage.getItem("jwt"); // Get token from local storage

        const response = await axios.get(uri, {
          headers: {
            Authorization: `${token}`, // Set the Authorization header
          },
        });

        if ([201, 202, 401].includes(response.status)) {
          toast.error(response.data.message);
          navigate("/login");
        } else if (response.status === 200) {
          const { title, author, summary, category } = response.data.article;
          setupdatenewsPayload({ title, author, summary, category });
          setFileUrl(response.data.article.image);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchUpdateArticleDetails();
  }, [id, navigate]);

  const options = [
    { label: "politics", value: "Politics" },
    { label: "sports", value: "Sports" },
    { label: "bussiness", value: "Bussiness" },
    { label: "social media", value: "Social Media" },
    { label: "entertainment", value: "Entertainment" },
    { label: "psychology", value: "Psychology" },
    { label: "science", value: "Science" },
    { label: "technology", value: "Technology" },
  ];

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleupdatenewsPayload = (event) => {
    const { name, value } = event.target;
    setupdatenewsPayload((prevupdatenewsPayload) => ({
      ...prevupdatenewsPayload,
      [name]: value,
    }));
  };

  const handleCategory = (event) => {
    setupdatenewsPayload((prevupdatenewsPayload) => ({
      ...prevupdatenewsPayload,
      category: event.value,
    }));
  };

  const submitUpdateArticleForm = async (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("title", updatenewsPayload.title);
    formdata.append("category", updatenewsPayload.category);
    formdata.append("summary", updatenewsPayload.summary);
    formdata.append("author", updatenewsPayload.author);
    if (file) {
      formdata.append("image", file);
    }
    try {
      const uri = `${import.meta.env.VITE_APP_API_URL}/updateArticle/${id}`;
      const token = localStorage.getItem("jwt"); // Get token from local storage

      const response = await axios.put(uri, formdata, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
      }

      if (response.status === 200) {
        setupdatenewsPayload({
          title: "",
          category: "",
          summary: "",
          author: "",
        });
        setFile(null);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgb(15 23 42) ",
      color: "white",
      height: "100%",
      border: "none",
      borderRadius: "12px",
      borderColor: "rgb(51 65 85)",
      outline: "none",
      boxShadow: state.isFocused ? "none" : "none",
    }),
    option: (provided) => ({
      ...provided,
      color: "white",
      backgroundColor: "rgb(17, 24, 39) ",
      cursor: "pointer",
    }),
  };

  return (
    <form
      onSubmit={submitUpdateArticleForm}
      method="post"
      className="flex flex-col items-center  bg-slate-900 w-full min-h-screen pt-16"
    >
      <div className="flex items-center justify-center flex-col border-2 w-[550px] border-slate-700 border-dotted px-5 py-2 rounded-xl">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full rounded-lg cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            name="image"
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFile}
          />
        </label>

        <img
          src={file ? URL.createObjectURL(file) : fileUrl}
          className="w-96 h-60"
          alt=""
        />
      </div>

      <div className="flex flex-col text-white gap-y-6">
        <Select
          onChange={handleCategory}
          value={options.find(
            (option) => option.value === updatenewsPayload.category
          )}
          name="category"
          id="category"
          required
          options={options}
          styles={customStyles}
          className="mt-6 text-white focus:outline-none h-12 border-2 border-slate-700 border-dotted rounded-lg "
        />
        <input
          value={updatenewsPayload.title}
          onChange={handleupdatenewsPayload}
          placeholder="Enter Arctile Title"
          name="title"
          id="title"
          required
          type="text"
          className="w-[550px] bg-slate-900 border-2 px-4 text-lg text-white border-slate-700 focus:outline-0 h-12 rounded-xl border-dotted"
        />
        <input
          value={updatenewsPayload.author}
          onChange={handleupdatenewsPayload}
          placeholder="Author Name"
          name="author"
          id="author"
          required
          type="text"
          className="w-[550px] bg-slate-900 border-2 px-4 text-lg text-white border-slate-700 focus:outline-0 h-12 rounded-xl border-dotted"
        />
        <textarea
          value={updatenewsPayload.summary}
          onChange={handleupdatenewsPayload}
          placeholder="Enter Article Summary"
          name="summary"
          id="summary"
          required
          type="text"
          className="w-[550px] h-48 px-4 py-2  bg-slate-900 border-2  text-lg text-white border-slate-700 focus:outline-0  rounded-xl border-dotted"
        />
      </div>

      <button className="text-white rounded-xl mt-6 bg-blue-400 px-6 py-2 text-xl tracking-wider mb-6 ">
        PUBLISH
      </button>
    </form>
  );
};

export default UpdateArticleForm;
