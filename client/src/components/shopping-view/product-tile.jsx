import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function ShoppingProductTile({ handleGetDetailsProduct, product }) {
  return (
    <Card className="max-w-sn mx-auto w-full">
      <div onClick={() => handleGetDetailsProduct(product?._id)}>
        <div className="relative">
          <img
            className="h-[300px] w-full rounded-t-lg object-cover"
            src={product?.imageUrl}
            alt={product?.title}
          />
          {product?.salePrice > 0 ? (
            <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
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
        <CardFooter>
          <Button className="w-full">Add to Cart</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;
