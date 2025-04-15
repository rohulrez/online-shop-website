function isEmpty(value) {
    return !value || (typeof value === 'string' && value.trim() === '');
}

function isValidEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;;
    return email && emailRegex.test(email);
}

function isStrongPassword(password) {
    return password && password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
}

function isValidPostalCode(postal) {
    return postal && /^[0-9]{4,6}$/.test(postal.trim());
}

function userCredentialsAreValid(email, password) {
    return isValidEmail(email) && isStrongPassword(password);
}

function userDetailsAreValid(email, password, name, street, postal, city) {
    return (
        userCredentialsAreValid(email, password) &&
        !isEmpty(name) &&
        !isEmpty(street) &&
        isValidPostalCode(postal) &&
        !isEmpty(city)
    );
}

function emailIsConfirmed(email, confirmEmail) {
    return email === confirmEmail;
}

module.exports = {
    userDetailsAreValid,
    emailIsConfirmed,
    isValidEmail,
    isStrongPassword,
    isValidPostalCode
};
