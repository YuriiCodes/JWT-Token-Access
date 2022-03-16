const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRouter  = require('./authRouter.js');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use("/auth", authRouter);

app.get('/', (req, res) =>{
    res.send('HEllo!')
});

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.vsx2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        app.listen(PORT, () => {
            console.log(`Server is up and running on port ${PORT}`);
        })
    } catch (err) {
        console.log(err)
    }
}

start();