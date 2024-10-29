import { useDispatch, useSelector } from "react-redux";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { continuePayment } from "@/store/order-slice";

function ShoppingOrderDetailsView({ isLoading, orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const { approvalURL, isLoading: isLoadingPayment } = useSelector(
    (state) => state.shopOrder,
  );

  function handleContinuePayment(getOrderDetails) {
    dispatch(continuePayment(getOrderDetails)).then((data) => {
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
    <DialogContent className="sm:max-w-[600px]">
      {isLoading && !isLoadingPayment ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="mt-6 flex items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>
                {new Date(orderDetails?.orderDate).toLocaleDateString("en-GB")}
              </Label>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-medium">Order Price</p>
              <Label>${orderDetails?.totalAmount}</Label>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-medium">Payment Method</p>
              <Label className="capitalize">
                {orderDetails?.paymentMethod}
              </Label>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label className="capitalize">
                <Badge
                  className={`font-semibold capitalize ${orderDetails?.paymentStatus === "paid" ? "bg-emerald-500" : ""}`}
                >
                  {orderDetails?.paymentStatus}
                </Badge>
              </Label>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-medium">Order Status</p>
              <Label className="capitalize">
                {" "}
                <Badge
                  className={`font-semibold capitalize ${
                    orderDetails?.orderStatus === "confirmed"
                      ? "bg-emerald-500"
                      : orderDetails?.orderStatus === "rejected"
                        ? "bg-rose-500"
                        : ""
                  }`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </Label>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Order Details</div>
              <ul className="grid gap-3">
                {orderDetails?.cartItems.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {item.quantity}x {item.title}
                    </span>
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Shipping Info</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <span>{user?.userName}</span>
                <span>{orderDetails?.addressInfo.address}</span>
                <span>{orderDetails?.addressInfo.city}</span>
                <span>{orderDetails?.addressInfo.pincode}</span>
                <span>{orderDetails?.addressInfo.phone}</span>
                <span>{orderDetails?.addressInfo.notes}</span>
              </div>
            </div>
          </div>
          {orderDetails?.paymentStatus !== "paid" ? (
            <Button
              className="w-full disabled:cursor-not-allowed"
              disabled={isLoadingPayment || approvalURL}
              onClick={() => handleContinuePayment(orderDetails)}
            >
              Continue Paying
            </Button>
          ) : (
            ""
          )}
        </div>
      )}
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
