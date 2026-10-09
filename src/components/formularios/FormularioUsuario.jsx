import { useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { ROLES } from "../../utils/roles";
import { esFormularioValido, validarUsuario } from "../../utils/validaciones";
import SelectorRegionComuna from "./SelectorRegionComuna";

const VACIO = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  rol: "",
  fechaNacimiento: "",
  direccion: "",
  region: "",
  comuna: "",
  contrasena: "",
  confirmarContrasena: ""
};

// Formulario controlado reutilizable para usuarios.
// modo: "registro" (tienda), "nuevo" y "editar" (administración) o "perfil".
function FormularioUsuario({ modo, inicial, onGuardar, textoBoton }) {
  const [datos, setDatos] = useState({ ...VACIO, ...inicial, contrasena: "", confirmarContrasena: "" });
  const [errores, setErrores] = useState({});
  const [intentado, setIntentado] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);

  const editando = modo === "editar" || modo === "perfil";
  const conRol = modo === "nuevo" || modo === "editar";
  const opciones = { requiereContrasena: !editando, validarRol: conRol };

  // Actualiza un campo y, si ya se intentó enviar, vuelve a validar.
  function actualizar(cambios) {
    const nuevos = { ...datos, ...cambios };
    setDatos(nuevos);
    if (intentado) setErrores(validarUsuario(nuevos, opciones));
  }

  function cambiar(evento) {
    const { name, value } = evento.target;
    actualizar({ [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();
    setIntentado(true);
    setErrorGeneral("");
    const nuevosErrores = validarUsuario(datos, opciones);
    setErrores(nuevosErrores);
    if (!esFormularioValido(nuevosErrores)) return;

    setGuardando(true);
    try {
      onGuardar({ ...datos, run: datos.run.trim().toUpperCase() });
    } catch (error) {
      setErrorGeneral(error.message);
    } finally {
      setGuardando(false);
    }
  }

  function campo(nombre, etiqueta, propiedades = {}, columnas = 6) {
    return (
      <Col xs={12} md={columnas}>
        <Form.Group controlId={`usuario-${nombre}`}>
          <Form.Label>{etiqueta}</Form.Label>
          <Form.Control
            name={nombre}
            value={datos[nombre]}
            onChange={cambiar}
            isInvalid={Boolean(errores[nombre])}
            {...propiedades}
          />
          <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
        </Form.Group>
      </Col>
    );
  }

  return (
    <Form noValidate onSubmit={enviar} aria-label="Formulario de usuario">
      {errorGeneral && (
        <Alert variant="danger" role="alert">
          {errorGeneral}
        </Alert>
      )}
      {intentado && !esFormularioValido(errores) && (
        <Alert variant="warning" role="alert">
          Revisa los {Object.keys(errores).length} campos marcados antes de continuar.
        </Alert>
      )}

      <Row className="g-3">
        {campo("run", "RUN (sin puntos ni guion)", {
          placeholder: "Ej: 190110222",
          maxLength: 9,
          readOnly: editando,
          className: editando ? "bg-body-tertiary" : undefined
        })}
        {conRol ? (
          <Col xs={12} md={6}>
            <Form.Group controlId="usuario-rol">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol" value={datos.rol} onChange={cambiar} isInvalid={Boolean(errores.rol)}>
                <option value="">Selecciona un rol</option>
                {ROLES.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.rol}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        ) : (
          campo("fechaNacimiento", "Fecha de nacimiento (opcional)", { type: "date" })
        )}
        {campo("nombre", "Nombre", { maxLength: 50, autoComplete: "given-name" })}
        {campo("apellidos", "Apellidos", { maxLength: 100, autoComplete: "family-name" })}
        {campo("correo", "Correo electrónico", {
          type: "email",
          placeholder: "usuario@duoc.cl",
          autoComplete: "email"
        })}
        {conRol && campo("fechaNacimiento", "Fecha de nacimiento (opcional)", { type: "date" })}
        {campo("direccion", "Dirección", { maxLength: 300, autoComplete: "street-address" }, conRol ? 12 : 6)}
        <SelectorRegionComuna
          prefijo="usuario-"
          region={datos.region}
          comuna={datos.comuna}
          errores={errores}
          onCambiarRegion={(region) => actualizar({ region, comuna: "" })}
          onCambiarComuna={(comuna) => actualizar({ comuna })}
        />
        {campo(
          "contrasena",
          editando ? "Nueva contraseña (opcional)" : "Contraseña (4 a 10 caracteres)",
          { type: "password", autoComplete: "new-password" }
        )}
        {campo("confirmarContrasena", "Confirmar contraseña", {
          type: "password",
          autoComplete: "new-password"
        })}
      </Row>

      {editando && (
        <Form.Text>Deja la contraseña en blanco para conservar la actual.</Form.Text>
      )}

      <div className="mt-4">
        <Button type="submit" disabled={guardando}>
          {guardando && <Spinner size="sm" className="me-2" aria-hidden="true" />}
          {textoBoton}
        </Button>
      </div>
    </Form>
  );
}

export default FormularioUsuario;
