const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const app = express();
const path = require("path");
dotenv.config();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Backend is alive!');
});

app.listen(port, () => {    
  console.log(`Example app listening on port :${port}`);
});
