import { vi } from "vitest";
import { leerDatos } from "./almacenamiento";
import { CLAVE_CARRITO, guardarCarrito, guardarSesion, leerCarrito, leerSesion } from "./persistencia";

describe("persistencia en localStorage", () => {
  it("guardarCarrito llama a setItem con la clave y el arreglo serializado (spy)", () => {
    const espia = vi.spyOn(Storage.prototype, "setItem");
    const carrito = [{ codigo: "ME004", cantidad: 2 }];
    guardarCarrito(carrito);
    expect(espia).toHaveBeenCalledWith(CLAVE_CARRITO, JSON.stringify(carrito));
    espia.mockRestore();
  });

  it("recupera el carrito guardado y devuelve un arreglo vacío si no existe", () => {
    expect(leerCarrito()).toEqual([]);
    guardarCarrito([{ codigo: "ME004", cantidad: 1 }]);
    expect(leerCarrito()).toEqual([{ codigo: "ME004", cantidad: 1 }]);
  });

  it("al cerrar sesión elimina la clave de sesión", () => {
    guardarSesion({ nombre: "Ana" });
    expect(leerSesion()).toEqual({ nombre: "Ana" });
    guardarSesion(null);
    expect(leerSesion()).toBeNull();
  });

  it("si el texto guardado está dañado usa el valor inicial", () => {
    localStorage.setItem("dato-roto", "{no es json");
    expect(leerDatos("dato-roto", [])).toEqual([]);
  });
});
