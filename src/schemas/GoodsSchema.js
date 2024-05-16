import mongoose from 'mongoose';

const GoodsSchema = new mongoose.Schema({
  goodsId: {
    // 상품ID
    type: Number,
    required: true,
  },
  goodsPw: {
    // 상품PW
    type: String,
    required: true,
  },
  person: {
    // 담당자
    type: String,
    required: true, // order 필드 또한 필수 요소입니다.
  },
  goods: {
    // 상품명
    type: String,
    required: true, // value 필드는 필수 요소입니다.
  },
  manual: {
    // 상품 설명
    type: String,
    required: true, // order 필드 또한 필수 요소입니다.
  },
  condition: {
    // 상품 상태
    type: String,
    required: true, // order 필드 또한 필수 요소입니다.
  },
  uploadAt: {
    // 생성 날짜
    type: Date,
    required: true,
  },
  updateAt: {
    // 수정 날짜
    type: Date,
    required: false, // updateAt 필드는 필수 요소가 아닙니다.
    // 완료가 되지않았다면 null 이기때문에 필수를 false로 설정
  },
});

// Goods 모델 생성
export default mongoose.model('Goods', GoodsSchema);
