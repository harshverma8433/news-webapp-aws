/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all news");

  return (
    <SearchContext.Provider
      value={{ search, setSearch, category, setCategory }}
    >
      {children}
    </SearchContext.Provider>
  );
};
