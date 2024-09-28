require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { Cashfree } = require("cashfree-pg");

const connectDB = require("./config/dbConnection.js");
// const passportConfig = require("./config/passport");

const app = express();
const port = process.env.PORT || 8080;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse application/json
app.use(bodyParser.json());

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// JWT Cookie
// app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:4000",
      "http://127.0.0.1:8080",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// CashFree
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// routes
// const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
// const bookingPgRoutes = require("./routes/bookingPgRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const pgDetailsRoutes = require("./routes/pgDetailsRoutes");
// const renterRoutes = require("./routes/renterRoutes");
const visitBookingRoutes = require("./routes/visitBookingRoutes");
const bookmarksRoutes = require("./routes/bookmarksRoutes");

// paths
app.use("/auth", authRoutes);
// app.use("/admin", adminRoutes);
app.use("/owner", ownerRoutes);
// app.use("/renter", renterRoutes);
app.use("/pgDetails", pgDetailsRoutes);
// app.use("/pgBooking", bookingPgRoutes);
app.use("/payment", paymentRoutes);
app.use("/visitBooking", visitBookingRoutes);
app.use("/bookmarks", bookmarksRoutes);

app.get("*", (req, res) => {
  res
    .status(404)
    .json({ success: false, message: "404: Requested Path Not Found" });
});

app.listen(port, () => {
  console.log(`PGHub listening on http://127.0.0.1:${port} `);
});
