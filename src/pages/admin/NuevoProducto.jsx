import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import FormularioProducto from "../../components/admin/FormularioProducto";
import { crearProducto } from "../../data/baseDatos";

function NuevoProducto() {
  const navigate = useNavigate();

  function guardar(datos) {
    const producto = crearProducto(datos);
    navigate("/admin/productos", { state: { mensaje: `Producto ${producto.nombre} creado correctamente.` } });
  }

  return (
    <>
      <EncabezadoAdmin titulo="Nuevo producto" subtitulo="Registra un producto en el inventario">
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioProducto onGuardar={guardar} textoBoton="Crear producto" />
        </Card.Body>
      </Card>
    </>
  );
}

export default NuevoProducto;
