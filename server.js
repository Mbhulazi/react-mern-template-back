require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddlware");

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: ["http://localhost:3000", "https://react-mern-template-front.onrender.com"],
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoute);

app.get ("/", (req, res) => {
    res.send("Home page...")
});

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);

    })
})
.catch((err) =>  console.log(err));