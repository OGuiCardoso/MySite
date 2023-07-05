import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import engine from 'ejs-mate';
import mongoose from "mongoose";

import Project from "./models/projects.js";

async function conectDb() {
    mongoose.connect('mongodb://127.0.0.1:27017/mysite');
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

app.get('/', (req, res) => {
    res.render('components/home')
});

app.get('/aboutme', (req, res) => {
    res.render('components/index')
});
app.get('/projects/new', (req, res) => {
    res.render('components/new')
})

app.post('/projects', async (req, res) => {
    const project = new Project(req.body);
    await project.save();
    res.redirect('/projects')
})
app.get('/projects/:id', async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.render('components/show', { project });
})
app.get('/projects', async (req, res) => {
    const projects = await Project.find({});
    console.log(projects)
    res.render('components/projects', { projects });
});


const port = 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});