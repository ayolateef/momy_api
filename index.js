const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");
const connectDB = require("./config/db");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fast2sms = require("fast-two-sms");

//Route files
const auth = require("./routes/auth");
const vendor = require("./routes/vendor");
const orderList = require("./routes/orderList");
const service = require("./routes/services");
const order = require("./routes/orders");

//LOAD ENV VARS
dotenv.config();

//connect to db
connectDB();

const app = express();

//body parser
app.use(express.json());

// app.use(fast2sms());

// Mount the router
app.use("/api/v1/auth", auth);
app.use("/api/v1/vendor", vendor);
app.use("/api/v1/orderList", orderList);
app.use("/api/v1/service", service);
app.use("/api/v1/order", order);

//cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(logger);

app.use(errorHandler);

//fileupload
app.use(fileupload());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// andle Promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  //close server & exit process
  server.close(() => process.exit(0));
});
