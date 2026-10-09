import { useState } from "react";
import { Button, Container, Dropdown, Form, InputGroup, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { listarCategorias, listarProductos } from "../../data/baseDatos";
import { calcularTotal, contarUnidades, detallarCarrito } from "../../utils/carrito";
import { formatearPrecio } from "../../utils/precio";

const enlaces = [
  { to: "/", texto: "Home" },
  { to: "/productos", texto: "Productos" },
  { to: "/ofertas", texto: "Ofertas" },
  { to: "/nosotros", texto: "Nosotros" },
  { to: "/blogs", texto: "Blog" },
  { to: "/contacto", texto: "Contacto" }
];

function EncabezadoTienda({ carrito, sesion, onCerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const categorias = listarCategorias();
  const items = detallarCarrito(carrito, listarProductos());
  const totalCarrito = calcularTotal(items);
  const unidades = contarUnidades(carrito);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function buscar(evento) {
    evento.preventDefault();
    const texto = busqueda.trim();
    navigate(texto ? `/productos?buscar=${encodeURIComponent(texto)}` : "/productos");
    cerrarMenu();
  }

  function cerrarSesion() {
    onCerrarSesion();
    navigate("/");
  }

  return (
    <header>
      <div className="bg-white border-bottom">
        <Container className="d-flex flex-wrap align-items-center gap-2 py-2">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 me-auto me-md-0 text-decoration-none text-body">
            <img src="/favicon.svg" alt="" width="36" height="36" />
            <span className="fw-bold lh-sm">
              Veterinaria
              <br className="d-sm-none" /> San Marcos
            </span>
          </Link>

          <Form
            role="search"
            className="buscador-tienda order-last order-md-0 mx-md-4"
            onSubmit={buscar}
          >
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar medicamentos, alimentos..."
                aria-label="Buscar productos"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
              <Button type="submit" variant="outline-primary">
                <i className="bi bi-search" aria-hidden="true"></i>
                <span className="visually-hidden">Buscar</span>
              </Button>
            </InputGroup>
          </Form>

          <div className="d-flex gap-2">
            {sesion ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-primary" size="sm" id="menu-cuenta">
                  <i className="bi bi-person-circle me-1" aria-hidden="true"></i>
                  Hola, {sesion.nombre}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText className="small text-body-secondary">
                    {sesion.correo}
                  </Dropdown.ItemText>
                  {sesion.rol === "Administrador" && (
                    <Dropdown.Item as={Link} to="/admin">
                      Panel de administración
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item as="button" onClick={cerrarSesion}>
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login" aria-label="Iniciar sesión">
                  <i className="bi bi-box-arrow-in-right" aria-hidden="true"></i>
                  <span className="d-none d-sm-inline ms-1">Iniciar sesión</span>
                </Link>
                <Link className="btn btn-primary btn-sm" to="/registro" aria-label="Crear cuenta">
                  <i className="bi bi-person-plus" aria-hidden="true"></i>
                  <span className="d-none d-sm-inline ms-1">Crear cuenta</span>
                </Link>
              </>
            )}
          </div>
        </Container>
      </div>

      <Navbar
        expand="lg"
        variant="dark"
        className="barra-tienda py-1"
        style={{ backgroundColor: "var(--sm-verde)" }}
        expanded={menuAbierto}
        onToggle={setMenuAbierto}
      >
        <Container>
          <Navbar.Toggle aria-controls="menu-tienda" label="Abrir o cerrar el menú">
            <i className="bi bi-list" aria-hidden="true"></i>
            <span className="ms-1">Menú</span>
          </Navbar.Toggle>
          <Navbar.Collapse id="menu-tienda" className="order-last order-lg-0">
            <Nav className="mx-lg-auto">
              {enlaces.slice(0, 2).map((enlace) => (
                <NavLink key={enlace.to} className="nav-link" to={enlace.to} end={enlace.to === "/"} onClick={cerrarMenu}>
                  {enlace.texto}
                </NavLink>
              ))}
              <NavDropdown title="Categorías" id="menu-categorias">
                <NavDropdown.Item as={Link} to="/categorias" onClick={cerrarMenu}>
                  Ver todas
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {categorias.map((categoria) => (
                  <NavDropdown.Item
                    key={categoria.id}
                    as={Link}
                    to={`/categorias/${categoria.id}`}
                    onClick={cerrarMenu}
                  >
                    {categoria.nombre}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              {enlaces.slice(2).map((enlace) => (
                <NavLink key={enlace.to} className="nav-link" to={enlace.to} onClick={cerrarMenu}>
                  {enlace.texto}
                </NavLink>
              ))}
            </Nav>
          </Navbar.Collapse>
          <Link
            to="/carrito"
            className="btn btn-light btn-sm fw-semibold ms-auto ms-lg-0"
            aria-label={`Carrito: ${unidades} productos, total ${formatearPrecio(totalCarrito).replace("Gratis", "$0")}`}
            onClick={cerrarMenu}
          >
            <i className="bi bi-cart3 me-1" aria-hidden="true"></i>
            Carrito {totalCarrito === 0 ? "$0" : formatearPrecio(totalCarrito)}
            <span className="badge text-bg-success ms-1">{unidades}</span>
          </Link>
        </Container>
      </Navbar>
    </header>
  );
}

export default EncabezadoTienda;
