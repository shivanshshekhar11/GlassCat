var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var subCategorySchema = new Schema(
    {
        name: {type:String, required:true},
        description: {type:String, required:true},
        urlstring: {type:String, required:true},
        category: {type:Schema.Types.ObjectId, ref:"Category", required:true}
    }
);

subCategorySchema.virtual("url").get(function(){
    return "/categories/"+this.urlstring;
});

module.exports = mongoose.model("SubCategory", subCategorySchema);