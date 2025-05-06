const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;

const setupApolloServer = require("./app/graphql");

mongoose
  .connect("mongodb://localhost:27017/asset_management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));
app.set("layout", "layout");

const assetRoutes = require("./app/routes/assetRoutes");
const employeeRoutes = require("./app/routes/employeeRoutes");

app.use("/assets", assetRoutes);
app.use("/employees", employeeRoutes);

app.get("/", (req, res) => {
  res.redirect("/employees");
});

app.get("/api", (req, res) => {
  res.json({
    message: "API endpoints",
    endpoints: [
      "/employees/api - Get all employees",
      "/employees/api/:id - Get specific employee by ID with assigned assets",
      "/assets/api - Get all assets",
      "/assets/api/:id - Get specific asset by ID",
      "/graphql - GraphQL endpoint for querying and mutating data",
    ],
  });
});

const startServer = async () => {
  await setupApolloServer(app);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
