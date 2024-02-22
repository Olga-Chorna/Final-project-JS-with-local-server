const express = require('express');
const router = express.Router();

const fs = require('fs');
const filePath = `${__dirname}/../storage/powerbanks.json`

function getPB() {
      const rawData = fs.readFileSync(filePath);
          if (0 === rawData.length) {
                    return [];    
                  }    
      return JSON.parse(rawData);}

router.get('/', (req, res) => {
  res.json(getPB());
});




//404
router.use((req, res, next) => {
  const error = new Error('Resourse not found');
  error.status = 404;
  next(error);
});

//other | 500
router.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    error: {
      status,
      message
    }
  });
});

module.exports = router;
