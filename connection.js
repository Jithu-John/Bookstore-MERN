const mongoose = require("mongoose")

const connectionString = process.env.CONNECTIONSTRING

mongoose.connect(connectionString).then(res => {
    console.log(`MongoDB connected Successfully`);
    
}).catch(err => {
    console.log(`MongoDB connected failed due to ${err}`);
    
})