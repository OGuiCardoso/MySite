import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import Project from '../models/projects.js';

const router = express.Router();

router.route('/')
    .get(catchAsync(async (req, res) => {
        const projects = await Project.find({});
        const data = {
            url: req._parsedOriginalUrl.path
        }

        res.render('components/projects/index', { projects, data, title: 'Projects' });
    }));

router.route('/:id')
    .get(catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const project = await Project.findById(id);
        const data = {
            url: req._parsedOriginalUrl.path
        }
        res.render('components/projects/show', { project, data, title: project.title });
    }));


export default router;