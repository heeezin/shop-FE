import React, { useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import {
  updateQty,
  deleteCartItem,
  getCartList,
} from "../../../features/cart/cartSlice";
import useConfirm from "../../../utils/useConfirm";
import Confirm from "../../../common/component/Confirm";

const CartProductCard = ({ item }) => {
  const { show, message, openConfirm, handleConfirm, closeConfirm } = useConfirm();

  const dispatch = useDispatch();

  const handleQtyChange = (id, size, value) => {
    dispatch(updateQty({ id, size, qty: value }));
  };

  const deleteCart = (productId, size) => {
    openConfirm(()=>{
      dispatch(deleteCartItem({ id: productId, size }));
    },"삭제 하시겠습니까?")
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={2} xs={12}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>
        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button
              className="trash-button"
              onClick={() => deleteCart(item.productId._id, item.size)}
            >
              <FontAwesomeIcon icon={faTrash} width={24} />
            </button>
            <Confirm
                  show={show}
                  onConfirm={handleConfirm}
                  onCancel={closeConfirm}
                  message={message}
                />
          </div>

          <div>
            <strong>₩ {currencyFormat(item.productId.price)}</strong>
          </div>
          <div>Size: {item.size}</div>
          <div>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</div>
          <div>
            Quantity:
            <Form.Select
              onChange={(event) =>
                handleQtyChange(
                  item.productId._id,
                  item.size,
                  event.target.value
                )
              }
              required
              defaultValue={item.qty}
              className="qty-dropdown"
            >
              {[...Array(10).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Form.Select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
