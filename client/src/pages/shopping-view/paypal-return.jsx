import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const payerId = searchParams.get("PayerID");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (payerId && paymentId && !loading) {
      const getCurrentOrderId = JSON.parse(
        sessionStorage.getItem("currentOrderId"),
      );

      setLoading(true);

      dispatch(
        capturePayment({ payerId, paymentId, orderId: getCurrentOrderId }),
      )
        .then((data) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            window.location.href = "/shop/payment-success";
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
