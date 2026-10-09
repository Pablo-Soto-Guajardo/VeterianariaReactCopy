import { Toast, ToastContainer } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import EncabezadoTienda from "./EncabezadoTienda";
import PiePagina from "./PiePagina";

// Estructura común de todas las páginas públicas.
// Outlet es el lugar donde React Router dibuja la página de la ruta actual.
function LayoutTienda({ carrito, sesion, onCerrarSesion, aviso, onCerrarAviso }) {
  return (
    <>
      <a className="salto-contenido" href="#contenido-principal">
        Ir al contenido
      </a>
      <EncabezadoTienda carrito={carrito} sesion={sesion} onCerrarSesion={onCerrarSesion} />
      <main id="contenido-principal" className="flex-grow-1">
        <Outlet />
      </main>
      <PiePagina />

      <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 1080 }}>
        <Toast
          show={Boolean(aviso)}
          onClose={onCerrarAviso}
          delay={3000}
          autohide
          bg={aviso?.tipo === "error" ? "danger" : "success"}
        >
          <Toast.Body className="text-white d-flex justify-content-between align-items-start gap-3">
            <span role="status">{aviso?.texto}</span>
            <button type="button" className="btn-close btn-close-white" aria-label="Cerrar aviso" onClick={onCerrarAviso}></button>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default LayoutTienda;
