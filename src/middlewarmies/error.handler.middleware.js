export default (err, req, res, next) => {
  console.log('에러 처리 미들웨어가 실행되었습니다.');
  console.error(err);
  if (err.message === 'Goods not found') {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }
  if (err.isJoi) {
    return res.status(400).json({ err: err.message });
  }
  if (err.message === '"goodsPw" is not same') {
    return res
      .status(400)
      .json({ errorMessage: '(goodsPw) 비밀번호가 일치하지 않습니다.' });
  }
  if (err.name === 'ValidationError') {
    if (err.message === '"goods" is required') {
      return res
        .status(400)
        .json({ errorMessage: '(goods) 상품명을 입력해 주세요.' });
    }
    if (err.message === '"manual" is required') {
      return res
        .status(400)
        .json({ errorMessage: '(manual) 상품 설명을 입력해 주세요.' });
    }
    if (err.message === '"person" is required') {
      return res
        .status(400)
        .json({ errorMessage: '(person) 담당자를 입력해 주세요.' });
    }
    if (err.message === '"goodsPw" is required') {
      return res
        .status(400)
        .json({ errorMessage: '(goodsPw) 상품 비밀번호를 입력해 주세요.' });
    }
  }
  if (err.message === '"goodsPw" is required') {
    return res
      .status(400)
      .json({ errorMessage: '(goodsPw) 해당 ID의 비밀번호를 입력해 주세요.' });
  }

  return res.status(500).json({
    errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};

// return res.status(400).json({ errorMessage: err.message });
