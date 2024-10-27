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
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUser, getOrderDetails } from "@/store/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector(
    (state) => state.shopOrder,
  );

  useEffect(() => {
    dispatch(getAllOrdersByUser(user?.id));
  }, [dispatch]);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
    setOpenDetailsDialog(true);
  }

  return (
    <Card>
      <CardHeader>Order History</CardHeader>
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
                    className={`font-semibold capitalize ${order.orderStatus === "confirmed" ? "bg-emerald-500" : ""}`}
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
