import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { AccessLevels } from "../constants/enum.js";
const ModelName = "contributors";

export const Contributor = sequelize.define(
    ModelName,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: DataTypes.STRING,
    },
    access_level: {
        type: DataTypes.ENUM,
        values: AccessLevels
    }
  },
  {
    timestamps: false,
  }
);