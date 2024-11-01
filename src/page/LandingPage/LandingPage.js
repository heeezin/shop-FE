import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";

const PAGE_SIZE = 12;

const LandingPage = () => {
  const dispatch = useDispatch();

  const {productList,loading,totalPageNum} = useSelector((state) => state.product);
  const [query,setQuery] = useSearchParams();
  const name = query.get("name") || "";
  const page = query.get("page") || 1;
  console.log(page)

  useEffect(() => {
    dispatch(
      getProductList({ name, page, pageSize: PAGE_SIZE })
    );
  }, [query]);
  const handlePageClick = ({ selected }) => {
    setQuery({ name, page: selected + 1 });
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
            <Col md={3} sm={12} key={item._id}>
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
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPageNum} 
        forcePage={page - 1} 
        previousLabel="< previous"
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
    </Container>
    
  );
};

export default LandingPage;
