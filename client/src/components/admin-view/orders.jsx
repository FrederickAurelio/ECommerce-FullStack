import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "@/store/admin-order-slice";
import AdminOrderRows from "./order-rows";

function AdminOrders() {
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.adminOrder);

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
              <AdminOrderRows order={order} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrders;
