import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import '../style/productCard.style.css';

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <div className="card" style={{background: "none"}} onClick={() => showProduct(item._id)}>
      <img src={item?.image} alt={item?.image} />
      <div>{item?.name}</div>
      <div>₩ {currencyFormat(item?.price)}</div>
    </div>
  );
};

export default ProductCard;
