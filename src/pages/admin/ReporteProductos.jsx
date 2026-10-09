import { Card, ProgressBar, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import { listarCategorias, listarProductos } from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/precio";
import { inventarioPorCategoria } from "../../utils/reportes";

function ReporteProductos() {
  const filas = inventarioPorCategoria(listarProductos(), listarCategorias());
  const totalUnidades = filas.reduce((suma, fila) => suma + fila.unidades, 0);
  const totalValorizado = filas.reduce((suma, fila) => suma + fila.valorizado, 0);

  return (
    <>
      <EncabezadoAdmin titulo="Reporte de productos" subtitulo="Inventario agrupado por categoría">
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver a productos</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive className="align-middle">
            <caption>Unidades y valorización del inventario por categoría</caption>
            <thead>
              <tr>
                <th scope="col">Categoría</th>
                <th scope="col" className="text-center">Productos</th>
                <th scope="col" className="text-center">Unidades</th>
                <th scope="col" style={{ minWidth: "10rem" }}>Participación</th>
                <th scope="col" className="text-center">Críticos</th>
                <th scope="col" className="text-end">Valorizado</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => {
                const porcentaje = totalUnidades === 0 ? 0 : Math.round((fila.unidades / totalUnidades) * 100);
                return (
                  <tr key={fila.id}>
                    <th scope="row">{fila.nombre}</th>
                    <td className="text-center">{fila.productos}</td>
                    <td className="text-center">{fila.unidades}</td>
                    <td>
                      <ProgressBar now={porcentaje} label={`${porcentaje}%`} aria-label={`${fila.nombre}: ${porcentaje}% de las unidades`} />
                    </td>
                    <td className="text-center">{fila.criticos}</td>
                    <td className="text-end">{formatearPrecio(fila.valorizado)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total</th>
                <td></td>
                <td className="text-center fw-bold">{totalUnidades}</td>
                <td></td>
                <td></td>
                <td className="text-end fw-bold">{formatearPrecio(totalValorizado)}</td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}

export default ReporteProductos;
