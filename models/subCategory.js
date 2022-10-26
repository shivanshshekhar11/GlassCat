var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var subCategorySchema = new Schema(
    {
        name: {type:String, required:true},
        description: {type:String, required:true},
        category: {type:Schema.Types.ObjectId, ref:"Category", required:true},
        urlString:{type:String, required:true}
    }
);

subCategorySchema.virtual("url").get(function(){
    return "/categories/"+this.name.split(" ").join("-").toLowerCase();
});

module.exports = mongoose.model("SubCategory", subCategorySchema);