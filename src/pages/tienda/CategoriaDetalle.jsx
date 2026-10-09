import { Container, Nav } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import GrillaProductos from "../../components/productos/GrillaProductos";
import { listarCategorias, listarProductosPorCategoria, obtenerCategoria } from "../../data/baseDatos";

function CategoriaDetalle({ onAgregar }) {
  const { id } = useParams();
  const categoria = obtenerCategoria(id);
  const categorias = listarCategorias();

  if (!categoria) {
    return (
      <Container className="py-5">
        <h1 className="visually-hidden">Categoría no encontrada</h1>
        <MensajeVacio
          icono="bi-tags"
          titulo="La categoría solicitada no existe"
          enlace="/categorias"
          textoEnlace="Ver categorías"
        />
      </Container>
    );
  }

  const productos = listarProductosPorCategoria(id);

  return (
    <Container className="py-4">
      <Nav variant="pills" className="flex-nowrap overflow-auto gap-2 pb-2 mb-4" aria-label="Categorías">
        {categorias.map((item) => (
          <Nav.Item key={item.id}>
            <NavLink to={`/categorias/${item.id}`} className="nav-link text-nowrap border">
              {item.nombre}
            </NavLink>
          </Nav.Item>
        ))}
      </Nav>
      <h1>{categoria.nombre}</h1>
      <p className="text-body-secondary">{categoria.descripcion}</p>
      {productos.length === 0 ? (
        <MensajeVacio titulo="Todavía no hay productos en esta categoría" enlace="/productos" textoEnlace="Ver catálogo" />
      ) : (
        <GrillaProductos productos={productos} onAgregar={onAgregar} />
      )}
    </Container>
  );
}

export default CategoriaDetalle;
