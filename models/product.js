var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema(
    {
        name: {type:String, required:true},
        price: {type:String},
        model_no: {type:String},
        make: {type:String},
        minOrder: {type:String, required:true},
        material: {type:String},
        paymentTerms: {type:String, required:true},
        export: {type:String},
        domestic: {type:String},
        deliveryTime: {type:String, required:true},
        description: {type:String, required:true},
        image: {type:String, required:true},
        subCategory: {type:Schema.Types.ObjectId, ref:"SubCategory", required:true},
    }
);

productSchema.virtual("url").get(function(){
    return '/products/' + this._id;
});

module.exports = mongoose.model("Product", productSchema);