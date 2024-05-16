import express from 'express';
import connect from './src/schemas/index.js';
import GoodsRouter from './src/routers/GoodsRouter.js';
import errorHandlerMiddleware from './src/middlewarmies/error.handler.middleware.js';

const app = express();
const PORT = 3300;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req, res, next) => {
  return res.json({ message: 'Welcome to MDshop' });
});

app.use('/api', [router, GoodsRouter]);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
