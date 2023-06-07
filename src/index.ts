import { env } from '@/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import accountRouter from '@/routes/account';
import authRouter from '@/routes/auth';
import cookieParser from './middleware/cookieParser';

const { HOST, PORT } = env;

const app = express();

app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(helmet());
app.use('/auth', authRouter);
app.use('/accounts', accountRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${HOST}:${PORT}.`);
});
