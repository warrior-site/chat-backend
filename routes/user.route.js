import express from 'express';
import multer from 'multer';
import { profile } from '../controllers/user.controller.js';

const Router = express.Router();
const upload = multer({ dest: 'uploads/' });

Router.post('/profile', upload.single("file"), profile);

export default Router;
