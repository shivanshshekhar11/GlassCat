var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema(
    {
        name: {type:String, required:true},
        description: {type:String, required:true},
        image: {type:String, required:true},
        Category: {type:Schema.Types.ObjectId, ref:"Category", required:true},
    }
);

productSchema.virtual("url").get(function(){
    return '/products/' + this._id;
});

module.exports = mongoose.model("Product", productSchema);