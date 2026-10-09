import { agregarItem, calcularTotal, cambiarCantidad, contarUnidades, detallarCarrito } from "./carrito";

const producto = { codigo: "ME005", nombre: "Bravecto", precio: 18900, precioOferta: 16900, stock: 3, imagen: "" };

describe("lógica del carrito", () => {
  it("agrega un producto nuevo y acumula la cantidad si ya existe", () => {
    let carrito = agregarItem([], producto, 1);
    carrito = agregarItem(carrito, producto, 2);
    expect(carrito).toEqual([{ codigo: "ME005", cantidad: 3 }]);
  });

  it("no permite superar el stock ni agregar productos agotados", () => {
    expect(() => agregarItem([{ codigo: "ME005", cantidad: 3 }], producto, 1)).toThrow(/stock disponible/);
    expect(() => agregarItem([], { ...producto, stock: 0 }, 1)).toThrow("Producto sin stock disponible.");
  });

  it("elimina el ítem cuando la cantidad llega a cero", () => {
    expect(cambiarCantidad([{ codigo: "ME005", cantidad: 1 }], "ME005", 0, 3)).toEqual([]);
    expect(cambiarCantidad([{ codigo: "ME005", cantidad: 1 }], "ME005", 9, 3)).toEqual([{ codigo: "ME005", cantidad: 3 }]);
  });

  it("calcula el total con el precio vigente y omite productos eliminados", () => {
    const carrito = [{ codigo: "ME005", cantidad: 2 }, { codigo: "BORRADO", cantidad: 1 }];
    const items = detallarCarrito(carrito, [producto]);
    expect(items).toHaveLength(1);
    expect(items[0].subtotal).toBe(33800);
    expect(calcularTotal(items)).toBe(33800);
    expect(contarUnidades(carrito)).toBe(3);
  });
});
