import img from "@/assets/account.jpg";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.cartProductReducer);
  const cart = cartItems?.items || [];
  const totalPriceAmount = cart.reduce(
    (acc, item) => acc + (item?.salePrice || item?.price) * item?.quantity,
    0,
  );
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        <Address />
        <div className="flex flex-col gap-4">
          {cartItems && cart && cart.length > 0
            ? cart.map((cartItem) => (
                <UserCartItemsContent
                  key={cartItem.productId}
                  cartItem={cartItem}
                />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalPriceAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button className="w-full">Checkout with Paypal</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
