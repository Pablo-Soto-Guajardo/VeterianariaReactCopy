import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import FormularioCategoria from "../../components/admin/FormularioCategoria";
import { crearCategoria } from "../../data/baseDatos";

function NuevaCategoria() {
  const navigate = useNavigate();

  function guardar(datos) {
    const categoria = crearCategoria(datos);
    navigate("/admin/categorias", { state: { mensaje: `Categoría ${categoria.nombre} creada.` } });
  }

  return (
    <>
      <EncabezadoAdmin titulo="Nueva categoría">
        <Link to="/admin/categorias" className="btn btn-outline-secondary">Volver</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioCategoria onGuardar={guardar} textoBoton="Crear categoría" />
        </Card.Body>
      </Card>
    </>
  );
}

export default NuevaCategoria;
