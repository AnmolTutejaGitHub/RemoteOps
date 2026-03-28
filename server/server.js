require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require("./config/config");
const app = express();
require('./database/mongoose');
const userRoute = require('./routes/UserRoute');
const groupRoute = require('./routes/GroupRoute');
const connectionRoute = require('./routes/ConnectionRoute');
const cookieParser = require("cookie-parser");

const PORT = config.PORT;
app.use(cors({
    origin: `${config.FRONTEND_URL}`,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/api/group', groupRoute);
app.use('/api/connection', connectionRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
})

