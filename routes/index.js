var express = require('express');
var router = express.Router();
var async = require('async');
const { body,validationResult } = require('express-validator');
require('dotenv').config();

var Category = require('../models/category');
var SubCategory = require('../models/subCategory');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {

  Product.find({})
  .exec(function (err, list_products) {
    if (err) { return next(err); }
    //Successful, so render
    if(list_products.length > 8){
      list_products = list_products.slice(0,8);
      res.render('index', { title: 'Asha Scientific Works', products: list_products });
    }
    else{
      res.render('index', { title: 'Asha Scientific Works', products: list_products });
    }
  });
});

/* GET company profile page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Asha Scientific Works' });
});

/* GET company contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Asha Scientific Works' });
});

/* GET catalogue page. */
router.get('/categories', function(req, res, next) {
  Category.find({})
  .exec(function (err, categories) {
    if (err) { return next(err); }
      SubCategory.find({})
      .populate('category')
      .exec(function (err, subCategories) {
        if (err) { return next(err); }
        res.render('categories', { title: 'Asha Scientific Works', categories: categories, subCategories: subCategories });
      });
  });
});

/* GET sub-catagory page. */
router.get('/categories/:url', function(req, res, next) {
  SubCategory.findOne({url: req.params.url})
  .exec(function (err, subCategory) {
    if (err) { return next(err); }
      Product.find({subCategory: subCategory._id})
      .exec(function (err, Products) {
        if (err) { return next(err); }
        res.render('subCategory_detail', { title: 'Asha Scientific Works', subCategory: subCategory, Products: Products });
      });
  });
});

/* GET product page. */
router.get('/products/:id', function(req, res, next) {
  Product.findById(req.params.id)
  .exec(function (err, product) {

    Product.find({subCategory: product.subCategory})
    .exec(function (err, list_products) {
      if (err) { return next(err); }
      //Successful, so render
      if(list_products.length > 4){
        list_products = list_products.slice(0,4);
        res.render('product_detail', { title: 'Asha Scientific Works', products: list_products, product: product });
      }
      else{
        res.render('product_detail', { title: 'Asha Scientific Works', products: list_products, product: product });
      }
    });
  });
});

module.exports = router;
