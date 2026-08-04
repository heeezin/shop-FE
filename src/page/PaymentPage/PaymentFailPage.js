import { Container } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

const PaymentFailPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const message =
    searchParams.get("message") || "결제에 실패했습니다.";

  return (
    <Container className="confirmation-page">
      <h1>결제 실패</h1>
      {code && (
        <p className="text-secondary">
          오류 코드: {code}
        </p>
      )}
      <p>{message}</p>
      <Link to="/payment">다시 결제하기</Link>
    </Container>
  );
};
export default PaymentFailPage;