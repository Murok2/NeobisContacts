import React, { useState, useEffect, useRef, useReducer } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Contacts.module.css';
import favIcon from '../../assets/images/favorite.svg';
import nonfavIcon from '../../assets/images/nonfavorite.svg';
import emailIcon from '../../assets/images/email.svg';
import internetIcon from '../../assets/images/internet.svg';
import locationIcon from '../../assets/images/location.svg';
import smartphoneIcon from '../../assets/images/smartphone.svg';
import sortIconAZ from '../../assets/images/sortAZ.svg'; 
import sortIconZA from '../../assets/images/sortZA.svg'; 
import { addToFavorites, removeFavorite, setFavoritesFromLS, setUsers } from '../../redux/rootReducer';


let Contacts;
Contacts = ({users, favorites, setFavoritesFromLS, addToFavorites, removeFavorite, setUsers}) => {
    const [searchedUsers, setSearchedUsers] = useState();
    const [isFavoritesFilter, setFavoritesFilter] = useState(false);

    const preventFavorites = useRef();
    preventFavorites.current = favorites;
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        if (!favorites.length && JSON.parse(localStorage.getItem('favorites')).length) {
            setFavoritesFromLS(JSON.parse(localStorage.getItem('favorites')))
        }
    }, [favorites, setFavoritesFromLS])

    const setFavorites = async (user) => {
        if (!favorites.some(item => item.id === user.id)) {
            await addToFavorites(user)
        } else {
            await removeFavorite(user)
        }
        localStorage.setItem('favorites', JSON.stringify(preventFavorites.current));
    }

    const searchFunc = (e) => {
        setSearchedUsers(users.filter(item => {
            let fullName = item.firstName + ' ' + item.lastName;
            let fullNameReverse = item.lastName + ' ' + item.firstName;
            return fullName.toLowerCase().search(e.target.value.toLowerCase()) !== -1
                || fullNameReverse.toLowerCase().search(e.target.value.toLowerCase()) !== -1
        }))
    }
    const sortFunc = async (direction) => {
        let sortedUsers = await users.sort((a, b) => {
            if (direction) {
                if (a.firstName < b.firstName) return -1;
                if (b.firstName < a.firstName) return 1;
            } else {
                if (a.firstName > b.firstName) return -1;
                if (b.firstName > a.firstName) return 1;
            }
        })
        setUsers(sortedUsers)
        forceUpdate();
    }

    return (
        <div className={styles.contactsBlock}>

            <div className={styles.actionBars}>
                <div className={styles.search}>
                    <input type="text" className={styles.searchInput} onChange={(e) => searchFunc(e)}
                           placeholder='type to search...'/>
                </div>
                <div className={styles.actionButtons}>
                    <span className={styles.favoritesFilter} onClick={() => setFavoritesFilter(!isFavoritesFilter)}>
                        <img src={isFavoritesFilter ? favIcon : nonfavIcon} alt="Favorites"/>
                    </span>
                    <span onClick={() => sortFunc(true)}><img src={sortIconAZ} alt="az sort"/></span>
                    <span onClick={() => sortFunc(false)}><img src={sortIconZA} alt="za sort"/></span>
                </div>
            </div>

            <div className={styles.contacts}>
                {searchedUsers
                    ? <UsersMapping users={searchedUsers} setFavorites={setFavorites} isFavorites={isFavoritesFilter}
                                    favorites={favorites}/>
                    : <UsersMapping users={users} setFavorites={setFavorites} isFavorites={isFavoritesFilter}
                                    favorites={favorites}/>
                }
            </div>
        </div>
    )
};

const UsersMapping = ({users, setFavorites, isFavorites, favorites}) => {
    let forMapping = isFavorites ? favorites : users
    return forMapping.map(u => (
        <div className={styles.contactItem} key={u.id}>
            <div className={styles.photo}><img src={u.image} alt="profile"/></div>
            <div className={styles.textInfo}>
                <p className={styles.name}>
                    {u.firstName} {u.lastName}
                    <span className={styles.favorite} onClick={() => setFavorites(u)}>
                        <img src={(favorites.length && favorites.some(item => item.id === u.id)) ? favIcon : nonfavIcon}
                             alt="favorite"/>
                    </span>
                </p>
                <p className={styles.location}>
                    <img className={styles.icon} src={locationIcon} alt="icon"/>
                    {u.city} city, {u.country}
                </p>
                <p className={styles.number}>
                    <img className={styles.icon} src={smartphoneIcon} alt="icon"/>
                    {u.phoneNumber}
                </p>
                <p className={styles.website}>
                    <img className={styles.icon} src={internetIcon} alt="icon"/>
                    {u.website}
                </p>
                <p className={styles.email}>
                    <img className={styles.icon} src={emailIcon} alt="icon"/>
                    {u.email}
                </p>
                <div className={styles.btnBlock}>
                    <NavLink to={`/contact/${u.id}`} className={styles.showUser}>Show</NavLink>
                </div>
            </div>
        </div>
    ))
}, mstp = (state) => ({
    users: state.usersData.users,
    favorites: state.usersData.favorites
});

export default connect(mstp, { addToFavorites, removeFavorite, setFavoritesFromLS, setUsers })(Contacts);