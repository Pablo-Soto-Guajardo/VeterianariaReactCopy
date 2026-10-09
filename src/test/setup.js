// Se ejecuta antes de cada archivo de pruebas.
import "@testing-library/jest-dom/vitest";

// Cada prueba comienza con el almacenamiento vacío para no depender de otra.
beforeEach(() => {
  localStorage.clear();
});
