import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_NAME,
    })
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`))
    .then(() => console.log('MongoDB 연결에 성공하였습니다.'));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

export default connect;
