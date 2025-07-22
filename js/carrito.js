// ==========================
// VARIABLES GLOBALES
// ==========================
let carrito = [];

// ==========================
// CARGAR CARRITO DESDE localStorage
// ==========================
const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
if (carritoGuardado) {
    carrito = carritoGuardado;
}

// ==========================
// ACTUALIZAR CONTADOR VISUAL
// ==========================
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = totalItems;
    }
}

// ==========================
// ACTUALIZAR HTML DEL CARRITO
// ==========================
function actualizarCarritoHTML() {
    const carritoDiv = document.querySelector(".carritoCompras");

    // Siempre actualizar contador visual
    actualizarContadorCarrito();

// Escuchar el botón "Comprar ahora"
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-finalizar")) {
        if (carrito.length === 0) {
            mostrarSnackbar("El carrito está vacío.");
        } else {
            mostrarSnackbar("¡Gracias por tu compra!");
            carrito = [];
            localStorage.removeItem("carrito");
            actualizarCarritoHTML();
        }
    }
});


    // Si no hay contenedor (por ejemplo en index.html), salir
    if (!carritoDiv) return;

    carritoDiv.innerHTML = `
        <h2>Tu Carrito de Compras</h2>
        <ul class="lista-carrito"></ul>
        <p class="total-carrito"></p>
        <p class="cantidad-carrito"></p>
            <div class="acciones-carrito">
        <button class="btn-finalizar">Comprar ahora</button>
    </div>
    `;

    const lista = carritoDiv.querySelector(".lista-carrito");

    if (carrito.length === 0) {
        lista.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        let total = 0;
        for (const item of carrito) {
            total += item.precio * item.cantidad;
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.titulo} - $${item.precio} x ${item.cantidad}</span>
                <div>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="restar">-</button>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="sumar">+</button>
                    <button class="btn-eliminar" data-id="${item.id}" data-action="eliminar">x</button>
                </div>
            `;
            lista.appendChild(li);
        }

        carritoDiv.querySelector(".total-carrito").textContent = `Total a pagar: $${total}`;
        carritoDiv.querySelector(".cantidad-carrito").textContent = `Productos en carrito: ${carrito.length}`;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Escuchar eventos de suma/resta/eliminar
    lista.addEventListener("click", manejarClicCarrito);
}

// ==========================
// AGREGAR PRODUCTO AL CARRITO
// ==========================

function agregarProductoAlCarrito(idProducto) {
    
    const productoExistente = carrito.find(p => p.id === idProducto);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        const producto = productos.find(p => p.id === idProducto);
        if (producto) {
            carrito.push({ ...producto, cantidad: 1 });
        }
    }

    // ✅ Guardar el carrito aunque no haya HTML visible
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // ✅ Esto solo actualiza el DOM si el contenedor existe (por ejemplo, en carrito.html)
    actualizarCarritoHTML();
    mostrarSnackbar();
}

function mostrarSnackbar(mensaje = "Producto agregado al carrito") {
    const snackbar = document.getElementById("snackbar");

    // Elegimos un ícono según el mensaje
    let icono = "ℹ️"; // Por defecto

    if (mensaje.includes("vacío")) {
        icono = "⚠️";
    } else if (mensaje.includes("gracias") || mensaje.includes("Gracias")) {
        icono = "🎉";
    } else if (mensaje.includes("agregado")) {
        icono = "✅";
    }

    snackbar.innerHTML = `${icono} ${mensaje}`;
    snackbar.classList.add("mostrar");

    setTimeout(() => {
        snackbar.classList.remove("mostrar");
    }, 2500);
}

// ==========================
// MANEJAR BOTONES EN EL CARRITO
// ==========================
// function manejarClicCarrito(e) {
//     const btn = e.target;
//     const id = btn.dataset.id;
//     const action = btn.dataset.action;

//     if (action === "eliminar") {
//         carrito = carrito.filter(p => p.id !== id);
//     } else {
//         const producto = carrito.find(p => p.id === id);
//         if (producto) {
//             if (action === "sumar") {
//                 producto.cantidad++;
//             } else if (action === "restar") {
//                 producto.cantidad--;
//                 if (producto.cantidad <= 0) {
//                     carrito = carrito.filter(p => p.id !== id);
//                 }
//             }
//         }
//     }

//     actualizarCarritoHTML();
// }

function manejarClicCarrito(e) {
    const btn = e.target;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    const producto = carrito.find(p => p.id === id);
    if (!producto) return;

    if (action === "eliminar") {
        carrito = carrito.filter(p => p.id !== id);
    } else if (action === "sumar") {
        if (producto.cantidad < producto.stock) {
            producto.cantidad++;
        } else {
            mostrarSnackbar(`Solo hay ${producto.stock} unidades disponibles de "${producto.titulo}".`);
        }
    } else if (action === "restar") {
        producto.cantidad--;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }
    }

    actualizarCarritoHTML();
}

// ==========================
// MOSTRAR PRODUCTOS EN INDEX.HTML
// ==========================
function agregarProductos() {
    const contenedor = document.getElementById("productos-container");
    if (!contenedor) return;

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "card-producto";
        card.setAttribute("data-categoria", producto.categoria);

        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <h3>${producto.titulo}</h3>
            <p>${producto.descripcion}</p>
            <p>${producto.stock}</p>
            <p class="precio">$${producto.precio.toLocaleString()}</p>
            <button class="btn-comprar" data-id="${producto.id}">Agregar a Carrito</button>
        `;
        contenedor.appendChild(card);
    });

    // Escuchar clicks en botones de compra
    contenedor.addEventListener("click", e => {
        if (e.target.classList.contains("btn-comprar")) {
            const id = e.target.dataset.id;
            agregarProductoAlCarrito(id);
        }
    });
}

// ==========================
// INICIAR AL CARGAR EL DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    // Solo en index.html se agregan productos
    const contenedor = document.getElementById("productos-container");
    if (contenedor) {
        agregarProductos();
    }

    // Mostrar carrito (funciona en ambas páginas)
    actualizarCarritoHTML();
});

