export const emailValid = (value) => { 
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) && !!value) { 
        return 'Incorrect email'
    }
}
 
export const numValid = (value) => {   
    if(!/^\+?[0-9]{6,16}$/i.test(value) && !!value){ 
        return 'Incorrect phone number'
    }
};  
 