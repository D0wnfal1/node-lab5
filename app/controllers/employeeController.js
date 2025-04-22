const Employee = require("../models/Employee");
const Asset = require("../models/Asset");

const handleError = (res, err, message, isJson = false) => {
  console.error(`${message}: ${err}`);
  return isJson
    ? res.status(500).json({ error: "Server Error" })
    : res.status(500).send("Server Error");
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render("employees/index", { employees });
  } catch (err) {
    handleError(res, err, "Error fetching employees");
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    const employeeAssets = await Asset.find({ employee: req.params.id });

    res.render("employees/details", { employee, assets: employeeAssets });
  } catch (err) {
    handleError(res, err, "Error fetching employee details");
  }
};

exports.getEmployeeByIdJson = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeAssets = await Asset.find({ employee: req.params.id });

    res.json({
      employee,
      assets: employeeAssets,
    });
  } catch (err) {
    handleError(res, err, "Error fetching employee JSON details", true);
  }
};

exports.getAddForm = (req, res) => {
  res.render("employees/add");
};

exports.addEmployee = async (req, res) => {
  try {
    const { name, roomNumber } = req.body;

    const newEmployee = new Employee({
      name,
      roomNumber,
    });

    await newEmployee.save();
    res.redirect("/employees");
  } catch (err) {
    handleError(res, err, "Error adding employee");
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.render("employees/edit", { employee });
  } catch (err) {
    handleError(res, err, "Error fetching employee for edit");
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { name, roomNumber } = req.body;

    await Employee.findByIdAndUpdate(req.params.id, {
      name,
      roomNumber,
    });

    res.redirect("/employees");
  } catch (err) {
    handleError(res, err, "Error updating employee");
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const assets = await Asset.find({ employee: req.params.id });

    if (assets.length > 0) {
      return res
        .status(400)
        .send(
          "Cannot delete employee with assigned assets. Remove all assets first."
        );
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.redirect("/employees");
  } catch (err) {
    handleError(res, err, "Error deleting employee");
  }
};

exports.getEmployeesJson = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    handleError(res, err, "Error fetching employees as JSON", true);
  }
};
