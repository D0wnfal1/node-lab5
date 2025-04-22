const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

router.get("/", assetController.getAssets);

router.get("/add", assetController.getAddForm);

router.post("/add", assetController.addAsset);

router.get("/view/:id", assetController.getAssetById);

router.get("/api/:id", assetController.getAssetByIdJson);

router.get("/edit/:id", assetController.getEditForm);

router.post("/edit/:id", assetController.updateAsset);

router.get("/delete/:id", assetController.deleteAsset);

router.get("/api", assetController.getAssetsJson);

router.get("/report/json", assetController.getAssetsReport);

module.exports = router;
