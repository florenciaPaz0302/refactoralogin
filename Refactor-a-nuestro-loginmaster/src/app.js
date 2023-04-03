import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import viewsRouter from './routes/views.routes.js';

import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import initializePassport from "./config/passport.config.js";
import passport from "passport";

const app = express();
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://barbaraledezma:coderhouse@cluster0.10fjhte.mongodb.net/?retryWrites=true&w=majority', (err) => {
    if(err){
        console.log('Error al conectar a MongoDB', err)
    } else {
        console.log('Conectado a MongoDB')
    }
})

// handlebars
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'hbs')
app.set('views', `${__dirname}/views`)

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://barbaraledezma:coderhouse@cluster0.10fjhte.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60
    }),
    secret: 'eApp',
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(`${__dirname}/public`))

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartsRoutes);
app.use('/session', sessionRoutes);
app.use('/', viewsRouter);
app.get('*', (req, res) => { res.status(404).send('404 not found')})

app.listen(3000, () => console.log('Server up in port 3000'))

