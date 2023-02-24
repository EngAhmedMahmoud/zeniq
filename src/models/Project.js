import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Contributor } from "./Contributor.js";
import {Categories,Roles} from "./../constants/enum.js"
const ModelName = "projects";

export const Project = sequelize.define(
    ModelName,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    short_description: {
      type: DataTypes.TEXT,
    },
    detailed_description:{
        type:DataTypes.TEXT
    },
    category: {
        type: DataTypes.ENUM,
        values: Categories
    },
    target_industry: {
        type: DataTypes.STRING,
    },
    landing_page: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.ENUM,
        values: Roles
    },
    patch_video: {
        type: DataTypes.STRING,
    },
    logo_image: {
        type: DataTypes.STRING,
    },
    app_image: {
        type: DataTypes.STRING,
    },
    presentation_slides: {
        type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

Project.hasMany(Contributor, {
  foreignKey: "projectId",
  sourceKey: "id",
});

Contributor.belongsTo(Project, {
  foreignKey: "projectId",
  targetId: "id",
});