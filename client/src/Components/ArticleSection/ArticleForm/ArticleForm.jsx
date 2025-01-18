import axios from "axios";
import { useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ArticleForm = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [newsPayload, setNewsPayload] = useState({
    title: "",
    author: "",
    summary: "",
    category: "",
  });

  const options = [
    { label: "Politics", value: "politics" },
    { label: "Sports", value: "sports" },
    { label: "Business", value: "business" },
    { label: "Social Media", value: "social media" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Psychology", value: "psychology" },
    { label: "Science", value: "science" },
    { label: "Technology", value: "technology" },
  ];

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleNewsPayload = (event) => {
    const { name, value } = event.target;
    setNewsPayload((prevNewsPayload) => ({
      ...prevNewsPayload,
      [name]: value,
    }));
  };

  const handleCategory = (selectedOption) => {
    setNewsPayload((prevNewsPayload) => ({
      ...prevNewsPayload,
      category: selectedOption.value,
    }));
  };

  const submitNewsForm = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newsPayload.title);
    formData.append("author", newsPayload.author);
    formData.append("summary", newsPayload.summary);
    formData.append("category", newsPayload.category);
    formData.append("image", file);

    try {
      const uri = `${import.meta.env.VITE_APP_API_URL}/addArticle`;
      const token = localStorage.getItem("jwt");

      const response = await axios.post(uri, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });

      if (response.status === 201) {
        toast.error(response.data.message);
        navigate("/login");
      } else if (response.status === 200) {
        setNewsPayload({
          title: "",
          author: "",
          summary: "",
          category: "",
        });
        setFile(null);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgb(15 23 42)",
      color: "white",
      height: "100%",
      border: "none",
      borderRadius: "12px",
      borderColor: "rgb(51 65 85)",
      outline: "none",
      boxShadow: state.isFocused ? "none" : "none",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "white",
      backgroundColor: state.isFocused ? "rgb(29, 43, 69)" : "rgb(17, 24, 39)",
      cursor: "pointer",
    }),
  };

  return (
    <form
      onSubmit={submitNewsForm}
      method="post"
      className="flex flex-col items-center bg-slate-900 w-full min-h-screen"
    >
      <h1 className="text-6xl tracking-wider text-white py-6 font-serif">
        Add Article
      </h1>

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
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG, or GIF (MAX. 800x400px)
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
        {file && (
          <img
            src={URL.createObjectURL(file)}
            className="w-96 h-60 mt-4 rounded-md"
            alt="Preview"
          />
        )}
      </div>

      <div className="flex flex-col text-white gap-y-6 mt-6">
        <Select
          onChange={handleCategory}
          name="category"
          id="category"
          required
          options={options}
          styles={customStyles}
          className="mt-6 text-white focus:outline-none h-12 border-2 border-slate-700 border-dotted rounded-lg"
        />
        <input
          value={newsPayload.title}
          onChange={handleNewsPayload}
          placeholder="Enter Article Title"
          name="title"
          id="title"
          required
          type="text"
          className="w-[550px] bg-slate-900 border-2 px-4 text-lg text-white border-slate-700 focus:outline-0 h-12 rounded-xl border-dotted"
        />
        <input
          value={newsPayload.author}
          onChange={handleNewsPayload}
          placeholder="Author Name"
          name="author"
          id="author"
          required
          type="text"
          className="w-[550px] bg-slate-900 border-2 px-4 text-lg text-white border-slate-700 focus:outline-0 h-12 rounded-xl border-dotted"
        />
        <textarea
          value={newsPayload.summary}
          onChange={handleNewsPayload}
          placeholder="Enter Article Summary"
          name="summary"
          id="summary"
          required
          className="w-[550px] h-48 px-4 py-2 bg-slate-900 border-2 text-lg text-white border-slate-700 focus:outline-0 rounded-xl border-dotted"
        />
      </div>

      <button className="text-white rounded-xl mt-6 bg-blue-400 px-6 py-2 text-xl tracking-wider mb-6">
        PUBLISH
      </button>
    </form>
  );
};

export default ArticleForm;
