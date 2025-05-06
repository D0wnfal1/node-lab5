const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # Types
  type Employee {
    id: ID!
    name: String!
    roomNumber: String!
    assets: [Asset!]
  }

  type Asset {
    id: ID!
    employee: Employee!
    itemName: String!
    issueDate: String!
  }

  # Queries
  type Query {
    # Employee queries
    employees: [Employee!]!
    employee(id: ID!): Employee

    # Asset queries
    assets: [Asset!]!
    asset(id: ID!): Asset
  }

  # Mutations
  type Mutation {
    # Employee mutations
    createEmployee(name: String!, roomNumber: String!): Employee!
    updateEmployee(id: ID!, name: String, roomNumber: String): Employee!
    deleteEmployee(id: ID!): Boolean!

    # Asset mutations
    createAsset(employeeId: ID!, itemName: String!, issueDate: String): Asset!
    updateAsset(
      id: ID!
      employeeId: ID
      itemName: String
      issueDate: String
    ): Asset!
    deleteAsset(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
