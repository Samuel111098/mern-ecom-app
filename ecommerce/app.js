const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

//import routes
const userRoutes = require('./Routes/user');

//app
const app = express();

//Database
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Database is connected!');
	});

//Router middleware
app.use(userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`The server is running on port ${port}`);
});
