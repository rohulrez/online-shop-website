const mongodb = require('mongodb');
const db = require('../data/database');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price =  +productData.price;
        this.description = productData.description;
        this.image = productData.image;
        this.updateImageData();
        if(productData._id) {
            this.id = productData._id.toString();
        };
    }

static async findAll () {
    const products = await db.getDb().collection('products').find().toArray();

    return products.map(function(productDocument) {
        return new Product(productDocument)
    });
}

static async findMultiple(ids) {
    const productIds = ids.map(function(id) {
        return new mongodb.ObjectId(id);
      });

      const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
}


updateImageData () {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
}

static async findById(productId) {
    let proId;
    try {
        proId = new mongodb.ObjectId(productId);
    } catch(error) {
        throw error;
    }


    const product = await db
    .getDb()
    .collection('products')
    .findOne({_id: proId});
    
    if(!product) {
        const error = new Error('Could not find product with provided id.');
        error.code = 404;
        throw error;
    }
    return new Product(product);
}


async save() {
    const productData = {
        title : this.title,
        summary: this.summary,
        price: this.price,
        description: this.description,
        image: this.image
    }


    if(this.id) {
        const productId = new mongodb.ObjectId(this.id)

        if(!this.image) {
        delete productData.image;
        }

        await db.getDb().collection('products').updateOne({_id: productId}, {
            $set: productData
        });
    } else{
        await db.getDb().collection('products').insertOne(productData)
    }
}

async replaceImage (newImage) {
    this.image = newImage;
    this.updateImageData();
}

async remove() {
    const productId = new mongodb.ObjectId(this.id);
    await db.getDb().collection('products').deleteOne({_id: productId})
}


}

module.exports = Product;