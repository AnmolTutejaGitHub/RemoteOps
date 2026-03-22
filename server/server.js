require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require("./config/config");
const app = express();
require('./database/mongoose');

const PORT = config.PORT;
app.use(cors({
    origin: `${config.FRONTEND_URL}`,
    credentials: true
}));

app.use(express.json());

app.listen(PORT,()=>{
    console.log(`Server is listening on PORT ${PORT}`)
})

