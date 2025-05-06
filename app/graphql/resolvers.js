const Employee = require("../models/Employee");
const Asset = require("../models/Asset");

const resolvers = {
  Query: {
    employees: async () => {
      return await Employee.find();
    },
    employee: async (_, { id }) => {
      return await Employee.findById(id);
    },

    assets: async () => {
      return await Asset.find().populate("employee");
    },
    asset: async (_, { id }) => {
      return await Asset.findById(id).populate("employee");
    },
  },

  Mutation: {
    createEmployee: async (_, { name, roomNumber }) => {
      const employee = new Employee({ name, roomNumber });
      await employee.save();
      return employee;
    },
    updateEmployee: async (_, { id, name, roomNumber }) => {
      const updateData = {};
      if (name) updateData.name = name;
      if (roomNumber) updateData.roomNumber = roomNumber;

      return await Employee.findByIdAndUpdate(id, updateData, { new: true });
    },
    deleteEmployee: async (_, { id }) => {
      try {
        const assetsCount = await Asset.countDocuments({ employee: id });
        if (assetsCount > 0) {
          throw new Error("Cannot delete employee with assigned assets");
        }

        const result = await Employee.findByIdAndDelete(id);
        return !!result;
      } catch (error) {
        console.error("Error deleting employee:", error);
        return false;
      }
    },

    createAsset: async (_, { employeeId, itemName, issueDate }) => {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }

      const asset = new Asset({
        employee: employeeId,
        itemName,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
      });

      await asset.save();
      return await Asset.findById(asset._id).populate("employee");
    },
    updateAsset: async (_, { id, employeeId, itemName, issueDate }) => {
      const updateData = {};

      if (employeeId) {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
          throw new Error("Employee not found");
        }
        updateData.employee = employeeId;
      }

      if (itemName) updateData.itemName = itemName;
      if (issueDate) updateData.issueDate = new Date(issueDate);

      return await Asset.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("employee");
    },
    deleteAsset: async (_, { id }) => {
      try {
        const result = await Asset.findByIdAndDelete(id);
        return !!result;
      } catch (error) {
        console.error("Error deleting asset:", error);
        return false;
      }
    },
  },

  Employee: {
    assets: async (employee) => {
      return await Asset.find({ employee: employee.id });
    },
  },
};

module.exports = resolvers;
