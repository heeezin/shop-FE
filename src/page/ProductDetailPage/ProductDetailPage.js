import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import LikeButton from "../LikePage/components/LikeButton";
import useConfirm from "../../utils/useConfirm";
import { showToastMessage } from "../../features/common/uiSlice";
import Confirm from "../../common/component/Confirm";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const [size, setSize] = useState("");
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const user = useSelector((state) => state.user.user);
  const { show, message, openConfirm, handleConfirm, closeConfirm } = useConfirm();
  const navigate = useNavigate();

  const addItemToCart = async () => {
    if(size==='') {
      setSizeError(true)
      return
    } 
    if(!user) {
      navigate('/login')
      return
    }
    const result = await dispatch(addToCart({ id, size }));

    if (addToCart.fulfilled.match(result)) {
      openConfirm(
        () => navigate("/cart"),
        "장바구니에 담았습니다. 장바구니로 이동하시겠습니까?"
      );
      return;
    }
  };
  const selectSize = (value) => {
    if(sizeError) setSizeError(false)
    setSize(value)
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  if (loading || !selectedProduct)
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  return (
    <Container className="product-detail-card" style={{paddingBottom: "30px"}}>
      <Row>
        <Col sm={6}>
          <img src={selectedProduct.image} className="w-100" alt="image" />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="flex justify-between items-center">
            <div className="product-info">{selectedProduct.name}</div>
            <LikeButton productId={selectedProduct._id}/>
          </div>
          <div className="product-info">
            ₩ {currencyFormat(selectedProduct.price)}
          </div>
          <div className="product-info">{selectedProduct.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            title={size}
            align="start"
            onSelect={(value) => selectSize(value)}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              align="start"
            >
              {size === "" ? "사이즈 선택" : size.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu className="size-drop-down">
              {Object.keys(selectedProduct.stock).length > 0 &&
                Object.keys(selectedProduct.stock).map((item, index) =>
                  selectedProduct.stock[item] > 0 ? (
                    <Dropdown.Item eventKey={item} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item eventKey={item} disabled={true} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  )
                )}
            </Dropdown.Menu>
          </Dropdown>
          <div className="warning-message">
            {sizeError && "사이즈를 선택해주세요."}
          </div>
          <Button variant="dark" className="add-button" onClick={addItemToCart}>
            추가
          </Button>
        </Col>
      </Row>
      <Confirm
        show={show}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
        message={message}
      />
    </Container>
  );
};

export default ProductDetail;
