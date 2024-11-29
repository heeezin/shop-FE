import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";
import Alert from "../../common/component/Alert";

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
  console.log('category',category)
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
    console.log("Fetching products with params:", { name, page, category, pageSize: PAGE_SIZE });

  }, [dispatch, query, name, page, category]);

  const handlePageClick = ({ selected }) => {
    setQuery({ name, category, page: selected + 1 });
  };
  const handleDontShowAgain = () => {
    sessionStorage.setItem("dontShowAlert", "true");
    setShowAlert(false);
  };

  return (
    <Container>
      <Row>
        {loading ? (
          <div className="text-align-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading..</span>
            </Spinner>
          </div>
        ) : productList && productList.length > 0 ? (
          productList.map((item) => (
            <Col md={4} sm={12} key={item._id} className="productCard">
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPageNum}
        forcePage={page - 1}
        previousLabel="<"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        className="display-center list-style-none"
      />
      <Alert
        show={showAlert}
        onClose={() => setShowAlert(false)}
        onDontShowAgain={handleDontShowAgain}
        message={alertMessage}
      />
    </Container>
  );
};

export default LandingPage;
