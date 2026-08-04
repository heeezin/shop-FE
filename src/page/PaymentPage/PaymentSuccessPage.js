import { useEffect, useRef } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../../utils/api";
import { createOrder } from "../../features/order/orderSlice";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // React StrictMode에서 승인 요청이 두 번 실행되는 것 방지
  const isConfirmingRef = useRef(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (isConfirmingRef.current) return;
      isConfirmingRef.current = true;

      try {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = Number(searchParams.get("amount"));

        const pendingOrderString =
          sessionStorage.getItem("pendingOrder");

        if (
          !paymentKey ||
          !orderId ||
          !amount ||
          !pendingOrderString
        ) {
          throw new Error("결제 또는 주문 정보가 없습니다.");
        }

        const pendingOrder = JSON.parse(pendingOrderString);

        if (pendingOrder.orderId !== orderId) {
          throw new Error("주문번호가 일치하지 않습니다.");
        }

        if (Number(pendingOrder.totalPrice) !== amount) {
          throw new Error("결제 금액이 일치하지 않습니다.");
        }

        const res = await api.post(
          "/payment/confirm",
          {
            paymentKey,
            orderId,
            amount,
          }
        );
        

        if (res.data.status !== "success") {
          throw new Error("결제 승인에 실패했습니다.");
        }
        console.log(res.data, '결제정보')
        const payment = res.data.data;
        
        const orderResult = await dispatch(
          createOrder({
            ...pendingOrder,
            payment: {
              paymentKey: payment.paymentKey,
              method: payment.method,
              status: payment.status,
              totalAmount: payment.totalAmount,
              approvedAt: payment.approvedAt,
            },
          })
        );

        if (!createOrder.fulfilled.match(orderResult)) {
          throw new Error("주문 생성에 실패했습니다.");
        }

        sessionStorage.removeItem("pendingOrder");

        navigate("/order/complete", {
          replace: true,
          state: {
            orderNum: orderResult.payload.orderNum,
          },
        });
      } catch (error) {
        console.error("결제 처리 실패:", error);

        navigate(
          `/payment/fail?message=${encodeURIComponent(
            error.message
          )}`,
          { replace: true }
        );
      }
    };

    confirmPayment();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      결제를 확인하고 있습니다.
    </div>
  );
};

export default PaymentSuccessPage;