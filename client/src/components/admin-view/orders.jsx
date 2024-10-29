import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
} from "@/store/admin-order-slice";
import { Badge } from "../ui/badge";
import { DialogTitle } from "@radix-ui/react-dialog";

function AdminOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderDetails, orderList, isLoading } = useSelector(
    (state) => state.adminOrder,
  );
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getOrderId) {
    dispatch(getOrderDetailsForAdmin(getOrderId));
    setOpenDetailsDialog(true);
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, []);

  return (
    <Card>
      <CardHeader>All Orders</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.map((order) => (
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
                  <Dialog
                    open={openDetailsDialog}
                    onOpenChange={setOpenDetailsDialog}
                  >
                    <DialogTitle />
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrders;
