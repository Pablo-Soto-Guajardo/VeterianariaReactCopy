import { useState } from "react";
import { Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";

// Muestra el mensaje que otra página dejó al navegar (por ejemplo, "Producto creado").
function AvisoNavegacion() {
  const ubicacion = useLocation();
  const [visible, setVisible] = useState(true);
  const mensaje = ubicacion.state?.mensaje;

  if (!mensaje || !visible) return null;

  return (
    <Alert variant="success" dismissible onClose={() => setVisible(false)} role="status">
      {mensaje}
    </Alert>
  );
}

export default AvisoNavegacion;
