import { Table } from "react-bootstrap";
import { formatearPrecio } from "../../utils/precio";
import ImagenConRespaldo from "../comunes/ImagenConRespaldo";

// Tabla de productos de una compra. Se reutiliza en checkout, boleta y resultados de pago.
function TablaItemsCompra({ items, total, etiquetaTotal = "Total" }) {
  return (
    <Table responsive className="align-middle bg-white mb-0">
      <caption className="visually-hidden">Detalle de productos de la compra</caption>
      <thead className="table-light">
        <tr>
          <th scope="col">Imagen</th>
          <th scope="col">Nombre</th>
          <th scope="col" className="text-end">Precio</th>
          <th scope="col" className="text-center">Cantidad</th>
          <th scope="col" className="text-end">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.codigo}>
            <td>
              <ImagenConRespaldo src={item.imagen} alt="" className="imagen-miniatura" />
            </td>
            <th scope="row" className="fw-normal">{item.nombre}</th>
            <td className="text-end">{formatearPrecio(item.precioUnitario)}</td>
            <td className="text-center">{item.cantidad}</td>
            <td className="text-end">{formatearPrecio(item.precioUnitario * item.cantidad)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" colSpan={4} className="text-end">{etiquetaTotal}</th>
          <td className="text-end fw-bold">{total === 0 ? "$0" : formatearPrecio(total)}</td>
        </tr>
      </tfoot>
    </Table>
  );
}

export default TablaItemsCompra;
