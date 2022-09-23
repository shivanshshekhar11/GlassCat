var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema(
    {
        name: {type:String, required:true},
        price: {type:String},
        minOrder: {type:String, required:true},
        technology: {type:String},
        material: {type:String},
        weight: {type:String, required:true},
        drivenMethod: {type:String},
        paymentTerms: {type:String, required:true},
        export: {type:String},
        domestic: {type:String},
        supply: {type:String, required:true},
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