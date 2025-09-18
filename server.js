require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sessionRouter = require('./src/routes/sessionRoutes');
const chatRouter = require('./src/routes/chatRoutes');

const app = express();
app.use(express.json())
const PORT = process.env.PORT;

app.use(cors());

app.use('/session', sessionRouter);
app.use('/chats', chatRouter);

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});