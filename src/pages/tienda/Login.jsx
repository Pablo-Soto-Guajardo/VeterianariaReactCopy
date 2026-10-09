import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { autenticarUsuario } from "../../data/baseDatos";
import { esFormularioValido, validarLogin } from "../../utils/validaciones";

function Login({ sesion, onIniciarSesion }) {
  const [datos, setDatos] = useState({ correo: "", contrasena: "" });
  const [errores, setErrores] = useState({});
  const [errorAcceso, setErrorAcceso] = useState("");
  const navigate = useNavigate();
  const ubicacion = useLocation();

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();
    setErrorAcceso("");
    const nuevosErrores = validarLogin(datos);
    setErrores(nuevosErrores);
    if (!esFormularioValido(nuevosErrores)) return;

    const usuario = autenticarUsuario(datos.correo, datos.contrasena);
    if (!usuario) {
      setErrorAcceso("Correo o contraseña incorrectos.");
      return;
    }
    onIniciarSesion(usuario);
    const destino = ubicacion.state?.desde || (usuario.rol === "Administrador" ? "/admin" : "/");
    navigate(destino, { replace: true });
  }

  if (sesion) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <h1 className="h4">Ya iniciaste sesión</h1>
          <p>Estás conectado/a como {sesion.nombre} ({sesion.correo}).</p>
          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-primary">Ir a la tienda</Link>
            {sesion.rol === "Administrador" && (
              <Link to="/admin" className="btn btn-outline-primary">Panel de administración</Link>
            )}
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          <div className="bg-white border rounded-3 p-4 shadow-sm">
            <p className="text-uppercase text-primary fw-semibold small mb-1 text-center">Acceso al sistema</p>
            <h1 className="h3 text-center mb-4">Iniciar sesión</h1>
            {ubicacion.state?.desde && (
              <Alert variant="info">Inicia sesión como administrador para continuar.</Alert>
            )}
            {errorAcceso && <Alert variant="danger" role="alert">{errorAcceso}</Alert>}
            <Form noValidate onSubmit={enviar}>
              <Form.Group className="mb-3" controlId="login-correo">
                <Form.Label>Correo</Form.Label>
                <Form.Control type="email" name="correo" value={datos.correo} onChange={cambiar} isInvalid={Boolean(errores.correo)} placeholder="ejemplo@duoc.cl" autoComplete="email" />
                <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4" controlId="login-contrasena">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="contrasena" value={datos.contrasena} onChange={cambiar} isInvalid={Boolean(errores.contrasena)} placeholder="Entre 4 y 10 caracteres" autoComplete="current-password" />
                <Form.Control.Feedback type="invalid">{errores.contrasena}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" className="w-100">Ingresar</Button>
            </Form>
            <p className="text-center mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </div>
          <div className="small bg-white border rounded-3 p-3 mt-3">
            <p className="fw-semibold mb-1">Cuentas de demostración</p>
            <p className="mb-0">Administrador: admin@duoc.cl / admin123</p>
            <p className="mb-0">Cliente: cliente@gmail.com / cliente1</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
