const mongoose = require("mongoose");
const DB_NAME = require("../constants.js")
const connectDataBase = async () => {
    try{
        const uri = `${process.env.MONGO_URI}/${DB_NAME}`
        console.log(uri);
        const response = await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        return response;
    }catch(error){
        console.log("INternal Server Error" ,error);
    }
}

module.exports = connectDataBase;