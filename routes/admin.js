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
        res.render('components/projects/new', { data })
    });

router.route('/projects/:id/edit')
    .get(catchAsync(async (req, res) => {
        const { id } = req.params;
        const project = await Project.findById(id);
        const data = {
            url: req.path
        }
        res.render('components/projects/edit', { project, data })
    }));

router.route('/projects')
    .post(isloggedIn, upload.single('image'), catchAsync(async (req, res) => {
        const project = new Project(req.body);
        project.image.url = req.file.path;
        project.image.filename = req.file.filename
        await project.save();
        res.redirect('/projects',)
    }));

router.route('/projects/:id')
    .put(isloggedIn, upload.single('image'), catchAsync(async (req, res) => {
        const { id } = req.params;
        const project = await Project.findByIdAndUpdate(id, req.body);
        if (req.file) {
            const { path, filename } = req.file
            project.image.url = path;
            project.image.filename = filename;
            await project.save();
        }
        res.redirect(`/projects/${id}`);
    }))
    .delete(isloggedIn, catchAsync(async (req, res) => {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.redirect('/projects');
    }))

export default router

