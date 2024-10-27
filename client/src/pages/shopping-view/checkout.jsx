import img from "@/assets/account.jpg";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { createNewOrder } from "@/store/order-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.cartProductReducer);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL, isLoading } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const cart = cartItems?.items || [];
  const totalPriceAmount = cart.reduce(
    (acc, item) => acc + (item?.salePrice || item?.price) * item?.quantity,
    0,
  );

  function handleInitiatePaypalPayment() {
    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed",
        variant: "destructive",
      });
      return null;
    }

    if (cart.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return null;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        imageUrl: singleCartItem?.imageUrl,
        price: singleCartItem?.salePrice || singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalPriceAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  useEffect(() => {
    if (approvalURL && isPaymentStart) {
      window.location.href = approvalURL;
    }
  }, [approvalURL, isPaymentStart]);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        <Address
          currentSelectedAddress={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
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
            <Button
              disabled={isLoading || approvalURL}
              onClick={handleInitiatePaypalPayment}
              className="w-full disabled:cursor-not-allowed"
            >
              Checkout with Paypal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
