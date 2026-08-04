import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const OrderCompletePage = () => {
  const location = useLocation();
  const reduxOrderNum = useSelector(
    (state) => state.order.orderNum
  );

  const orderNum =
    location.state?.orderNum || reduxOrderNum;

  if (!orderNum) {
    return (
      <Container className="confirmation-page">
        <h1>주문 정보를 찾을 수 없습니다.</h1>
        <Link to="/">메인페이지로 돌아가기</Link>
      </Container>
    );
  }

  return (
    <Container className="confirmation-page">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="주문 완료"
      />

      <h2>주문이 완료됐습니다!</h2>
      <div>주문번호: {orderNum}</div>

      <div>
        <div className="text-align-center py-4">
          <Link to="/account/purchase" className="text-gray-600">
            내 주문 바로가기
          </Link>
        </div>
      </div>
    </Container>
  );
};
export default OrderCompletePage;