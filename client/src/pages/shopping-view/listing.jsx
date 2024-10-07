import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { getFilteredProducts } from "@/store/shop-products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function ShoppiungListing() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { productList = [], isLoading } = useSelector(
    (state) => state.shopProducts,
  );
  console.log(productList);
  // fetch list of products
  useEffect(() => {
    dispatch(
      getFilteredProducts({
        filter: searchParams.get("filter"),
        sortBy: searchParams.get("sortBy") || "title-atoz",
      }),
    );
  }, [searchParams.get("filter"), searchParams.get("sortBy")]);

  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-[300px_1fr] md:p-6">
      <ProductFilter />
      <div className="w-full rounded-lg bg-background shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="mr-2 text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">10 Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      onClick={() => {
                        searchParams.set("sortBy", sortItem.id);
                        setSearchParams(searchParams);
                      }}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
          {isLoading
            ? "Loading..."
            : productList?.map((product) => (
                <ShoppingProductTile product={product} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default ShoppiungListing;
