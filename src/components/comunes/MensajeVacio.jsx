import { Link } from "react-router-dom";

// Mensaje para listas vacías, con un enlace opcional para continuar.
function MensajeVacio({ icono = "bi-inbox", titulo, texto, enlace, textoEnlace }) {
  return (
    <div className="text-center bg-white border rounded-3 p-5">
      <i className={`bi ${icono} display-5 text-secondary`} aria-hidden="true"></i>
      <p className="h5 mt-3">{titulo}</p>
      {texto && <p className="text-body-secondary mb-3">{texto}</p>}
      {enlace && (
        <Link className="btn btn-primary" to={enlace}>
          {textoEnlace}
        </Link>
      )}
    </div>
  );
}

export default MensajeVacio;
