const express = require("express");
const structuredMock = require("../../../shared/mock/structured.json");
const router = express.Router();

router.post("/", async (req, res) => {
  // Frontend 데이터 검증
  if (
    req.body === null ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      success: false,
      message: "request body가 비어있거나 object가 아닙니다.",
    });
  }

  // TODO: AI 자연어 구조화 요청
  // TODO: AI 구조화 결과 가공

  // Frontend로 응답 전송
  return res.status(200).json({
    success: true,
    data: structuredMock,
  });
});

module.exports = router;
