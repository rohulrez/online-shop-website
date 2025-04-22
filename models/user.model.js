const { post, use } = require("../routes/auth-routes");

const db = require('../data/database');
const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

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


    static findById (userId) {
        const uid = new mongodb.ObjectId(userId);

        return db
        .getDb()
        .collection('users')
        .findOne({_id : uid}, {projection: {password: 0} })
    }

    async getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({email: this.email});
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();

        if(existingUser) {
            return true;
        } 
        
        return false;
        
    }

    async signup() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            address: this.address
        })
    }

    async hasMatchingPassword(hashedPassword){
        return bcrypt.compare(this.password, hashedPassword);
    }

}

module.exports = User;