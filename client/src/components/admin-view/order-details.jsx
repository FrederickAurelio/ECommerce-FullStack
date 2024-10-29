import { useEffect, useState } from "react";
import CommonForm from "../commmon/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "@/store/auth-slice";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "@/store/admin-order-slice";
import { useToast } from "@/hooks/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails, isLoading }) {
  const { searchedUser, searchLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();

  useEffect(() => {
    if (orderDetails?.userId) {
      dispatch(getUserById(orderDetails?.userId));
    }
  }, [orderDetails?.userId]);

  function handleUpdateStatus(e) {
    e.preventDefault();
    const { status: orderStatus } = formData;
    if (orderStatus === "") return null;
    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus })).then(
      (data) => {
        toast({
          title: data.payload.message,
          variant: data.payload.success ? "" : "destructive",
        });
        setFormData(initialFormData);
        dispatch(getAllOrdersForAdmin());
      },
    );
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      {isLoading ? (
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
                {" "}
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
                <span>
                  {searchLoading ? "Laoding..." : searchedUser?.userName}
                </span>
                <span>{orderDetails?.addressInfo.address}</span>
                <span>{orderDetails?.addressInfo.city}</span>
                <span>{orderDetails?.addressInfo.pincode}</span>
                <span>{orderDetails?.addressInfo.phone}</span>
                <span>{orderDetails?.addressInfo.notes}</span>
              </div>
            </div>
          </div>
          <div>
            <CommonForm
              isBtnDisabled={formData.status === ""}
              buttonText="Update Order Status"
              onSubmit={handleUpdateStatus}
              formData={formData}
              setFormData={setFormData}
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                  ],
                },
              ]}
            />
          </div>
        </div>
      )}
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
