import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import engine from 'ejs-mate';
import mongoose from "mongoose";
import methodOverride from 'method-override';
import session from "express-session";
import bcrypt from 'bcrypt';

import Project from "./models/projects.js";
import User from "./models/user.js";

async function conectDb() {
    await mongoose.connect('mongodb://127.0.0.1:27017/mysite');
    console.log('Data base connected');
};
conectDb().catch(e => console.log(e));

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use(session({
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
})
//middleware session
function isloggedIn(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/projects')
    }
    next();
}
//catch async
const catchAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next)
    }
}


app.get('/', (req, res) => {
    res.render('components/home')
});

app.get('/aboutme', (req, res) => {
    res.render('components/index')
});




//Projects routes
app.get('/admin/projects/new', isloggedIn, (req, res) => {
    res.render('components/projects/new')
});
app.post('/projects', isloggedIn, catchAsync(async (req, res) => {
    const project = new Project(req.body);
    await project.save();
    res.redirect('/projects')
}));
app.get('/projects/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.render('components/projects/show', { project });
}));
app.get('/projects', catchAsync(async (req, res) => {
    const projects = await Project.find({});
    res.render('components/projects/index', { projects });
}));
app.get('/admin/projects/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.render('components/projects/edit', { project })
}));
app.put('/projects/:id', isloggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndUpdate(id, req.body);
    res.redirect(`/projects/${id}`);
}))
app.delete('/projects/:id', isloggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.redirect('/projects');
}))



//Login route
app.get('/login', (req, res) => {
    res.render('components/user/login')
})
app.post('/login', catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.redirect('/login')
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        req.session.user = true
    }
    res.redirect('/projects')
}))
app.post('/logout', (req, res) => {
    req.session.user = false
    res.redirect('/projects')
})

app.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).send(message)
})



const port = 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});