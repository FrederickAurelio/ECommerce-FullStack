import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useDispatch } from "react-redux";
import { getDetailedProducts } from "@/store/shop-products-slice";

function ShoppingProductTile({
  product,
  handleAddToCart,
  showOption = "none",
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  function handleGetDetailsProduct(productId, isPass) {
    if (product?.totalStock === 0) return null;
    if (location.pathname === "/shop/listing" || isPass === "pass")
      dispatch(getDetailedProducts(productId));
  }

  return (
    <Card
      className={`max-w-sn mx-auto w-full ${product?.totalStock === 0 ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <div onClick={() => handleGetDetailsProduct(product?._id)}>
        <div className="relative">
          <img
            className="h-[300px] w-full rounded-t-lg object-cover"
            src={product?.imageUrl}
            alt={product?.title}
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
              Out of stocks
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute left-2 top-2 bg-orange-500 hover:bg-red-600">
              Only {product?.totalStock} items left
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute left-2 top-2 bg-rose-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="mb-2 text-xl font-bold">{product?.title}</h2>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm capitalize text-muted-foreground">
              {product?.category}
            </span>
            <span className="text-sm capitalize text-muted-foreground">
              {product?.brand}
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`${product?.salePrice > 0 ? "text-sm line-through" : ""} text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary text-red-500">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock !== 0 ? (
          showOption === "home" ? (
            <Button
              onClick={() => {
                navigate("/shop/listing");
                handleGetDetailsProduct(product?._id, "pass");
              }}
              className="w-full"
            >
              View more details
            </Button>
          ) : (
            <Button onClick={() => handleAddToCart(product)} className="w-full">
              Add to Cart
            </Button>
          )
        ) : (
          <Button disabled={true} className="w-full bg-muted-foreground">
            Out of Stocks
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
