import { Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import { listarProductosCriticos } from "../../data/baseDatos";

function ProductosCriticos() {
  // Primero los agotados y luego los que tienen menos stock.
  const criticos = listarProductosCriticos().sort((a, b) => a.stock - b.stock);

  return (
    <>
      <EncabezadoAdmin titulo="Productos críticos" subtitulo="Productos con stock igual o menor a su stock crítico">
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver a productos</Link>
      </EncabezadoAdmin>
      {criticos.length === 0 ? (
        <MensajeVacio icono="bi-check2-circle" titulo="No hay productos en estado crítico" />
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive className="align-middle mb-0">
              <caption>Listado de productos que requieren reposición</caption>
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Nombre</th>
                  <th scope="col" className="text-center">Stock</th>
                  <th scope="col" className="text-center">Stock crítico</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((producto) => (
                  <tr key={producto.codigo}>
                    <th scope="row">{producto.codigo}</th>
                    <td>{producto.nombre}</td>
                    <td className="text-center">{producto.stock}</td>
                    <td className="text-center">{producto.stockCritico}</td>
                    <td>
                      {producto.stock === 0 ? (
                        <span className="badge text-bg-danger">Agotado</span>
                      ) : (
                        <span className="badge text-bg-warning">Crítico</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/admin/productos/${producto.codigo}/editar`} className="btn btn-sm btn-outline-primary">
                        Reponer stock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default ProductosCriticos;
