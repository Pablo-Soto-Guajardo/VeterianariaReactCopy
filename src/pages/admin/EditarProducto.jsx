import { Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import FormularioProducto from "../../components/admin/FormularioProducto";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import { actualizarProducto, obtenerProducto } from "../../data/baseDatos";

function EditarProducto() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const producto = obtenerProducto(codigo);

  if (!producto) {
    return <MensajeVacio titulo={`El producto ${codigo} no existe`} enlace="/admin/productos" textoEnlace="Volver a productos" />;
  }

  function guardar(datos) {
    actualizarProducto(codigo, datos);
    navigate(`/admin/productos/${codigo}`, { state: { mensaje: "Cambios guardados correctamente." } });
  }

  return (
    <>
      <EncabezadoAdmin titulo="Editar producto" subtitulo={`${producto.codigo} · ${producto.nombre}`}>
        <Link to={`/admin/productos/${codigo}`} className="btn btn-outline-secondary">Cancelar</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioProducto inicial={producto} onGuardar={guardar} textoBoton="Guardar cambios" editando />
        </Card.Body>
      </Card>
    </>
  );
}

export default EditarProducto;
