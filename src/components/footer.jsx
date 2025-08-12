import React from 'react';

function Footer(){
    const year = new Date().getFullYear();

    return (
        <div className="container foot">
            <footer className="py-3 my-4 "> 
                <ul className="nav justify-content-center border-bottom pb-3 mb-3"> 
                    <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">Home</a></li> 
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">MyCollection</a></li>
                </ul> 
                <p className="text-center text-body-secondary">copyright © {year}</p>
            </footer> 
        </div>

    );
}
export default Footer;