import React from 'react'; 
import styles from './FormControls.module.css';

export const Input = ({ input, meta: {error: hasError}, ...props }) => {
    return<div className={styles.formControl + ' ' + (hasError ? styles.error : '')}>
        <div><input type="text" {...input} {...props} autoComplete="off"/></div>
        {hasError && <span>{hasError}</span>}
    </div>
};