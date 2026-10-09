import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import FormularioUsuario from "../../components/formularios/FormularioUsuario";
import { crearUsuario } from "../../data/baseDatos";

function NuevoUsuario() {
  const navigate = useNavigate();

  function guardar(datos) {
    const usuario = crearUsuario(datos);
    navigate("/admin/usuarios", { state: { mensaje: `Usuario ${usuario.nombre} ${usuario.apellidos} creado.` } });
  }

  return (
    <>
      <EncabezadoAdmin titulo="Nuevo usuario" subtitulo="Crea cuentas para personal clínico o clientes">
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">Volver</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioUsuario modo="nuevo" onGuardar={guardar} textoBoton="Crear usuario" />
        </Card.Body>
      </Card>
    </>
  );
}

export default NuevoUsuario;
