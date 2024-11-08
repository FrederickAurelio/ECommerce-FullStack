import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetailsForAdmin,
  resetAdminOrderDetails,
} from "@/store/admin-order-slice";
import { TableCell, TableRow } from "../ui/table";
import { Dialog } from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import AdminOrderDetailsView from "./order-details";

function AdminOrderRows({ order }) {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const { orderDetails, isLoading } = useSelector((state) => state.adminOrder);

  function handleFetchOrderDetails(getOrderId) {
    dispatch(getOrderDetailsForAdmin(getOrderId));
    setOpenDetailsDialog(true);
  }

  function handleCloseDialog() {
    setOpenDetailsDialog(false);
    dispatch(resetAdminOrderDetails());
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
          <AdminOrderDetailsView
            orderDetails={orderDetails}
            isLoading={isLoading}
          />
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

export default AdminOrderRows;
