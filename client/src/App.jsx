import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import SideBar from "./Components/SideBar/SideBar";
import NavBar from "./Components/NavBar/NavBar";
import LoginPage from "./Components/LoginPage/LoginPage";
import RegistrationPage from "./Components/RegistrationPage/RegistrationPage";
import UpdateUser from "./Components/UpdateUser/UpdateUser";
import ArticleForm from "./Components/ArticleSection/ArticleForm/ArticleForm";
import ArticlePage from "./Components/ArticleSection/ArticlePage/ArticlePage";
import ArticleDetails from "./Components/ArticleSection/ArticleDetails/ArticleDetails";
import UpdateArticleForm from "./Components/ArticleSection/UpdateArticleForm/UpdateArticleForm";
import MyArticle from "./Components/ArticleSection/MyArticle/MyArticle";
import LikedArticle from "./Components/ArticleSection/LikedArticle/LikedArticle";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [hamburger, setHamburger] = useState(true);

  return (
    <>
      <Toaster />
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout hamburger={hamburger} setHamburger={setHamburger} />
            }
          >
            <Route index element={<ArticlePage hamburger={hamburger} />} />
            <Route
              path="/myArticle"
              element={
                <MyArticle setHamburger={setHamburger} hamburger={hamburger} />
              }
            />
            <Route path="/likeArticle" element={<LikedArticle />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/updatePage/:id" element={<UpdateUser />} />
          <Route path="/addArticle" element={<ArticleForm />} />
          <Route
            path="/updateArticleForm/:id"
            element={<UpdateArticleForm />}
          />
          <Route path="/articleDetails/:id" element={<ArticleDetails />} />
        </Routes>
      </div>
    </>
  );
};

// eslint-disable-next-line react/prop-types
const MainLayout = ({ hamburger, setHamburger }) => (
  <div className="flex">
    {hamburger && <SideBar setHamburger={setHamburger} />}
    <div className="flex flex-col w-full">
      <NavBar hamburger={hamburger} setHamburger={setHamburger} />
      <div className="content">
        <Outlet />
      </div>
    </div>
  </div>
);

export default App;
