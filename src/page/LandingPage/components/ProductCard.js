import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import '../style/productCard.style.css';
import LikeButton from "../../LikePage/components/LikeButton";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <article className="relative">
      <div className="card" style={{background: "none"}} onClick={() => showProduct(item._id)}>
        <img src={item?.image} alt={item?.image} />
        <div className="flex justify-between px-1">
          <div>
            <div>{item?.name}</div>
            <div>₩ {currencyFormat(item?.price)}</div>
          </div>
          
        </div>
      </div>
      <LikeButton 
        productId={item._id}
        className="text-2xl text-neutral-400 absolute bottom-[43px] right-0 z-10"
      />
    </article>
  );
};

export default ProductCard;
