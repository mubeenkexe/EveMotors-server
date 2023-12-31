import express from 'express';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import adminRouter from './routes/admin.routes.js';
import mainRouter from './routes/main.routes.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import multer from 'multer';

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());


const upload = multer();

app.use(upload.array());
app.use(cors({
    origin: ['https://eve-motors-app.vercel.app']
}));

config();
connectDB();


app.use('/admin', adminRouter)
app.use('/main', mainRouter)

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

export default app;
