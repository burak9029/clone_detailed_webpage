const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


//veritabani urun modeli

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock:Number,
})

const Product = mongoose.model('Product', ProductSchema)

//urun olusturma

app.post('/product', async(req,res) =>{
    const { name, description, price, category, stock} = req.body;
    const newProduct = new ProductSchema({ name, description, price, category, stock});
    await newProduct.save();
    res.json(newProduct);
});

//arama ve filtreleme

app.get('/product', async (req,res) => {
    const { search, category } = req.query;

    const filter = {};
    if(search) filter.name = new RegExp(search , 'i');
    if(category) filter.category = category;

    const products = await Product.find(filter);
    res.json(products);
});


//product id si alma

