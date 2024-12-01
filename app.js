const express = require('express');
const path = require('path');
const app = express();
const router = require('./routes/router');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening http://localhost:${PORT}`));