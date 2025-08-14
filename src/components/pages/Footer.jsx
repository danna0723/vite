import React from 'react';
import '../css/Footer.css';

function Footer() {
    const year = new Date().getFullYear();
    return (
        <>
            <section className="footer">
                <div className="footer-box">
                    <h3>PixelCatGames</h3>
                    <p>Power up your adventure. Explore new worlds, conquer challenges, and find your next favorite game today.</p>
                    
                    <div className="social">
                        <a href="#"><i className="bx bxl-facebook"></i></a>
                        <a href="#"><i className="bx bxl-whatsapp"></i></a>
                        <a href="#"><i className="bx bxl-instagram"></i></a>
                        <a href="#"><i className="bx bxl-tiktok"></i></a>
                    </div>
                </div>

                <div className="footer-box">
                    <h3>Support</h3>
                    
                    <li><a href="#">Product</a></li>
                    <li><a href="#">Help & Support</a></li>
                    <li><a href="#">Return Policy</a></li>
                    <li><a href="#">Terms of Use</a></li>
                    <li><a href="#">Legal</a></li>
                </div>

                <div className="footer-box">
                    <h3>View Guides</h3>
                    
                    <li><a href="#">Features</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Blog Posts</a></li>
                    <li><a href="#">Our Branches</a></li>
                </div>

                <div className="footer-box">
                    <h3>Contact</h3>

                    <div className="contact">
                        <span><i className="bx bxs-phone"></i> +1 444 744 8444</span>
                        <span><i className="bx bxs-envelope"></i> pixelcat@shop</span>
                    </div>
                </div>
            </section>

            <div className="copyright">
                <p>&copy; {year}</p>
            </div>
        </>
    );
}

export default Footer;
