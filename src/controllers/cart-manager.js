const fs = require("fs").promises;

class CartManager {
    constructor(fileProducts) {
        this.carts = [];
        this.path = fileProducts;
        this.ultId = 0;

        //Cargar carritos almacenados en el archivo
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                //Para verificar si hay al menos carrito creado
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al crear los carritos: ", error);
            //Si no existe el archivo, se va  a crear: 
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        }

        this.carts.push(nuevoCarrito);

        //Guardar el array en el archivo: 
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(carritoId) {
        try {
            const carrito = this.carts.find(c => c.id === carritoId);

            if (!carrito) {
                console.log("No hay carrito con ese id");
                return;
            }

            return carrito;
        } catch (error) {
            console.log("Error al obtener un carrito por id: ", error);
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCarritoById(carritoId);
        const existeProducto = carrito.products.find(p => p.product === productoId);

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productoId, quantity });
        }

        await this.guardarCarritos();
        return carrito;
    }
}


module.exports = CartManager;