const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const pbRouter = require('./routes/pb');
app.use('/powerbanks', pbRouter)

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server listening on ${port}. Ctrl-C to stop`);
})