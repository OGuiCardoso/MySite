import dotenv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import engine from 'ejs-mate';
import mongoose from "mongoose";
import methodOverride from 'method-override';
import session from "express-session";
import adminRoutes from './routes/admin.js';
import projectRoutes from './routes/preojects.js'
import loginRoutes from './routes/login.js';
import ExpressError from './utils/ExpressError.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import MongoDbStore from 'connect-mongo';

const dbUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mysite'

async function conectDb() {
    await mongoose.connect(dbUrl);
    console.log('Data base connected')
};
conectDb().catch(e => console.log(e));

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const store = MongoDbStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
})
store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

app.use(session({
    store: store,
    name: 'rvdibm',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(mongoSanitize());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dbu0iwr3h/",
                "https://images.unsplash.com",
            ],
        },
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user
    res.locals.title = ''
    next()
});

app.get('/', (req, res) => {
    res.render('components/home')
});

app.get('/aboutme', (req, res) => {
    const data = {
        url: req.path
    }
    res.render('components/aboutMe', { data, title: 'AboutMe' })
});

app.use('/admin', adminRoutes);

app.use('/projects', projectRoutes);

app.use('/login', loginRoutes);

app.post('/logout', (req, res) => {
    req.session.user = false
    res.redirect('/projects')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const status = err.status ? err.status : 500;
    const data = {
        url: req.path,
    }
    res.status(status).render('error', { data })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});