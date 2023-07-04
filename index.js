import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import engine from 'ejs-mate';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('components/home')
})

const port = 3000
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})