const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");

// Crear nuevo carrito
router.post("/carts", async (req, res) => {
    try {
        const newCarrito = await cartManager.crearCarrito();
        if (newCarrito.status) {
            return res.status(201).json({ status: true, msg: `Carrito creado correctamente ${newCarrito.msg}` });
        } else {
            return res.status(400).json({ status: false, msg: newCarrito.msg });
        }
    } catch (error) {
        console.error("Error al crear un carrito:", error);
        return res.status(500).json({ status: false, msg: "Error interno del servidor" });
    }
});


// Listar productos que pertenecen a un carrito determinado
router.get("/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const carrito = await cartManager.getCarritoById(cartId);
        if (carrito) {
            res.json(carrito.products);
        } else {
            res.status(404).json({ status: false, msg: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener productos del carrito:", error);
        res.status(500).json({ status: false, msg: "Error interno del servidor" });
    }
});

// Agregar productos a distintos carritos
router.post("/carts/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        if (actualizarCarrito.status) {
            res.json(actualizarCarrito.msg);
        } else {
            res.status(400).json({ status: false, msg: actualizarCarrito.msg });
        }
    } catch (error) {
        console.error("Error al agregar productos al carrito:", error);
        res.status(500).json({ status: false, msg: "Error interno del servidor" });
    }
});

module.exports = router; 