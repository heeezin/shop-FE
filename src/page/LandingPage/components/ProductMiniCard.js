import { useNavigate } from "react-router-dom";

const ProductMiniCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${item._id}`);
  };
  const handleLick = (e) => {
    e.stopPropagation();
  }
  return (
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

      <button
        onClick={handleLick}
        aria-hidden="true"
        className="text-2xl font-light text-neutral-400"
      >
        ♡
      </button>
    </button>
  );
};

export default ProductMiniCard;