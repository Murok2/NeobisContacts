import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import styles from './ContactInfo.module.css'
import favIcon from '../../assets/images/favorite.svg'
import nonfavIcon from '../../assets/images/nonfavorite.svg';
import { addToFavorites, removeFavorite, setUsers, setFavoritesFromLS } from '../../redux/rootReducer'
import { Input } from '../common/FormControls/FormControls';
import { emailValid, numValid } from '../common/validators/validators';


const ContactFormsF = (props) => {
    let submit;
    submit = async (formData) => {
        let changedData;
        changedData = {
            firstName: formData.firstName || props.user.firstName,
            lastName: formData.lastName || props.user.lastName,
            city: formData.city || props.user.city,
            country: formData.country || props.user.country,
            phoneNumber: formData.phoneNumber || props.user.phoneNumber,
            email: formData.email || props.user.email,
            website: formData.website || props.user.website
        };
        let updateUsers = await props.users.filter(item => item.id !== props.user.id)
        await updateUsers.push({...props.user, ...changedData});
        await updateUsers.sort((a, b) => a.id - b.id);
        await props.setUsers(updateUsers)
        localStorage.setItem('contacts', JSON.stringify(updateUsers))
        for (let key in formData) {
            formData[key] = ''
        }
    };
    return (
        <div className={ styles.contactForms }>
            <form onSubmit={ props.handleSubmit(submit) }>
                <div className={ styles.inputBlock }>
                    <p className={ styles.inputTitle }>First Name:</p>
                    <Field className={ styles.contactInput } name='firstName' component={ Input } type='text' placeholder={ props.user.firstName } />
                </div>
                <div className={ styles.inputBlock }>
                    <p className={ styles.inputTitle }>Last name:</p>
                    <Field className={ styles.contactInput } name='lastName' component={ Input } type='text' placeholder={ props.user.lastName } />
                </div>
                <div className={ styles.inputBlock }>
                    <p className={ styles.inputTitle }>City:</p>
                    <Field className={ styles.contactInput } name='city' component={ Input } type='text' placeholder={ props.user.city } />
                </div>
                <div className={ styles.inputBlock }>
                    <p className={ styles.inputTitle }>Country:</p>
                    <Field className={ styles.contactInput } name='country' component={ Input } type='text' placeholder={ props.user.country } />
                </div>
                <div className={ styles.inputBlock }>
                    <p className={ styles.inputTitle }>Phone Number:</p>
                    <Field className={ styles.contactInput } name='phoneNumber' component={ Input } type='text' placeholder={ props.user.phoneNumber } validate={ [numValid] } />
                </div>
                <div className={ styles.inputBlock }>
                    <p className={ styles.inputTitle }>Email:</p>
                    <Field className={ styles.contactInput } name='email' component={ Input } type='text' placeholder={ props.user.email } validate={ [emailValid] }/>
                </div>
                <div className={ styles.inputBlock }>
                    <p className={ styles.inputTitle }>Website:</p>
                    <Field className={ styles.contactInput } name='website' component={ Input } type='text' placeholder={ props.user.website } />
                </div>
                <button className={ styles.saveContact } >Save Contact</button>
            </form>
        </div>
    )
}
const ContactForms = reduxForm({ form: 'contactDetails' })(ContactFormsF)

let ContactInfo = (props) => {
    const [userId, setUserId] = useState()

    useEffect(() => {
        if (!props.favorites.length && JSON.parse(localStorage.getItem('favorites')).length) {
            props.setFavoritesFromLS(JSON.parse(localStorage.getItem('favorites')))
        }
    }, [])

    const preventFavorites = useRef()
    preventFavorites.current = props.favorites

    useEffect(() => {
        setUserId(props.match.params.userId);
    }, [])


    const setFavorites = async (user) => {
        if (!props.favorites.some(item => item.id === user.id)) {
            await props.addToFavorites(user)
        } else {
            await props.removeFavorite(user)
        }
        localStorage.setItem('favorites', JSON.stringify(preventFavorites.current))
    }

    return <div className={styles.contact}>
        {props.users.map(u => {
            if (u.id === +userId) {
                return (
                    <div className={styles.contactInfo} key={u.id}>
                        <div className={styles.imgBlock}>
                            <img src={u.image} alt="profile" className={styles.photo}/>
                            <img
                                src={(props.favorites.length && props.favorites.some(item => item.id === u.id)) ? favIcon : nonfavIcon}
                                onClick={() => setFavorites(u)} alt="fav" className={styles.favIcon}/>
                        </div>

                        <ContactForms user={u} users={props.users} setUsers={props.setUsers}/>

                    </div>
                )
            }
        })}
    </div>
};
let mstp;
mstp = (state) => {
    return ({
        users: state.usersData.users,
        favorites: state.usersData.favorites
    });
};

export default  compose( 
connect(mstp, { addToFavorites, removeFavorite, setUsers, setFavoritesFromLS }),
withRouter
)(ContactInfo);