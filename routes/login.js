import express from 'express';
import User from '../models/user.js';
import catchAsync from '../utils/catchAsync.js';
import bcrypt from 'bcrypt';


const router = express.Router();

router.route('/')
    .get((req, res) => {
        const data = {
            url: req.path
        }
        res.render('components/user/login', { data })
    })
    .post(catchAsync(async (req, res) => {
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

export default router;