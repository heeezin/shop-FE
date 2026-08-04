import { useNavigate } from "react-router-dom";
import LikeButton from "../../LikePage/components/LikeButton";

const ProductMiniCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${item._id}`);
  };
  return (
    <article className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="grid w-full grid-cols-[76px_minmax(0,1fr)_28px] items-center gap-3 border-b border-neutral-200 py-4 text-left"
      >
        <img
          src={item.image}
          alt={item.name}
          className="aspect-square w-[76px] bg-neutral-100 object-cover"
        />

        <div className="min-w-0">

          <p className="mt-1 truncate text-sm text-neutral-700">
            {item.name}
          </p>

          <div className="mt-1 flex items-center gap-1 text-sm">
            {item.discountRate > 0 && (
              <span className="font-bold text-orange-600">
                {item.discountRate}%
              </span>
            )}

            <strong>
              {Number(item.price || 0).toLocaleString()}원
            </strong>
          </div>
        </div>
      </button>
      <LikeButton productId={item._id} className="absolute top-[50px] right-0 text-[22px] text-neutral-400"/>
    </article>
  );
};

export default ProductMiniCard;