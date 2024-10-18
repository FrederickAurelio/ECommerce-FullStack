import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { setProductDetails } from "@/store/shop-products-slice";

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
}) {
  const dispatch = useDispatch();
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid max-w-[90vw] grid-cols-2 gap-8 sm:max-w-[80vw] sm:p-12 lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
            alt={productDetails?.title}
            src={productDetails?.imageUrl}
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="mb-5 mt-4 text-xl text-muted-foreground">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p
              className={`${productDetails?.salePrice > 0 ? "text-xl line-through" : "text-2xl"} font-bold text-primary`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-red-500">
                ${productDetails?.salePrice}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <StarIcon className="h-5 w-5 fill-primary" />
              <StarIcon className="h-5 w-5 fill-primary" />
              <StarIcon className="h-5 w-5 fill-primary" />
              <StarIcon className="h-5 w-5 fill-primary" />
              <StarIcon className="h-5 w-5 fill-primary" />
            </div>
            <span className="text-muted-foreground">(4.5)</span>
          </div>
          <div className="my-5">
            <Button
              onClick={() => {
                handleAddToCart(productDetails);
                setOpen(false);
              }}
              className="w-full"
            >
              Add to Cart
            </Button>
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="mb-4 mt-1 text-xl font-bold">Reviews</h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Sangam Mukherjee</h3>
                  </div>
                  <p className="text-muted-foreground">
                    This product is awesome
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Input placeholder="Write a review..." />
            <Button>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
