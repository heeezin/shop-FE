import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";
import Alert from "../../common/component/Alert";
import { Spinner } from "react-bootstrap";
import HeroSlider from "./components/HeroSlider";
import ProductColumn from "./components/ProductColumn";


const PAGE_SIZE = 12;

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { productList, loading, totalPageNum } = useSelector((state) => state.product);
  const [query, setQuery] = useSearchParams();
  const name = query.get("name") || "";
  const page = query.get("page") || 1;
  const category = query.get("category") || ""; 
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  useEffect(() => {
    const dontShowAgain = sessionStorage.getItem("dontShowAlert");
    if (dontShowAgain) return;

    if (!location.state?.hasShownAlert && productList && productList.length > 0) {
      const lowStockProducts = productList.filter(product => {
        return product.stock && Object.values(product.stock).some(stock => stock <= 1);
      });

      if (lowStockProducts.length > 0) {
        const groupedMessages = lowStockProducts.reduce((acc, product) => {
          const lowStockDetails = Object.entries(product.stock)
            .filter(([size, stock]) => stock <= 1)
            .map(([size, stock]) => ({
              name: product.name,
              size,
              stock,
            }));

          lowStockDetails.forEach(detail => {
            if (!acc[detail.name]) {
              acc[detail.name] = [];
            }
            acc[detail.name].push(`${detail.size} 사이즈 재고(${detail.stock}개)`);
          });

          return acc;
        }, {});

        const formattedMessage = Object.entries(groupedMessages)
          .map(([name, details]) => `<strong>${name}</strong>: ${details.join(', ')}`)
          .join('<br />');

        setAlertMessage(formattedMessage);
        setShowAlert(true);

        navigate(location.pathname, { state: { hasShownAlert: true } });
      }
    }
  }, [productList, location, navigate]);

  useEffect(() => {
    dispatch(getProductList({ name, page, category, pageSize: PAGE_SIZE }));
  }, [dispatch, query, name, page, category]);

  const handlePageClick = ({ selected }) => {
    setQuery({ name, category, page: selected + 1 });
  };
  const handleDontShowAgain = () => {
    sessionStorage.setItem("dontShowAlert", "true");
    setShowAlert(false);
  };
  const firstColumnProducts = productList?.slice(0, 3) || [];
  const secondColumnProducts = productList?.slice(3, 6) || [];
    console.log(productList)

  return (
    <main className="min-h-screen bg-white text-black">
      
      {!name && !category && (
        <section className="grid border-t border-neutral-200 lg:grid-cols-[1.1fr_1.5fr]">
          <div className="min-w-0 border-b border-neutral-200 lg:border-b-0 lg:border-r">
            <HeroSlider />
          </div>

          <div className="grid min-w-0 md:grid-cols-2">
            <ProductColumn
              title="이번 주 주목할 컬렉션"
              description="새롭게 입고된 인기 상품을 만나보세요."
              image="/image/main2.jpg"
              products={firstColumnProducts}
            />

            <ProductColumn
              title="새로운 라이프스타일"
              description="일상을 새롭게 만들어 줄 아이템을 소개합니다."
              image="/image/main3.jpg"
              products={secondColumnProducts}
            />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-8 flex items-end justify-between border-b-2 border-black pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Shop
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {name
                ? `"${name}" 검색 결과`
                : category
                  ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
                  : "전체"}
            </h1>
          </div>

          {!loading && (
            <span className="text-sm text-neutral-500">
              {productList?.length || 0} items
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : productList?.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-6">
            {productList.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-80 items-center justify-center text-center">
            <h2 className="text-xl font-semibold">
              {name
                ? `"${name}"과 일치하는 상품이 없습니다.`
                : "등록된 상품이 없습니다."}
            </h2>
          </div>
        )}

        {totalPageNum > 1 && (
          <ReactPaginate
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPageNum}
            forcePage={page - 1}
            previousLabel="<"
            renderOnZeroPageCount={null}
            breakLabel="..."
            containerClassName="mt-16 flex list-none items-center justify-center gap-1"
            pageClassName="flex"
            pageLinkClassName="flex h-10 min-w-10 cursor-pointer items-center justify-center px-3 text-sm transition text-gray-500 hover:text-black"
            previousClassName="flex"
            previousLinkClassName="flex text-gray-500 h-10 min-w-10 cursor-pointer items-center justify-center border border-neutral-300 px-3 transition hover:border-black"
            nextClassName="flex "
            nextLinkClassName="flex text-black h-10 min-w-10 cursor-pointer items-center justify-center border border-neutral-300 px-3 transition hover:border-black"
            breakClassName="flex"
            breakLinkClassName="flex h-10 min-w-10 items-center justify-center hover:text-black"
            activeClassName="font-bold text-black"
            disabledClassName="pointer-events-none opacity-30"
            disabledLinkClassName="text-gray-500 cursor-not-allowed"
            activeLinkClassName="font-bold text-black"
          />
        )}
      </section>

      <Alert
        show={showAlert}
        onClose={() => setShowAlert(false)}
        onDontShowAgain={handleDontShowAgain}
        message={alertMessage}
      />
    </main>
  );
};

export default LandingPage;
