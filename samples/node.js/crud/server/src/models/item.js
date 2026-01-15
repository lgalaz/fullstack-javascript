import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Item = sequelize.define(
  "Item",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "items",
    timestamps: true
  }
);

export default Item;
