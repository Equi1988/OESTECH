// Tienda 

document.addEventListener('DOMContentLoaded', function () {
    const productos = document.querySelectorAll('.card-producto');
    const buscador = document.getElementById('buscador');
    const filtro = document.getElementById('filtroCategoria');

    function filtrarProductos() {
        const texto = buscador.value.toLowerCase();
        const categoria = filtro.value;

        productos.forEach(producto => {
            const titulo = producto.querySelector('h3').textContent.toLowerCase();
            const descripcion = producto.querySelector('p').textContent.toLowerCase();
            const categoriaProducto = producto.getAttribute('data-categoria');

            const coincideTexto = titulo.includes(texto) || descripcion.includes(texto);
            const coincideCategoria = categoria === 'todos' || categoria === categoriaProducto;

            if (coincideTexto && coincideCategoria) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    }

    buscador.addEventListener('input', filtrarProductos);
    filtro.addEventListener('change', filtrarProductos);
});


function toggleDropdown() {
    const dropdown = document.getElementById("dropdownForm");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Ocultar si se clickea fuera del dropdown
document.addEventListener("click", function (event) {
    const cuenta = document.querySelector(".cuenta-dropdown");
    if (!cuenta.contains(event.target)) {
        document.getElementById("dropdownForm").style.display = "none";
    }
});


