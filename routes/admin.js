var express = require('express');
var router = express.Router();
var async = require('async');
const { body,validationResult } = require('express-validator');
require('dotenv').config();

var Category = require('../models/category');
var SubCategory = require('../models/subCategory');
var Product = require('../models/product');

// GET admin home page.
router.get('/', function(req, res) {

  async.parallel({
      cat_count: function(callback) {
          Category.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },

      subcat_count: function(callback) {
          SubCategory.countDocuments({}, callback);
      },

      prod_count: function(callback) {
          Product.countDocuments({}, callback);
      }
  }, function(err, results) {
      res.render('admin', { title: 'Welcome Administrator', error: err, data: results });
  });
});

router.get('/category', function(req, res) {
  res.render("category_form",{title: "Create a new category"});
});

// Handle category create on POST.
router.post('/category',  [

  // Validate and sanitize fields.
  body('name', 'Category name required').trim().isLength({ min: 1 }),
  body('description', 'Description required').trim().isLength({ min: 1 }),
  body('urlstring', 'urlstring required').trim().isLength({ min: 1 }),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Create a category object with escaped and trimmed data.
    var category = new Category(
        { name: req.body.name,
          description: req.body.description,
          urlstring: req.body.urlstring
        }
    );

    if(req.body.password===process.env.password){

        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('category_form', { title: 'Create a new category', category: category, errors: errors.array()});
          return;
        }
        else {
          // Data from form is valid.
          // Check if category with same name already exists.
          Category.findOne({ 'name': req.body.name })
            .exec( function(err, found) {
              if (err) { return next(err); }
    
              if (found) {
                res.render('category_form', { title: 'Create a new category', errors: Array.from([{msg: 'Category already exists'}])});
              }
              else {
    
                category.save(function (err) {
                  if (err) { return next(err); }
                  res.render('category_form', { title: 'Create a new category', errors: Array.from([{msg: 'Category saved successfully'}])});
                });
    
              }
    
            });
        }
    }

    else{
      res.render('category_form', { title: 'Create a new category', category: category, errors: Array.from([{msg: 'Wrong password'}])});
    }
  }
]);

// Display sub-category create form on GET.
router.get('/sub-category', function(req, res) {

  // Get all categories.
  async.parallel({
      categories: function(callback) {
          Category.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('subCategory_form', { title: 'Create a new sub category', categories: results.categories });
  });
});

// Handle category create on POST.
router.post('/sub-category',  [

  // Validate and sanitize fields.
  body('name', 'Sub-Category name required').trim().isLength({ min: 1 }),
  body('description', 'Description required').trim().isLength({ min: 1 }),
  body('urlstring', 'urlstring required').trim().isLength({ min: 1 }),

  // Process request after validation and sanitization.
  (req, res, next) => {
    async.parallel({
      categories: function(callback) {
          Category.find(callback);
      },
    }, function(err, results) {
      if (err) { return next(err); }

      // Create a category object with escaped and trimmed data.
      var subCategory = new SubCategory(
          { name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            urlstring: req.body.urlstring
          }
      );

      if(req.body.password===process.env.password){

          // Extract the validation errors from a request.
          const errors = validationResult(req);
      
          if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('subCategory_form', { title: 'Create a new sub-category', subCategory: subCategory, categories: results.categories, errors: errors.array()});
            return;
          }
          else {
            subCategory.save(function (err) {
              if (err) { return next(err); }

              res.render('subCategory_form', { title: 'Create a new sub-category', categories: results.categories, errors: Array.from([{msg: 'Sub-Category saved successfully'}])});
            });
          }
      }

      else{
        res.render('subCategory_form', { title: 'Create a new sub-category', subCategory: subCategory, categories: results.categories, errors: Array.from([{msg: 'Wrong password'}])});
      }
    });
  }
]);

// Display product create form on GET.
router.get('/product', function(req, res) {

  // Get all sub-categories.
  async.parallel({
      subCategories: function(callback) {
          SubCategory.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('product_form', { title: 'Create a new product', subCategories: results.subCategories });
  });
});

// Handle category create on POST.
router.post('/product',  [

  // Validate and sanitize fields.
  body('name', 'Product name required').trim().isLength({ min: 1 }),
  body('price').trim(),
  body('minOrder', 'Minimum order quantity required').trim().isLength({ min: 1 }),
  body('technology').trim(),
  body('material').trim(),
  body('weight', 'Weight required').trim().isLength({ min: 1 }),
  body('drivenMethod').trim(),
  body('paymentTerms', 'Payment terms required').trim().isLength({ min: 1 }),
  body('export').trim(),
  body('domestic').trim(),
  body('supply', 'Supply time required').trim().isLength({ min: 1 }),
  body('deliveryTime', 'Delivery time required').trim().isLength({ min: 1 }),
  body('description', 'Description required').trim().isLength({ min: 1 }),
  body('image', 'Image link required').trim().isLength({ min: 1 }),

  // Process request after validation and sanitization.
  (req, res, next) => {
    async.parallel({
      subCategories: function(callback) {
          SubCategory.find(callback);
      },
    }, function(err, results) {
      if (err) { return next(err); }

      // Create a category object with escaped and trimmed data.
      var product = new Product(
          { name: req.body.name,
            price: req.body.price,
            minOrder: req.body.minOrder,
            technology: req.body.technology,
            material: req.body.material,
            weight: req.body.weight,
            drivenMethod: req.body.drivenMethod,
            paymentTerms: req.body.paymentTerms,
            export: req.body.export,
            domestic: req.body.domestic,
            supply: req.body.supply,
            deliveryTime: req.body.deliveryTime,
            description: req.body.description,
            image: req.body.image,
            subCategory: req.body.subCategory,
          }
      );

      if(req.body.password===process.env.password){

          // Extract the validation errors from a request.
          const errors = validationResult(req);
      
          if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('product_form', { title: 'Create a new product', product: product, subCategories: results.subCategories, errors: errors.array()});
            return;
          }
          else {
            product.save(function (err) {
              if (err) { return next(err); }

              res.render('product_form', { title: 'Create a new product', subCategories: results.subCategories, errors: Array.from([{msg: 'Product saved successfully'}])});
            });
          }
      }

      else{
        res.render('product_form', { title: 'Create a new product', subCategories: results.subCategories, errors: Array.from([{msg: 'Wrong password'}])});
      }
    });
  }
]);

module.exports = router;
