import React, { useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/user/userSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
  return (
    <div>
      <Link to="/">
        <img width={100} src="/image/29cm.png" alt="29cm" />
      </Link>

      <div className="mt-8 border-b pb-4 flex items-center justify-between">

        <strong className="block">
          {user?.name || "관리자"}
        </strong>

        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="text-sm underline"
        >
          로그아웃
        </button>
      </div>

      <ul className="sidebar-area">
        <li
          className="sidebar-item"
          onClick={() =>
            handleSelectMenu("/admin/product?page=1")
          }
        >
          상품 관리
        </li>

        <li
          className="sidebar-item"
          onClick={() =>
            handleSelectMenu("/admin/order?page=1")
          }
        >
          주문 관리
        </li>
      </ul>
    </div>
  );
};
  return (
    <>
      <div className="sidebar-toggle">{NavbarContent()}</div>

      <Navbar bg="light" expand={false} className="mobile-sidebar-toggle">
        <Container fluid>
          <Link to="/">
            <img width={80} src="/image/29cm.png" alt="29cm" />
          </Link>
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand`}
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="start"
            className="sidebar"
            show={show}
            onHide={() => setShow(false)}
          >
            <Offcanvas.Header closeButton onClick={()=>setShow(false)}></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
