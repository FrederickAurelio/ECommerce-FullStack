import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import {
  createReview,
  getDetailedProducts,
  setProductDetails,
} from "@/store/shop-products-slice";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
}) {
  const dispatch = useDispatch();
  const avgRating =
    productDetails?.reviews.reduce((acc, review) => acc + review.rating, 0) /
    productDetails?.reviews.length;
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  function handleDialogClose() {
    setOpen(false);
    setRating(0);
    setHoverRating(0);
    setComment("");
    dispatch(setProductDetails());
  }

  function handlePostReview() {
    if (rating === 0) {
      toast({
        title: "Please give a rating first",
        variant: "destructive",
      });
      return null;
    }
    if (comment.length >= 50) {
      toast({
        title: "The Review is too long",
        variant: "destructive",
      });
      return null;
    }
    dispatch(
      createReview({
        productId: productDetails._id,
        comment: comment,
        rating: rating,
      }),
    ).then((data) => {
      toast({
        title: data.payload.message,
        variant: data.payload.success ? "" : "destructive",
      });
      dispatch(getDetailedProducts(productDetails?._id));
    });
    setComment("");
    setRating(0);
    setHoverRating(0);
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
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${avgRating >= i ? "fill-primary" : ""}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">({avgRating})</span>
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
          <div className="max-h-[240px] overflow-auto">
            <h2 className="mb-4 mt-1 text-xl font-bold">Reviews</h2>
            <div className="grid gap-6">
              {productDetails?.reviews.length === 0 && <h2>No Reviews</h2>}
              {productDetails?.reviews.map((review) => (
                <div className="flex gap-4">
                  <Avatar className="h-14 w-14 border text-xl">
                    <AvatarFallback>
                      {review.userId.userName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{review.userId.userName}</h3>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          size={15}
                          className={`${review.rating >= i ? "fill-primary opacity-80" : ""}`}
                          key={i}
                        />
                      ))}
                      {console.log(review)}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            onMouseLeave={() => setHoverRating(0)}
            className="mt-6 flex gap-0.5"
          >
            <h2 className="font-bold">Rating: </h2>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                className={`cursor-pointer ${hoverRating >= i && hoverRating !== 0 ? "fill-primary" : rating >= i && hoverRating === 0 ? "fill-primary" : ""}`}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a review..."
            />
            <Button onClick={() => handlePostReview()}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
