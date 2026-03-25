require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require("./config/config");
const app = express();
require('./database/mongoose');
const userRoute = require('./routes/UserRoute');
const groupRoute = require('./routes/GroupRoute');
const connectionRoute = require('./routes/ConnectionRoute');

const PORT = config.PORT;
app.use(cors({
    origin: `${config.FRONTEND_URL}`,
    credentials: true
}));

app.use(express.json());

app.use(userRoute,'/api/user');
app.use(groupRoute,'/api/group');
app.use(connectionRoute,'/api/connection');

app.listen(PORT,()=>{
    console.log(`Server is listening on PORT ${PORT}`)
})

