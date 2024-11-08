import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { getSearchResults, resetSearchResult } from "@/store/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const dispatch = useDispatch();
  const location = useLocation();
  const { searchResult, isLoading } = useSelector((state) => state.shopSearch);

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length >= 3) {
      dispatch(getSearchResults(keyword));
    } else dispatch(resetSearchResult());

    if (location.pathname === "/shop/search") {
      searchParams.set("search", keyword);
      setSearchParams(searchParams);
    }
  }, [keyword]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex justify-center">
        <div className="flex w-full items-center">
          <Input
            onChange={(e) => setKeyword(e.target.value)}
            name="keyword"
            value={keyword}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : searchResult && searchResult.length > 0 ? (
          searchResult.map((item) => (
            <ShoppingProductTile
              key={item._id}
              showOption="home"
              product={item}
            />
          ))
        ) : keyword.trim().length < 3 ? (
          ""
        ) : (
          <h1 className="text-5xl font-extrabold">No Result</h1>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
