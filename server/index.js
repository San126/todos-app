const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./controller');

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);

mongoose.connect('mongodb://localhost:27017/todos-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connection is established successfully! 🎉')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});