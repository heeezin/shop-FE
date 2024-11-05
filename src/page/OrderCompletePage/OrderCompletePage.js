import React from "react";
import { Container, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../PaymentPage/style/paymentPage.style.css";

const OrderCompletePage = () => {
  const { orderNum, loading } = useSelector((state) => state.order);
  if (loading) {
    return (
      <Container className="confirmation-page">
        <Spinner animation="border" role="status" className="loading-spinner">
          <span className="sr-only">Loading..</span>
        </Spinner>
      </Container>
    );
  }
  if (orderNum === "")
    return (
      <Container className="confirmation-page">
        <h1>주문 실패</h1>
        <div>
          메인페이지로 돌아가세요
          <Link to={"/"}>메인페이지로 돌아가기</Link>
        </div>
      </Container>
    );
  return (
    <Container className="confirmation-page">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="greenCheck.png"
      />
      <h2>주문이 완료됐습니다!</h2>
      <div>주문번호: {orderNum}</div>
      <div>
        주문 확인은 내 주문 메뉴에서 확인해주세요
        <div className="text-align-center">
          <Link to={"/account/purchase"}>내 주문 바로가기</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
