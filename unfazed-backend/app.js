const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./src/routes/paymentRoutes");
const clientPackageRoutes = require("./src/routes/clientPackageRoutes");
const packageRoutes = require("./src/routes/packageRoutes");
const therapistRoutes = require("./src/routes/therapistRoutes");
const schedulingRoutes = require("./src/routes/schedulingRoutes");
const clientRoutes = require("./src/routes/clientRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payments", paymentRoutes);
app.use("/api/client-packages", clientPackageRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/scheduling", schedulingRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/packages", packageRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Unfazed backend is running!"
    });
});

module.exports = app;