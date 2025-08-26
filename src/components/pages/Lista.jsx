import { useEffect, useState } from 'react';
import { useRef } from 'react';
import "../css/Lista.css";

export default function ListaDeGustos({titulo,descripcion}){

    // Cargar productos desde localStorage
    const [productos, setProductos] = useState(() => {
        const guardados = localStorage.getItem('productos');
        return guardados ? JSON.parse(guardados) : [];
    });


    // Carrito
    const [cartCount, setCartCount] = useState(0);
    const cartIconRef = useRef(null);
    const cartOutputRef = useRef(null);
    const imgRefs = useRef({});

    // Animación de contador
    const animateCartCount = () => {
        const output = cartOutputRef.current;
        if (output) {
            output.classList.remove('pop');
            void output.offsetWidth;
            output.classList.add('pop');
        }
    };

    // imagen volando al carrito
    const flyToCart = (id) => {
        const img = imgRefs.current[id];
        const cart = cartIconRef.current;
        if (!img || !cart) return;
        const clone = img.cloneNode(true);
        const imgRect = img.getBoundingClientRect();
        const cartRect = cart.getBoundingClientRect();
        clone.classList.add('fly');
        clone.style.top = imgRect.top + 'px';
        clone.style.left = imgRect.left + 'px';
        clone.style.position = 'fixed';
        const tx = imgRect.left - cartRect.left;
        const ty = imgRect.top - cartRect.top;
        clone.style.setProperty('--tx', tx + 'px');
        clone.style.setProperty('--ty', ty + 'px');
        document.body.appendChild(clone);
        clone.addEventListener('animationend', () => {
            clone.remove();
        });
    };

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    });

    const añadirProducto = (e) => {
        e.preventDefault();
        if (nuevoProducto.nombre && nuevoProducto.precio) {
            const producto = {
                id: Date.now(),
                nombre: nuevoProducto.nombre,
                precio: nuevoProducto.precio,
                imagen: nuevoProducto.imagen || '',
            };
            const nuevos = [...productos, producto];
            setProductos(nuevos);
            localStorage.setItem('productos', JSON.stringify(nuevos));
            // setNuevoProducto({ nombre: '', precio: '', imagen: '' });
        }
    };

    const eliminarProducto = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            const nuevos = productos.filter(producto => producto.id !== id);
            setProductos(nuevos);
            localStorage.setItem('productos', JSON.stringify(nuevos));
        }
    };

    
    useEffect(() => {
        localStorage.setItem('productos', JSON.stringify(productos));
    }, [productos]);


    // tarjetas
    const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
    const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

    useEffect(() => {
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

        // Aplicar efectos a las tarjetas
        const cards = document.querySelectorAll('.box-card');
        const handlers = [];
        cards.forEach($card => {
            const cardUpdate = (e) => {
                const position = pointerPositionRelativeToElement($card, e);
                const [px, py] = position.pixels;
                const [perx, pery] = position.percent;
                const [dx, dy] = distanceFromCenter($card, px, py);
                const edge = closenessToEdge($card, px, py);
                const angle = angleFromPointerEvent($card, dx, dy);

                $card.style.setProperty('--pointer-x', `${round(perx)}%`);
                $card.style.setProperty('--pointer-y', `${round(pery)}%`);
                $card.style.setProperty('--pointer-°', `${round(angle)}deg`);
                $card.style.setProperty('--pointer-d', `${round(edge * 100)}`);

                $card.classList.remove('animating');
            };
            const leaveHandler = () => {
                $card.style.setProperty('--pointer-d', '0');
            };
            $card.addEventListener('pointermove', cardUpdate);
            $card.addEventListener('pointerleave', leaveHandler);
            handlers.push({ $card, cardUpdate, leaveHandler });
        });

        // Cleanup function
        return () => {
            handlers.forEach(({ $card, cardUpdate, leaveHandler }) => {
                $card.removeEventListener('pointermove', cardUpdate);
                $card.removeEventListener('pointerleave', leaveHandler);
            });
        };
    }, [productos]); 

return (
    <>
    <div className='user_list'>
        <section className="products" id="products">
            <div className="heading">
                
                <h2>videogames</h2>
            </div>

            <div class="cosmos-background">
                <div class="stars-container"></div>
            </div>


            <div className="products-container">
                
                {productos.map((producto) => (
                    <div key={producto.id} className={`box-card ${!producto.imagen ? 'sin-imagen' : ''}`}>
                        {producto.imagen && (
                            <img src={producto.imagen} alt={producto.nombre} ref={el => (imgRefs.current[producto.id] = el)} />
                        )}
                        <h3>{producto.nombre}</h3>
                        <div className="content">
                            <span>${producto.precio}</span>
                            <button
                                className="add-to-cart"
                                onClick={e => {
                                    e.preventDefault();
                                    setCartCount(c => c + 1);
                                    animateCartCount();
                                    flyToCart(producto.id);
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                        {/* <p style={{ color: 'white', fontSize: '0.9em', margin: '4px 0' }}>Creado por: {user?.usuario || 'Invitado'}</p> */}
                        <div className="acciones-producto">
                            <button 
                                className="btn-eliminar"
                                onClick={() => eliminarProducto(producto.id)}
                                title="Eliminar"
                            >
                                X
                            </button>
                        </div>
                        
                        <span className="glow"></span>
                    </div>
                ))}
            </div>



        <div className="cart-icon" id="cart" ref={cartIconRef} style={{position: 'fixed', top: 20, right: 20, zIndex: 300, display: 'flex', alignItems: 'center', gap: '4px'}}>
            <i className="bx bx-cart-alt" style={{fontSize: '2rem', color: 'white'}}></i>
            <output
                id="cart-count"
                aria-label={`Cart has ${cartCount} items`}
                ref={cartOutputRef}
                style={{background: 'red', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'}}
            >
                {cartCount}
            </output>
        </div>
        </section>


        <section className='añadir' id='añadir'>
            <h1>Añadir Nuevo</h1>
            <div className="form-container">
                <form onSubmit={añadirProducto} className="producto-form">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre del juego:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={nuevoProducto.nombre}
                                onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
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
                                onChange={e => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
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
                                onChange={e => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })}
                                placeholder=""
                            />
                        </div>
                    <div className="form-buttons">
                        <button type="submit" className="submit-btn">
                            Guardar
                        </button>
                        
                    </div>
                </form>
            </div>
        </section>
        </div>
    </>
);
}
