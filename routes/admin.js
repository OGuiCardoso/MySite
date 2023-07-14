import express from 'express';
import multer from 'multer';
import { storage } from '../cloudinary/index.js';
import isloggedIn from '../utils/verifyLogin.js';
import catchAsync from '../utils/catchAsync.js';
import Project from '../models/projects.js';

const upload = multer({ storage });
const router = express.Router();



router.route('/projects/new')
    .get(isloggedIn, (req, res) => {
        const data = {
            url: req.path
        }
        res.render('components/projects/new', { data, title: 'New project' })
    });

router.route('/projects/:id/edit')
    .get(catchAsync(async (req, res) => {
        const { id } = req.params;
        const project = await Project.findById(id);
        const data = {
            url: req.path
        }
        res.render('components/projects/edit', { project, data, title: `Edit ${project.title}` })
    }));

router.route('/projects')
    .post(isloggedIn, upload.single('image'), catchAsync(async (req, res) => {
        const { title, description, link, repository } = req.body
        const project = new Project({ title, description, link, repository });
        project.image.url = req.file.path;
        project.image.filename = req.file.filename;
        const text = req.body.text.split("\r\n");
        const technologies = req.body.technologies.split("\r\n");
        project.text = text;
        project.technologies = technologies;
        await project.save();
        res.redirect('/projects',)
    }));

router.route('/projects/:id')
    .put(isloggedIn, upload.single('image'), catchAsync(async (req, res) => {
        const { id } = req.params;
        const { title, description, link, repository } = req.body
        const project = await Project.findByIdAndUpdate(id, { title, description, link, repository });
        if (req.file) {
            const { path, filename } = req.file
            project.image.url = path;
            project.image.filename = filename;
            await project.save();
        }
        const text = req.body.text.split("\r\n");
        const technologies = req.body.technologies.split("\r\n");
        project.text = text;
        project.technologies = technologies;
        await project.save();
        res.redirect(`/projects/${id}`);
    }))
    .delete(isloggedIn, catchAsync(async (req, res) => {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.redirect('/projects');
    }))

export default router

