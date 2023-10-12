var express = require('express');
var router = express.Router();
var async = require('async');
const { body,validationResult } = require('express-validator');
require('dotenv').config();

var Category = require('../models/category');
var Product = require('../models/product');

// GET admin home page.
router.get('/', function(req, res) {

  async.parallel({
      cat_count: function(callback) {
          Category.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },

      prod_count: function(callback) {
          Product.countDocuments({}, callback);
      }
  }, function(err, results) {
      res.render('admin', { title: 'Welcome Administrator', error: err, data: results });
  });
});

// Display sub-category create form on GET.
router.get('/category', function(req, res) {
  res.render('category_form', { title: 'Create a new category' });
});

// Handle category create on POST.
router.post('/category',  [

  // Validate and sanitize fields.
  body('name', 'Category name required').trim().isLength({ min: 1 }),
  body('description', 'Description required').trim().isLength({ min: 1 }),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Create a category object with escaped and trimmed data.
      var category = new Category(
          { name: req.body.name,
            description: req.body.description,
            urlString: String(req.body.name).split(" ").join("-").toLocaleLowerCase()
          }
      );

      if(req.body.password===process.env.password){

          // Extract the validation errors from a request.
          const errors = validationResult(req);
      
          if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('Category_form', { title: 'Create a new category', Category: category, errors: errors.array()});
            return;
          }
          else {
            category.save(function (err) {
              if (err) { return next(err); }

              res.render('Category_form', { title: 'Create a new category', errors: Array.from([{msg: 'Category saved successfully'}])});
            });
          }
      }

      else{
        res.render('Category_form', { title: 'Create a new category', Category: category, errors: Array.from([{msg: 'Wrong password'}])});
      }
    }
  
]);

// Display product create form on GET.
router.get('/product', function(req, res) {

  // Get all sub-categories.
  async.parallel({
      Categories: function(callback) {
          Category.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('product_form', { title: 'Create a new product', Categories: results.Categories });
  });
});

// Handle category create on POST.
router.post('/product',  [

  // Validate and sanitize fields.
  body('name', 'Product name required').trim().isLength({ min: 1 }),
  body('description', 'Description required').trim().isLength({ min: 1 }),
  body('image', 'Image link required').trim().isLength({ min: 1 }),

  // Process request after validation and sanitization.
  (req, res, next) => {
    async.parallel({
      Categories: function(callback) {
          Category.find(callback);
      },
    }, function(err, results) {
      if (err) { return next(err); }

      // Create a category object with escaped and trimmed data.
      var product = new Product(
          { name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            Category: req.body.Category,
          }
      );

      if(req.body.password===process.env.password){

          // Extract the validation errors from a request.
          const errors = validationResult(req);
      
          if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('product_form', { title: 'Create a new product', product: product, Categories: results.Categories, errors: errors.array()});
            return;
          }
          else {
            product.save(function (err) {
              if (err) { return next(err); }

              res.render('product_form', { title: 'Create a new product', Categories: results.Categories, errors: Array.from([{msg: 'Product saved successfully'}])});
            });
          }
      }

      else{
        res.render('product_form', { title: 'Create a new product', Categories: results.Categories, errors: Array.from([{msg: 'Wrong password'}])});
      }
    });
  }
]);

module.exports = router;
