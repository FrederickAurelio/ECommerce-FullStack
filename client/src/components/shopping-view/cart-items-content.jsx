import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty } from "@/store/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId }),
    ).then((data) => {
      toast({
        title: `${getCartItem?.title} is removed from the cart`,
      });
    });
  }
  function handleUpdateQuantity(cartItem, typeOfAction) {
    if (cartItem?.quantity <= 1 && typeOfAction === "minus") return null;
    dispatch(
      updateCartItemQty({
        userId: user?.id,
        productId: cartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? cartItem?.quantity + 1
            : cartItem?.quantity - 1,
      }),
    ).then((data) => {
      console.log(data)
      if (data?.payload?.success)
        toast({
          title: "Cart item is updated success",
        });
      else
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
    });
  }
  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.imageUrl}
        alt={cartItem?.title}
        className="aspect-square h-20 w-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="mt-1 flex items-center gap-2">
          <Button
            className="h-8 w-8 rounded-full disabled:bg-muted"
            variant="outline"
            size="icon"
            disabled={cartItem?.quantity <= 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            className="h-8 w-8 rounded-full"
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(cartItem?.salePrice > 0
            ? cartItem.salePrice * cartItem?.quantity
            : cartItem.price * cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="mt-1 cursor-pointer"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
