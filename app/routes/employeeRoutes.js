const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/", employeeController.getEmployees);

router.get("/add", employeeController.getAddForm);

router.post("/add", employeeController.addEmployee);

router.get("/view/:id", employeeController.getEmployeeById);

router.get("/api/:id", employeeController.getEmployeeByIdJson);

router.get("/edit/:id", employeeController.getEditForm);

router.post("/edit/:id", employeeController.updateEmployee);

router.get("/delete/:id", employeeController.deleteEmployee);

router.get("/api", employeeController.getEmployeesJson);

module.exports = router;
