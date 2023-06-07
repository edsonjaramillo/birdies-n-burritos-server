import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from '@/env';
import cookieParser from '@/middleware/cookieParser';
import accountRouter from '@/routes/account';
import authRouter from '@/routes/auth';

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
