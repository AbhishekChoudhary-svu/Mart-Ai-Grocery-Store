import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import userRoutes from './routes/user.route.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import myListRouter from './routes/mylist.route.js';
import addressRouter from './routes/address.route.js';
import homeSliderRouter from './routes/homeSlider.route.js';
import adsBannerRouter from './routes/adsBanner.route.js';
import orderRouter from './routes/order.route.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));



app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' +  process.env.PORT });
}); 
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/mylist', myListRouter);
app.use('/api/address', addressRouter);
app.use('/api/homeSlides', homeSliderRouter);
app.use('/api/Banner', adsBannerRouter);
app.use('/api/order', orderRouter);


connectDB().then(() => {
  
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})  