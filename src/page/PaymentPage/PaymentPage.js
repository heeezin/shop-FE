import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import "./style/paymentPage.style.css";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [shipInfo, setShipInfo] = useState({
    name: "",
    contact: "",
    address: "",
    detailAddress: "",
    zip: "",
  });
  const {cartList, totalPrice} = useSelector(state=>state.cart);
  const {user} = useSelector((state)=>state.user);
  const widgetsRef = useRef(null);
  const {name,contact,address,detailAddress,zip} = shipInfo;
  const location = useLocation();
  const isBuyNow = location.state?.buyNow;
  const paymentItem = isBuyNow ? [location.state.item]:cartList;
  const paymentTotalPrice = paymentItem.reduce(
  (total, item) =>
    total + Number(item.productId.price) * Number(item.qty),
  0
);


  useEffect(()=>{
    const initWidgets = async () =>{
      try {
        const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({
            customerKey: user?._id || ANONYMOUS,
        });
        widgetsRef.current = widgets;
        await widgets.setAmount({
          currency: "KRW",
          value: paymentTotalPrice,
        });
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);
      } catch (error) {
        console.error("결제위젯초기화실패",error)
      }
      
    };
    if(paymentTotalPrice > 0) {
      initWidgets();
    }
  },[user?._id, paymentTotalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!widgetsRef.current) {
      alert("결제창을 불러오는 중입니다.");
      return;
    }

    if (!paymentItem?.length) {
      navigate(isBuyNow ? "/" : "/cart");
      return;
    }

    const {
      name,
      contact,
      address,
      detailAddress,
      zip,
    } = shipInfo;

    const orderId = `ORDER_${Date.now()}`;

    const pendingOrder = {
      orderId,
      totalPrice: paymentTotalPrice,
      shipTo: { address, detailAddress, zip },
      contact: { name, contact },
      orderList: paymentItem.map((item) => ({
        productId: item.productId._id,
        price: item.productId.price,
        qty: item.qty,
        size: item.size,
      })),
    };

    sessionStorage.setItem(
      "pendingOrder",
      JSON.stringify(pendingOrder)
    );

    try {
      await widgetsRef.current.requestPayment({
        orderId,
        orderName:
          paymentItem.length > 1
            ? `${paymentItem[0].productId.name} 외 ${
                paymentItem.length - 1
              }건`
            : paymentItem[0].productId.name,
        customerName: `${name}`,
        customerEmail: user?.email,
        customerMobilePhone: contact.replaceAll("-", ""),
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    }
  };
  
  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const {name,value} = event.target
    setShipInfo({...shipInfo,[name]:value})
  };

  return (
    <Container className="py-10">
      <Form onSubmit={handleSubmit}>
        <Row className="g-5">
          {/* 왼쪽 */}
          <Col lg={7}>
            <section>
              <h2 className="mb-4 text-3xl font-bold">배송 주소</h2>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="name">
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleFormChange}
                    required
                    name="name"
                  />
                </Form.Group>
              </Row>

              <Form.Group className="mb-3" controlId="contact">
                <Form.Label>연락처</Form.Label>
                <Form.Control
                  placeholder="010-xxxx-xxxx"
                  onChange={handleFormChange}
                  required
                  name="contact"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>주소</Form.Label>
                <Form.Control
                  placeholder="주소를 입력해주세요"
                  onChange={handleFormChange}
                  required
                  name="address"
                />
              </Form.Group>

              <Row className="mb-5">
                <Form.Group as={Col} controlId="detailAddress">
                  <Form.Label>상세주소</Form.Label>
                  <Form.Control
                    onChange={handleFormChange}
                    required
                    name="detailAddress"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="zip">
                  <Form.Label>우편번호</Form.Label>
                  <Form.Control
                    onChange={handleFormChange}
                    required
                    name="zip"
                  />
                </Form.Group>
              </Row>
            </section>

            {/* 모바일에서만 주문내역 */}
            <div className="d-lg-none mb-5">
              <OrderReceipt
                cartList={paymentItem}
                totalPrice={paymentTotalPrice}
              />
            </div>

            <section>
              <h2 className="mb-4 text-3xl font-bold">결제 정보</h2>

              <div id="payment-method" />
              <div id="agreement" className="mt-5" />

              <Button
                variant="dark"
                className="mt-6 w-100 py-3"
                type="submit"
              >
                {Number(paymentTotalPrice).toLocaleString()}원 결제하기
              </Button>
            </section>
          </Col>

          {/* 데스크톱에서만 주문내역 */}
          <Col lg={5} className="d-none d-lg-block">
            <div className="sticky-top" style={{ top: "110px" }}>
              <OrderReceipt
                cartList={paymentItem}
                totalPrice={paymentTotalPrice}
              />
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default PaymentPage;
