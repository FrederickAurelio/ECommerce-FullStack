import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems }) {
  const totalPriceAmount = cartItems.reduce(
    (acc, item) => acc + (item?.salePrice || item?.price) * item?.quantity,
    0,
  );
  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => <UserCartItemsContent cartItem={item} />)
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalPriceAmount}</span>
        </div>
      </div>
      <Button className="mt-5 w-full">Checkout</Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
