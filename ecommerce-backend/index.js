import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';

import userRoute from './_routes/user.route.js';
import categoryRoute from './_routes/category.route.js';
import productRoute from './_routes/product.route.js';

dotenv.config()
const PORT = process.env.PORT || 3000;
const developmentSrv = process.env.dbUrl

mongoose.set('strictQuery', false);
mongoose.connect(developmentSrv, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((connected) => {
    console.log('Mongodb connected successfully.');
}).catch((err) => {
    console.log(err);
});

const app = express();
app.use(cors());
app.use(morgan("dev"))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app)

userRoute(app);
categoryRoute(app);
productRoute(app);

app.get("/", (req, res) => {
    res.status(200).json(`Backend version 1.0.0 working `);
});
server.listen(PORT, () => {
    console.log(`Backend server listening at ${PORT}`);
});