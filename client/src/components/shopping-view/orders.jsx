import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import OrderRows from "./order-rows";
import { useEffect } from "react";
import { getAllOrdersByUser } from "@/store/order-slice";

function ShoppingOrders() {
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.shopOrder);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllOrdersByUser(user?.id));
  }, [dispatch]);
  
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
              <OrderRows order={order} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
