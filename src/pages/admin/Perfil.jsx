import { useState } from "react";
import { Alert, Card } from "react-bootstrap";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import FormularioUsuario from "../../components/formularios/FormularioUsuario";
import { actualizarUsuario, obtenerUsuario } from "../../data/baseDatos";

function Perfil({ sesion, onActualizarSesion }) {
  const [guardado, setGuardado] = useState(false);
  const usuario = obtenerUsuario(sesion.run) || sesion;

  function guardar(datos) {
    const actualizado = actualizarUsuario(sesion.run, { ...datos, rol: usuario.rol });
    onActualizarSesion(actualizado);
    setGuardado(true);
  }

  return (
    <>
      <EncabezadoAdmin titulo="Mi perfil" subtitulo={`${usuario.rol} · ${usuario.correo}`} />
      {guardado && (
        <Alert variant="success" dismissible onClose={() => setGuardado(false)}>
          Tus datos fueron actualizados.
        </Alert>
      )}
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioUsuario modo="perfil" inicial={usuario} onGuardar={guardar} textoBoton="Guardar perfil" />
        </Card.Body>
      </Card>
    </>
  );
}

export default Perfil;
