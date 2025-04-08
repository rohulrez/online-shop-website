const { post } = require("../routes/auth-routes");

const db = require('../data/database');
const bcrypt = require('bcryptjs');

class User {
    constructor(email, password, fullName, street, postal, city) {
        this.email = email;
        this.password = password;
        this.name = fullName;
        this.address = {
            street: street, 
            postalCode: postal, 
            city: city
        };
    };

    getUserWithSameEmail = async() => {
        return db.getDb().collection('users').findOne({email: this.email});
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();

        if(existingUser) {
            return true;
        } 
        
        return false;
        
    }

    signup = async() => {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            address: this.address
        })
    }

    hasMatchingPassword= async(hashedPassword) => {
        return bcrypt.compare(this.password, hashedPassword);
    }

}

module.exports = User;