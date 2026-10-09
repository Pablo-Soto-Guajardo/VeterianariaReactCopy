import { useState } from "react";

export const IMAGEN_RESPALDO = "/img/sin-imagen.svg";

// Muestra una imagen y, si no carga, la reemplaza por una imagen local.
function ImagenConRespaldo({ src, alt, className = "" }) {
  const [fallo, setFallo] = useState(false);
  const origen = !src || fallo ? IMAGEN_RESPALDO : src;

  return (
    <img
      src={origen}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  );
}

export default ImagenConRespaldo;
