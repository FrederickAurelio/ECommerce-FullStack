import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const payerId = searchParams.get("PayerID");

  useEffect(() => {
    if (payerId && paymentId) {
      const getCurrentOrderId = JSON.parse(
        sessionStorage.getItem("currentOrderId"),
      );
      dispatch(
        capturePayment({ payerId, paymentId, orderId: getCurrentOrderId }),
      ).then((data) => {
        console.log(data)
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [payerId, paymentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
