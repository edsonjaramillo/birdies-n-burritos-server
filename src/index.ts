import { env } from '@/env';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import accountRouter from '@/routes/account';

const { HOST, PORT } = env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(helmet());
app.use('/accounts', accountRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${HOST}:${PORT}.`);
});
