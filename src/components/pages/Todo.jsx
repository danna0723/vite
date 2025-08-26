
import React, { useState, useEffect, useMemo } from "react";
import "../css/Todo.css";



export default function Todo({ user }) {
    // Si no hay usuario logueado, no mostrar la lista
    //     if (!user) {
    //     return (
    //         <div className="todo-container">
    //             <h2 className="todo-title">Lista de Tareas</h2>
    //             <p style={{textAlign: 'center', margin: '2rem 0', color: '#888'}}>Inicia sesión para ver tus tareas.</p>
    //         </div>
    //     );
    // }

        const storageKey = useMemo(
            () => `todos_${user}`,
        [user]
    );

    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [];
    });
    const [texto, setTexto] = useState("");


    // Si cambia el usuario (storageKey), recargar tareas
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        setItems(saved ? JSON.parse(saved) : []);
    }, [storageKey]);

    // guardar tareas
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey]);

    const addTodo = (e) => {
        e.preventDefault();
        const txt = texto.trim();
        if (!txt) return;

        setItems((prev) => [
            ...prev,
            { id: crypto.randomUUID(), text: txt, done: false, ts: Date.now() },
        ]);

        setTexto("");
    };

    const toogleTodo = (id) => {
        setItems((prev) =>
            prev.map((it) =>
                it.id === id ? { ...it, done: !it.done } : it
            )
        );
    };

    const removeTodo = (id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    const clearCompleted = () => {
        setItems((prev) => prev.filter((it) => !it.done));
    };

    const pending = items.filter((i) => !i.done).length;

    return (
        <div className="todo-container">
            <h2 className="todo-title">Lista de Tareas</h2>

            <form onSubmit={addTodo} className="todo-form">
                <input
                    className="todo-input"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Nueva tarea"
                    aria-label="nueva tarea"
                />
                <button type="submit" className="todo-add">
                    Agregar Tarea
                </button>
            </form>

            <ul className="listaTarea">
                {items.length === 0 && <li>No hay tareas aún</li>}
                {items.map((item) => (
                    <li key={item.id} className="itemsMap">
                        <div className="left-content">
                            <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => toogleTodo(item.id)}
                                aria-label={`Marcar "${item.text}"`}
                            />
                            <span className="textCheckbox">{item.text}</span>
                        </div>
                        <button onClick={() => removeTodo(item.id)} aria-label="Eliminar">
                            🗑️
                        </button>
                    </li>

                ))}
            </ul>

            <div className="pendientes">
                <span>{pending} pendientes</span>
                <button onClick={clearCompleted} className="clear-btn">
                    Borrar completadas
                </button>
            </div>
        </div>
    );
}

