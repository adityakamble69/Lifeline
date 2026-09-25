import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import v1Routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.use('/api/v1', v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Lifeline backend listening on http://localhost:${PORT}`);
});
