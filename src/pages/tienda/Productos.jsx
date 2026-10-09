import { Col, Container, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import GrillaProductos from "../../components/productos/GrillaProductos";
import { listarCategorias, listarProductos } from "../../data/baseDatos";
import { filtrarProductos, ordenarProductos } from "../../utils/filtros";

// Catálogo con búsqueda, filtro por categoría, solo disponibles y orden.
// Los filtros se guardan en la URL (?buscar=...&categoria=...) para poder compartir la búsqueda.
function Productos({ onAgregar }) {
  const [parametros, setParametros] = useSearchParams();
  const texto = parametros.get("buscar") || "";
  const categoria = parametros.get("categoria") || "";
  const orden = parametros.get("orden") || "";
  const soloDisponibles = parametros.get("disponibles") === "1";

  const categorias = listarCategorias();
  const filtrados = filtrarProductos(listarProductos(), { texto, categoria, soloDisponibles });
  const visibles = ordenarProductos(filtrados, orden);

  function actualizarFiltro(nombre, valor) {
    const nuevos = new URLSearchParams(parametros);
    if (valor) {
      nuevos.set(nombre, valor);
    } else {
      nuevos.delete(nombre);
    }
    setParametros(nuevos, { replace: true });
  }

  return (
    <Container className="py-4">
      <h1>Productos</h1>
      <p className="text-body-secondary">Medicamentos, alimentos clínicos y productos de cuidado para tu mascota.</p>

      <Form className="bg-white border rounded-3 p-3 mb-4" role="search" onSubmit={(evento) => evento.preventDefault()}>
        <Row className="g-3 align-items-end">
          <Col xs={12} lg={4}>
            <Form.Group controlId="filtro-texto">
              <Form.Label>Buscar</Form.Label>
              <Form.Control
                type="search"
                placeholder="Nombre, código o descripción"
                value={texto}
                onChange={(evento) => actualizarFiltro("buscar", evento.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Form.Group controlId="filtro-categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={categoria} onChange={(evento) => actualizarFiltro("categoria", evento.target.value)}>
                <option value="">Todas</option>
                {categorias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Form.Group controlId="filtro-orden">
              <Form.Label>Ordenar por</Form.Label>
              <Form.Select value={orden} onChange={(evento) => actualizarFiltro("orden", evento.target.value)}>
                <option value="">Relevancia</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre (A-Z)</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} lg={2}>
            <Form.Check
              type="switch"
              id="filtro-disponibles"
              label="Solo con stock"
              checked={soloDisponibles}
              onChange={(evento) => actualizarFiltro("disponibles", evento.target.checked ? "1" : "")}
            />
          </Col>
        </Row>
      </Form>

      <p className="text-body-secondary" role="status">
        {visibles.length} {visibles.length === 1 ? "producto encontrado" : "productos encontrados"}
      </p>

      {visibles.length === 0 ? (
        <MensajeVacio
          icono="bi-search"
          titulo="No encontramos productos"
          texto="Prueba con otra palabra o quita algún filtro."
        />
      ) : (
        <GrillaProductos productos={visibles} onAgregar={onAgregar} />
      )}
    </Container>
  );
}

export default Productos;
