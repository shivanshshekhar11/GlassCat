var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categorySchema = new Schema(
    {
        name: {type:String, required:true},
        description: {type:String, required:true},
        urlstring: {type:String, required:true}
    }
);

categorySchema.virtual("url").get(function(){
    return "/"+this.urlstring;
});

module.exports = mongoose.model("Category", categorySchema);