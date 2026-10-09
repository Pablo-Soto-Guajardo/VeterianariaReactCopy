import { filtrarProductos, ordenarProductos } from "./filtros";

const productos = [
  { codigo: "A1", nombre: "Ñandú", descripcion: "", categoria: "x", precio: 3000, precioOferta: null, stock: 1 },
  { codigo: "B2", nombre: "Antibiótico", descripcion: "Para infecciones", categoria: "y", precio: 5000, precioOferta: 1000, stock: 0 },
  { codigo: "C3", nombre: "Champú", descripcion: "", categoria: "x", precio: 2000, precioOferta: null, stock: 5 }
];

describe("filtros y orden del catálogo", () => {
  it("busca sin distinguir tildes ni mayúsculas, también en la descripción", () => {
    expect(filtrarProductos(productos, { texto: "ANTIBIOTICO" })).toHaveLength(1);
    expect(filtrarProductos(productos, { texto: "infecciones" })[0].codigo).toBe("B2");
  });

  it("ordena por precio vigente y por nombre sin modificar el arreglo original", () => {
    expect(ordenarProductos(productos, "precio-asc").map((p) => p.codigo)).toEqual(["B2", "C3", "A1"]);
    expect(ordenarProductos(productos, "precio-desc").map((p) => p.codigo)).toEqual(["A1", "C3", "B2"]);
    expect(ordenarProductos(productos, "nombre").map((p) => p.codigo)).toEqual(["B2", "C3", "A1"]);
    expect(productos[0].codigo).toBe("A1");
  });
});
