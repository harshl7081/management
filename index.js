const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const routes = require("./router.js");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:4000", "http://localhost:5173"],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieparser());
app.use(helmet());
// app.use(morgan('common'));
app.use(
  morgan(
    "[:date[clf]] Method-:method Path-:url Status-:status :res[content-length] - :response-time ms"
  )
);

mongoose.connect(process.env.MONGO_CONNECTION);

app.listen(port, () => {
  console.log(`Worker ${process.pid} is listening on port ${4000}`);
  console.log(`browse at http://localhost:${4000}`);
  routes(app);
});

// app.get("/", (req, res) => {
//   res.send(
//     `<h1>Welcome to EduProjectLog API</h1><p>Worker ${process.pid} is listening on port ${port}</p>`
//   );

//   // process.on("unhandledRejection", (reason, p) => {
//   //   console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
//   //   // application specific logging, throwing an error, or other logic here
//   // });
// });
