import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, resetShopOrderDetails } from "@/store/order-slice";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { TableCell, TableRow } from "../ui/table";

function OrderRows({ order }) {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const { orderDetails, isLoading } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
    setOpenDetailsDialog(true);
  }

  function handleCloseDialog() {
    setOpenDetailsDialog(false);
    dispatch(resetShopOrderDetails());
  }

  return (
    <TableRow key={order?._id}>
      <TableCell>{order?._id}</TableCell>
      <TableCell>
        {" "}
        {new Date(order.orderDate).toLocaleDateString("en-GB")}
      </TableCell>
      <TableCell>
        <Badge
          className={`font-semibold capitalize ${
            order.orderStatus === "confirmed"
              ? "bg-emerald-500"
              : order.orderStatus === "rejected"
                ? "bg-rose-500"
                : ""
          }`}
        >
          {order.orderStatus}
        </Badge>
      </TableCell>
      <TableCell>${order.totalAmount}</TableCell>
      <TableCell>
        <Dialog open={openDetailsDialog} onOpenChange={handleCloseDialog}>
          <Button onClick={() => handleFetchOrderDetails(order?._id)}>
            View Details
          </Button>
          <ShoppingOrderDetailsView
            isLoading={isLoading}
            orderDetails={orderDetails}
          />
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

export default OrderRows;
