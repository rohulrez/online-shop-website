isEmpty = (value) => {
    return !value || value.trim() === '';
}

useCredntAreValid = (email, password) => {
    return ( email && email.includes('@') 
    && password.trim().length >= 6)
};

userDetailsAreValid = (email, password, name, street, postal, city) => {
    return(
    useCredntAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
)
}

emailIsConfirmed = (email, confimEmail) => {
    return email === confimEmail;
}

module.export = {
    userDetailsAreValid: userDetailsAreValid,
    emailIsConfirmed: emailIsConfirmed
}