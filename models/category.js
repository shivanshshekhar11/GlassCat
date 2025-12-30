var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: {type:String, required:true},
        description: {type:String, required:true},
        urlString:{type:String, required:true, unique:true}
    }
);

CategorySchema.virtual("url").get(function(){
    return "/categories/"+this.name.split(" ").join("-").toLowerCase();
});

module.exports = mongoose.model("Category", CategorySchema);