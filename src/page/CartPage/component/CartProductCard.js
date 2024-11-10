import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import {
  updateQty,
  deleteCartItem,
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
    openConfirm(() => {
      dispatch(deleteCartItem({ id: productId, size }));
    }, "삭제 하시겠습니까?");
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={4} xs={12}>
          {item.productId.image ? (
            <img src={item.productId.image} width="100%" alt="product" />
          ) : (
            <div style={{ width: "100%", height: "200px", backgroundColor: "#f0f0f0" }}>
            </div>
          )}
        </Col>
        <Col md={8} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name || " "}</h3>
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
            <strong>₩ {currencyFormat(item.productId.price || 0)}</strong>
          </div>
          <div>Size: {item.size || " "}</div>
          <div>Total: ₩ {currencyFormat((item.productId.price || 0) * (item.qty || 1))}</div>
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
              defaultValue={item.qty || 1}
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
