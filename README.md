# 프로젝트 이름
MDSTART-SHOP

# history
    1  npm install -g yarn
    2  yarn init -y
    3  yarn add express mongodb mongoose joi dotenv
    4  yarn add nodemon --dev
	5  yarn global add nodemon
    6  yarn add -D prettier
    7  yarn which
    8  which nodemon
    9  yarn dev
   10  yarn run format
   11  history

# 사용법
상품 등록 		: 	[post] /api/goods
상품 목록 조회 	: 	[get] /api/goods
상품 상세 조회 	:	[get] /api/goods/:goodsId
상품 수정 		: 	[Patch] /api/goods/:goodsId
상품 삭제 		: 	[del] /api/goods/:goodsId

모든 에러처리 	: 	'./src/middlewarmies/error.handler.middleware.js'
유효성 검증		: 	'./src/routers/GoodsRouter.js' (joi, if)