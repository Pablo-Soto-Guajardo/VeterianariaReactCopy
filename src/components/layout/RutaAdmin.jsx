import { Alert, Container } from "react-bootstrap";
import { Link, Navigate, useLocation } from "react-router-dom";

// Protege las rutas de administración: exige sesión con rol Administrador.
function RutaAdmin({ sesion, children }) {
  const ubicacion = useLocation();

  if (!sesion) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (sesion.rol !== "Administrador") {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading as="h1" className="h4">Acceso restringido</Alert.Heading>
          <p>Tu cuenta ({sesion.rol}) no tiene permisos para ver el panel de administración.</p>
          <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
        </Alert>
      </Container>
    );
  }

  return children;
}

export default RutaAdmin;
