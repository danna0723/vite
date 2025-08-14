import { useState } from 'react';
import "../css/Navbar.css";



export default function Navbar({user, onLogout}){
    const [cartCount, setCartCount] = useState(0);

    return (
        <header>
            <a href="#" className="logo">
                <img src="https://images.vexels.com/media/users/3/320109/isolated/preview/3c5bd5afae30fa42737e2945846cff64-cute-cat-in-pixel-art-style.png" alt="PixelCatGames Logo" />
            </a>

            <i className="bx bx-menu" id="menu-icon"></i>

            <ul className="navbar">
                <li><a href="#home">Home</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#best">Best Seller</a></li>
            </ul>

            <div className="header-icon">
                <div className="cart-container">
                    <i className="bx bx-cart-alt"></i>
                    <output id="cart-count" aria-label={cartCount}>{cartCount}</output>
                </div>
                <i className="bx bx-search" id="search-icon"></i>
                                <div className="profile-pic">
                    {user?.usuario ?(
                        <>
                            <span style={{marin: 8}}> {user.usuario}</span>   

                        </>

                    ): null
                    }
                    <img 
                        src="https://i.pinimg.com/736x/c7/a4/dc/c7a4dcd0de4b07295caa8386f98f63db.jpg" 
                        alt="Profile Picture" 
                        className="profile-image"
                    />
                </div>

            </div>

            <div className="search-box">
                <input type="search" placeholder="Search here..." />
            </div>
        </header>
    );
}
