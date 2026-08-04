import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import "./style/paymentPage.style.css";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });
  const {cartList, totalPrice} = useSelector(state=>state.cart);
  const {user} = useSelector((state)=>state.user);
  const widgetsRef = useRef(null);
  const {firstName,lastName,contact,address,city,zip} = shipInfo

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
          value: totalPrice,
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
    if(totalPrice > 0) {
      initWidgets();
    }
  },[user?._id, totalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!widgetsRef.current) {
      alert("결제창을 불러오는 중입니다.");
      return;
    }

    if (!cartList?.length) {
      navigate("/cart");
      return;
    }

    const {
      firstName,
      lastName,
      contact,
      address,
      city,
      zip,
    } = shipInfo;

    const orderId = `ORDER_${Date.now()}`;

    const pendingOrder = {
      orderId,
      totalPrice,
      shipTo: { address, city, zip },
      contact: { firstName, lastName, contact },
      orderList: cartList.map((item) => ({
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
          cartList.length > 1
            ? `${cartList[0].productId.name} 외 ${
                cartList.length - 1
              }건`
            : cartList[0].productId.name,
        customerName: `${lastName}${firstName}`,
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
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    placeholder="Apartment, studio, or floor"
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="zip"
                    />
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  <OrderReceipt cartList={cartList} totalPrice={totalPrice}/>
                </div>
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                  <div id="payment-method" />
                  <div id="agreement" className="mt-5" />
                </div>

                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                >
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt cartList={cartList} totalPrice={totalPrice}  />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
