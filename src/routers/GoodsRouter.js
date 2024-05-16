import express from 'express';
import joi from 'joi';
import Goods from '../schemas/GoodsSchema.js';

const router = express.Router();



//유효성 검사에 실패했을 때, 에러가 발생해야 한다.
//검증을 진행할때 비동기적으로 진행해야 한다. .validateAsync(req.body)
const createdGoodsSchema = joi.object({
  goods: joi.string().min(1).max(30).required(),
  manual: joi.string().min(1).max(50).required(),
  person: joi.string().min(1).max(10).required(),
  goodsPw: joi.string().min(1).max(10).required(),
});

// 상품등록 API
router.post('/goods', async (req, res, next) => {
  try {
    // 클라이언트로 부터 받아온 value 데이터를 가져온다.
    const validation = await createdGoodsSchema.validateAsync(req.body);
    const { goods, manual, person, goodsPw } = validation;
    // 만약, 클라이언트가 value 데이터를 전달하지 않았을 때, 클라이언트에게 에러 메시지를 전달한다.

    // 해당하는 마지막 goodsId 데이터를 조회한다.
    // findeOne = 1개의 데이터만 조회한다.
    // sort = 정령한다. -> 어떤 컬럼을?
    const goodsMaxId = await Goods.findOne().sort('-goodsId').exec();
    // order 만 하면 오름차순 -order 하면 내림차순
    // 몽구스로 조회할때는 exec 로 조회하면 좀더 정상적으로 조회할 수 있다.
    // exec()가 없으면 프로미스로 동작하지 않게 되며 프로미스로 동작하지 않는다는건
    // await 을 사용할 수 없다.

    // 3. 만약 존재한다면 ID +1 하고, 아니면 1로 할당한다.
    const goodsId = goodsMaxId ? goodsMaxId.goodsId + 1 : 1;
    const condition = 'FOR_SALE';
    const uploadAt = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Seoul',
    });
    const updateAt = null;

    // 4. 상품 등록
    const loadGoods = new Goods({
      goods,
      manual,
      person,
      goodsId,
      goodsPw,
      condition,
      uploadAt,
      updateAt,
    }); // todo 인스턴스 형식으로 만든것이고
    await loadGoods.save(); // 데이터베이스에 저장한다.

    // 5. 해야할 일을 클라이언트에게 반환한다.
    return res.status(201).json({ loadGoods: loadGoods }); // loadGoods 없애는거 고려해보기
  } catch (error) {
    // 서버가 중단되지 않기위해 위를 try로 묶어주고 아래 catch 구문을 하여 에러메세지를 리스폰스 함으로 써 서버를 유지할 수 있다.
    // Router 다음에 있는 에러 처리 미들웨어를 실행한다.
    next(error);
  }
});

// 상품 목록 조회 API
router.get('/goods', async (req, res, next) => {
  try {
    // 상품 목록 조회를 진행한다.
    const goodsMenu = await Goods.find({}, { goodsPw: 0 })
      .sort('-uploadAt')
      .exec();
    // mongoDB쿼리 언어규칙 find({}, { goodsPw: 0 }) 0을 넣어서 제외 1은 포함

    if (!goodsMenu) {
      return res.status(404).json([]);
    }

    // 상품 목록 조회 결과를 클라이언트에게 반환한다.
    return res.status(200).json({ goodsMenu });
  } catch (error) {
    next(error);
  }
});

// 상품 상세 조회 API
router.get('/goods/:goodsId', async (req, res, next) => {
  try {
    const { goodsId } = req.params;
    const goodsSearch = await Goods.findOne({ goodsId }, { goodsPw: 0 }).exec();
    // mongoDB쿼리 언어규칙 find({}, { goodsPw: 0 }) 0을 넣어서 제외 1은 포함

    if (!goodsSearch) {
      throw new Error('Goods not found');
    }

    // 상품 목록 조회 결과를 클라이언트에게 반환한다.
    return res.status(200).json({ goodsSearch });
  } catch (error) {
    next(error);
  }
});

const updateGoodsSchema = joi.object({
  goods: joi.string().min(1).max(30),
  manual: joi.string().min(1).max(50),
  person: joi.string().min(1).max(10),
  goodsPw: joi.string().min(1).max(10).required(),
  condition: joi.string().valid('FOR_SALE', 'SOLD_OUT'),
});

// 상품 수정 비밀번호 입력 API
router.patch('/goods/:goodsId', async (req, res, next) => {
  try {
    const { goodsId } = req.params;
    const validation = await updateGoodsSchema.validateAsync(req.body);
    const { goods, manual, person, goodsPw, condition } = validation;

    const updateGoods = await Goods.findOne({ goodsId }).exec();
    if (!updateGoods) {
      throw new Error('Goods not found');
    }
    if (!goodsPw) {
      throw new Error('"goodsPw" is required');
    }
    if (goodsPw !== updateGoods.goodsPw) {
      throw new Error('"goodsPw" is not same');
    }
    if (goods) {
      updateGoods.goods = goods;
    }
    if (manual) {
      updateGoods.manual = manual;
    }
    if (person) {
      updateGoods.person = person;
    }
    if (condition) {
      updateGoods.condition = condition;
    }
    updateGoods.updateAt = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Seoul',
    });
    //new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}) 이렇게 작성하면 한국시간을 가져올수 있음.
    await updateGoods.save();

    return res.status(200).json({ updateGoods });
  } catch (error) {
    next(error);
  }
});

// 상품 삭제 API
router.delete('/goods/:goodsId', async (req, res, next) => {
  try {
    const { goodsId } = req.params;
    const validation = await updateGoodsSchema.validateAsync(req.body);
    const { goodsPw } = validation;

    const goods = await Goods.findOne({ goodsId }).exec();
    if (!goods) {
      throw new Error('Goods not found');
    }
    if (!goodsPw) {
      throw new Error('"goodsPw" is required');
    }
    if (goodsPw !== goods.goodsPw) {
      throw new Error('"goodsPw" is not same');
    }

    await Goods.deleteOne({ goodsId });

    return res.status(200).json({});
  } catch (error) {
    next(error);
  }
});

export default router;
