var express = require('express');
var router = express.Router();
var async = require('async');
const { body,validationResult } = require('express-validator');
require('dotenv').config();
const sendMail = require('../mail');

var Category = require('../models/category');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {

  Product.find({})
  .limit(8)
  .exec(function (err, list_products) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('index', { title: 'Vishal Traders', products: list_products });
  });
});

/* GET company profile page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Company profile' });
});

/* GET company contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

router.post('/contact', (req, res) => {
  const { name, fphone, email, description } = req.body;
  console.log('Data: ', req.body);

  sendMail(name, email, "New customer mail from website", `${description}\nPhone Number - ${fphone}`, function(err, data) {
      if (err) {
          res.render('contact', { title: 'Contact Us', error:"Internal Error" });
      } else {
          res.render('contact', { title: 'Contact Us', error:"Your response was successfully sent" });
      }
  });
});

/* GET catalogue page. */
router.get('/categories', function(req, res, next) {
  Category.find({})
  .exec(function (err, categories) {
    if (err) { return next(err); }
    res.render('categories', { title: 'Our Catalogue', categories: categories });
  });
});

/* GET sub-catagory page. */
router.get('/categories/:url', function(req, res, next) {
  Category.findOne({urlString: req.params.url})
  .exec(function (err, Category) {
    if (err) { return next(err); }
      Product.find({Category: Category._id})
      .exec(function (err, Products) {
        if (err) { return next(err); }
        res.render('Category_detail', { title: Category.name, Category: Category, Products: Products });
      });
  });
});

/* GET product page. */
router.get('/products/:id', function(req, res, next) {
  Product.findById(req.params.id)
  .exec(function (err, product) {

    Product.find({Category: product.Category, _id: {$ne: product._id}})
    .limit(4)
    .exec(function (err, list_products) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('product_detail', { title: product.name, products: list_products, product: product });
    });
  });
});

router.post('/search', (req, res) => {
  const { searchInput } = req.body;
  console.log('Data: ', req.body);

  Product.find({$text: {$search: searchInput}})
  .limit(12)
  .exec(function (err, list_products) {
    if (err) { return next(err); }
    
    res.render('search', { title: 'Search Results', products: list_products, query: searchInput });
  });
});

module.exports = router;
