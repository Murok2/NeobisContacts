import React from 'react';
import styles from './Header.module.css'
import logo from '../../assets/images/logo.svg'
import { NavLink } from 'react-router-dom';

const Header = (props) => {
    return (
        <div className={styles.header}>
            <div className="wrapper">
                <div className="logo">
                    <NavLink to='/'>
                        <img src={logo} alt="logo"/>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Header;