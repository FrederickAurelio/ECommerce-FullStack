import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

const FilterContext = createContext();

const FilterProvider = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [checkFilter, setCheckFilter] = useState(
    JSON.parse(searchParams.get("filter")) || {
      category: [],
      brand: [],
    },
  );

  useEffect(() => {
    if (
      (location.pathname === "/shop/listing") &&
      isAuthenticated
    ) {
      searchParams.set("filter", JSON.stringify(checkFilter));
      setSearchParams(searchParams);
    }
  }, [searchParams, checkFilter]);
  return (
    <FilterContext.Provider value={{ checkFilter, setCheckFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("Your Component is outside Provider");
  return context;
};

export { useFilter, FilterProvider };

