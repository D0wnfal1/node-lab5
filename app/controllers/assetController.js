const Asset = require("../models/Asset");
const Employee = require("../models/Employee");

const handleError = (res, err, message, isJson = false) => {
  console.error(`${message}: ${err}`);
  return isJson
    ? res.status(500).json({ error: "Server Error" })
    : res.status(500).send("Server Error");
};

exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find()
      .sort({ issueDate: -1 })
      .populate("employee");
    res.render("assets/index", { assets });
  } catch (err) {
    handleError(res, err, "Error fetching assets");
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate("employee");
    if (!asset) {
      return res.status(404).send("Asset not found");
    }

    res.render("assets/details", { asset });
  } catch (err) {
    handleError(res, err, "Error fetching asset details");
  }
};

exports.getAssetByIdJson = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate("employee");
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json(asset);
  } catch (err) {
    handleError(res, err, "Error fetching asset JSON details", true);
  }
};

exports.getAddForm = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render("assets/add", { employees });
  } catch (err) {
    handleError(res, err, "Error fetching employees for asset form");
  }
};

exports.addAsset = async (req, res) => {
  try {
    const { employee, itemName, issueDate } = req.body;

    const newAsset = new Asset({
      employee,
      itemName,
      issueDate: issueDate || Date.now(),
    });

    await newAsset.save();
    res.redirect("/assets");
  } catch (err) {
    handleError(res, err, "Error adding asset");
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const [asset, employees] = await Promise.all([
      Asset.findById(req.params.id),
      Employee.find(),
    ]);

    if (!asset) {
      return res.status(404).send("Asset not found");
    }

    res.render("assets/edit", { asset, employees });
  } catch (err) {
    handleError(res, err, "Error fetching asset for edit");
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { employee, itemName, issueDate } = req.body;

    await Asset.findByIdAndUpdate(req.params.id, {
      employee,
      itemName,
      issueDate: issueDate || Date.now(),
    });

    res.redirect("/assets");
  } catch (err) {
    handleError(res, err, "Error updating asset");
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.redirect("/assets");
  } catch (err) {
    handleError(res, err, "Error deleting asset");
  }
};

exports.getAssetsJson = async (req, res) => {
  try {
    const assets = await Asset.find()
      .sort({ issueDate: -1 })
      .populate("employee");
    res.json(assets);
  } catch (err) {
    handleError(res, err, "Error fetching assets as JSON", true);
  }
};
