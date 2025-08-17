import { useEffect, useState } from 'react';
import "../css/Lista.css";

export default function ListaDeGustos({titulo,descripcion}){

    const [productos, setProductos] = useState([
        // {
        //     id: 1,
        //     nombre: 'Yandere Simulator',
        //     precio: 10,
        //     imagen: 'https://th.bing.com/th/id/R.49fe475a5f656c07895f8a1e19098d29?rik=US%2fjypo4cZpuzA&pid=ImgRaw&r=0',
        //     tachado: false
        // },
        // {
        //     id: 2,
        //     nombre: 'The Sims 4',
        //     precio: 20,
        //     imagen: 'https://th.bing.com/th/id/R.72a2d261aa1485a7a30855e83d53b839?rik=41lbsqb75o018A&pid=ImgRaw&r=0',
        //     tachado: false
        // },
        // {
        //     id: 3,
        //     nombre: 'Minecraft',
        //     precio: 30,
        //     imagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202407/0401/670c294ded3baf4fa11068db2ec6758c63f7daeb266a35a1.png',
        //     tachado: false
        // }
    ]);

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    });

    // Estado para el producto en edición
    const [editandoProducto, setEditandoProducto] = useState(null);

    // Función para añadir un nuevo producto
    const añadirProducto = (e) => {
        e.preventDefault();
        if (nuevoProducto.nombre && nuevoProducto.precio) {
            const producto = {
                id: Date.now(), // ID único basado en timestamp
                nombre: nuevoProducto.nombre,
                precio: nuevoProducto.precio,
                imagen: nuevoProducto.imagen || '', // Imagen opcional
                tachado: false // Nueva propiedad para el estado tachado
            };
            setProductos([...productos, producto]);
            // setNuevoProducto({ nombre: '', precio: '', imagen: '' }); // Limpiar formulario
        }
    };

    // Función para manejar cambios en el formulario
    const manejarCambio = (e) => {
        setNuevoProducto({
            ...nuevoProducto,
            [e.target.name]: e.target.value
        });
    };

    // Función para eliminar un producto
    const eliminarProducto = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            setProductos(productos.filter(producto => producto.id !== id));
        }
    };

    // Función para tachar/destachar un producto
    const tacharProducto = (id) => {
        setProductos(productos.map(producto => 
            producto.id === id 
                ? { ...producto, tachado: !producto.tachado }
                : producto
        ));
    };

    // Función para iniciar la edición de un producto
    const iniciarEdicion = (producto) => {
        setEditandoProducto(producto);
        setNuevoProducto({
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen
        });
    };

    // Función para guardar los cambios de edición
    const guardarEdicion = (e) => {
        e.preventDefault();
        if (nuevoProducto.nombre && nuevoProducto.precio) {
            setProductos(productos.map(producto => 
                producto.id === editandoProducto.id
                    ? { ...producto, nombre: nuevoProducto.nombre, precio: nuevoProducto.precio, imagen: nuevoProducto.imagen || '' }
                    : producto
            ));
            setEditandoProducto(null);
            setNuevoProducto({ nombre: '', precio: '', imagen: '' });
        }
    };

    // Función para cancelar la edición
    const cancelarEdicion = () => {
        setEditandoProducto(null);
        setNuevoProducto({ nombre: '', precio: '', imagen: '' });
    };

    useEffect(() => {
        // Esperar a que el DOM esté listo y luego inicializar los efectos del mouse
        const initMouseEffects = () => {
            // Funciones de utilidad
            const centerOfElement = ($el) => {
                const { width, height } = $el.getBoundingClientRect();
                return [width / 2, height / 2];
            };

            const pointerPositionRelativeToElement = ($el, e) => {
                const pos = [e.clientX, e.clientY];
                const { left, top, width, height } = $el.getBoundingClientRect();
                const x = pos[0] - left;
                const y = pos[1] - top;
                const px = clamp((100 / width) * x);
                const py = clamp((100 / height) * y);
                return { pixels: [x, y], percent: [px, py] };
            };

            const angleFromPointerEvent = ($el, dx, dy) => {
                let angleDegrees = 0;
                if (dx !== 0 || dy !== 0) {
                    const angleRadians = Math.atan2(dy, dx);
                    angleDegrees = angleRadians * (180 / Math.PI) + 90;
                    if (angleDegrees < 0) angleDegrees += 360;
                }
                return angleDegrees;
            };

            const distanceFromCenter = ($el, x, y) => {
                const [cx, cy] = centerOfElement($el);
                return [x - cx, y - cy];
            };

            const closenessToEdge = ($el, x, y) => {
                const [cx, cy] = centerOfElement($el);
                const [dx, dy] = distanceFromCenter($el, x, y);
                let kx = Infinity;
                let ky = Infinity;
                if (dx !== 0) kx = cx / Math.abs(dx);
                if (dy !== 0) ky = cy / Math.abs(dy);
                return clamp(1 / Math.min(kx, ky), 0, 1);
            };

            const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
            const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

            // Aplicar efectos a las tarjetas
            const cards = document.querySelectorAll('.box-card');
            console.log('Found cards:', cards.length); // Debug

            cards.forEach($card => {
                const cardUpdate = (e) => {
                    console.log('Mouse move detected on card'); // Debug
                    const position = pointerPositionRelativeToElement($card, e);
                    const [px, py] = position.pixels;
                    const [perx, pery] = position.percent;
                    const [dx, dy] = distanceFromCenter($card, px, py);
                    const edge = closenessToEdge($card, px, py);
                    const angle = angleFromPointerEvent($card, dx, dy);

                    console.log('Setting variables:', {
                        x: perx,
                        y: pery,
                        angle: angle,
                        edge: edge
                    }); // Debug

                    $card.style.setProperty('--pointer-x', `${round(perx)}%`);
                    $card.style.setProperty('--pointer-y', `${round(pery)}%`);
                    $card.style.setProperty('--pointer-°', `${round(angle)}deg`);
                    $card.style.setProperty('--pointer-d', `${round(edge * 100)}`);

                    $card.classList.remove('animating');
                };

                $card.addEventListener('pointermove', cardUpdate);

                $card.addEventListener('pointerleave', () => {
                    $card.style.setProperty('--pointer-d', '0');
                });
            });
        };

        // Ejecutar después de un pequeño delay para asegurar que el DOM esté listo
        setTimeout(initMouseEffects, 100);

        // Cleanup function
        return () => {
            const cards = document.querySelectorAll('.box-card');
            cards.forEach(card => {
                card.removeEventListener('pointermove', () => {});
                card.removeEventListener('pointerleave', () => {});
            });
        };
    }, [productos]); // Dependencia de productos para reinicializar efectos

return (
    <>
    <div className='user_list'>
        <section className="products" id="products">
            <div className="heading">
                <h2>videogames</h2>
            </div>

            <div className="products-container">
                {productos.map((producto) => (
                    <div key={producto.id} className={`box-card ${!producto.imagen ? 'sin-imagen' : ''}`}>
                        {producto.imagen && (
                            <img src={producto.imagen} alt={producto.nombre} />
                        )}
                        <h3 className={producto.tachado ? 'tachado' : ''}>{producto.nombre}</h3>
                        <div className="content">
                            <span>${producto.precio}</span>
                            <a href="#" className="add-to-cart">Add to Cart</a>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="acciones-producto">
                            <button 
                                className="btn-tachar"
                                onClick={() => tacharProducto(producto.id)}
                                title={producto.tachado ? "Destachar" : "Tachar"}
                            >
                                {producto.tachado ? "↩️" : "X"}
                            </button>
                            <button 
                                className="btn-editar"
                                onClick={() => iniciarEdicion(producto)}
                                title="Editar"
                            >
                                ✏️
                            </button>
                            <button 
                                className="btn-eliminar"
                                onClick={() => eliminarProducto(producto.id)}
                                title="Eliminar"
                            >
                                borrar
                            </button>
                        </div>
                        
                        <span className="glow"></span>
                    </div>
                ))}
            </div>
        </section>
        <section className='añadir' id='añadir'>
            <h1>{editandoProducto ? 'Editar Producto' : 'Añadir Nuevo'}</h1>
            <div className="form-container">
                <form onSubmit={editandoProducto ? guardarEdicion : añadirProducto} className="producto-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del juego:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={nuevoProducto.nombre}
                            onChange={manejarCambio}
                            placeholder=""
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="precio">Precio ($):</label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={nuevoProducto.precio}
                            onChange={manejarCambio}
                            placeholder=""
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="imagen">URL de la imagen (opcional):</label>
                        <input
                            type="url"
                            id="imagen"
                            name="imagen"
                            value={nuevoProducto.imagen}
                            onChange={manejarCambio}
                            placeholder=""
                        />
                    </div>
                    
                    <div className="form-buttons">
                        <button type="submit" className="submit-btn">
                            {editandoProducto ? 'Guardar Cambios' : 'Añadir Producto'}
                        </button>
                        {editandoProducto && (
                            <button type="button" className="cancel-btn" onClick={cancelarEdicion}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </section>
        </div>
    </>
);
}
