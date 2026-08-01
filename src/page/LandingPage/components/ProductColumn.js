import ProductMiniCard from "./ProductMiniCard";

const ProductColumn = ({
    title,
    description,
    image,
    products = [],
}) => {
    return (
        <article className="min-w-0 border-b border-neutral-200 p-5 md:border-b-0 md:border-r md:p-7 lg:p-8 last:border-r-0">
        <div className="overflow-hidden bg-neutral-100">
            <img
            src={image}
            alt={title}
            className="aspect-[3/2] w-full object-cover transition duration-500 hover:scale-[1.02]"
            />
        </div>

        <div className="border-b border-neutral-200 py-4">
            <h2 className="text-xl font-bold tracking-tight lg:text-2xl">
            {title}
            </h2>

            <p className="text-sm leading-6 text-neutral-600">
            {description}
            </p>
        </div>

        <div>
            {products.map((item) => (
            <ProductMiniCard key={item._id} item={item} />
            ))}
        </div>
        </article>
    );
};

export default ProductColumn;