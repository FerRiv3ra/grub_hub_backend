const mongoose = require('mongoose');

const dbConection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CNN);

        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error, cannot connect to database');
    }
}

module.exports = {
    dbConection
}