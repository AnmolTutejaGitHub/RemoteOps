require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const initWSServer = require('./wsServer');

require('./database/mongoose');

const userRoute = require('./routes/UserRoute');
const groupRoute = require('./routes/GroupRoute');
const connectionRoute = require('./routes/ConnectionRoute');

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/api/group', groupRoute);
app.use('/api/connection', connectionRoute);

initWSServer(httpServer);

httpServer.listen(config.PORT, () => {
    console.log(`Server running on PORT ${config.PORT}`);
});
