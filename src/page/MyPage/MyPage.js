import React from "react";
import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (orderList?.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }
  return (
    <>
      {loading ? 
        <div className="text-align-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading..</span>
          </Spinner>
        </div> : <Container className="status-card-container">
        {orderList.map((item) => (
          <OrderStatusCard
            orderItem={item}
            className="status-card-container"
            key={item._id}
          />
        ))}
      </Container>}
    </>
  );
};

export default MyPage;
