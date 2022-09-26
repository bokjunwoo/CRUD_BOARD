const express = require('express');

const router = express.Router();

/* 메인 GET */
router.get('/', (req, res) => {
  res.render('index', {
    userId: req.session.userId ? req.session.userId : undefined
  });
});

module.exports = router;