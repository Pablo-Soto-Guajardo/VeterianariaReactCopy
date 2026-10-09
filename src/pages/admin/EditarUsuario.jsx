import { Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import FormularioUsuario from "../../components/formularios/FormularioUsuario";
import { actualizarUsuario, obtenerUsuario } from "../../data/baseDatos";

function EditarUsuario({ sesion, onActualizarSesion }) {
  const { run } = useParams();
  const navigate = useNavigate();
  const usuario = obtenerUsuario(run);

  if (!usuario) {
    return <MensajeVacio titulo="El usuario no existe" enlace="/admin/usuarios" textoEnlace="Volver a usuarios" />;
  }

  function guardar(datos) {
    const actualizado = actualizarUsuario(run, datos);
    if (sesion.run === run) onActualizarSesion(actualizado);
    navigate(`/admin/usuarios/${run}`, { state: { mensaje: "Usuario actualizado." } });
  }

  return (
    <>
      <EncabezadoAdmin titulo="Editar usuario" subtitulo={`${usuario.nombre} ${usuario.apellidos}`}>
        <Link to={`/admin/usuarios/${run}`} className="btn btn-outline-secondary">Cancelar</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioUsuario modo="editar" inicial={usuario} onGuardar={guardar} textoBoton="Guardar cambios" />
        </Card.Body>
      </Card>
    </>
  );
}

export default EditarUsuario;
