import { Project } from "../models/Project.js";
import { Contributor } from "../models/Contributor.js";
import validateProject from "./../validators/project.js";
import httpCodes from "../constants/httpCodes.js";
import apiResponse from "../utils/apiResponse.js";
import path from "path";
import fileExtensions from "../constants/fileExtensions.js";
import fs from "fs";

const uploadDirectory = './src/uploads/';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: ["id", "title", "short_description"],
    });
    res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findOne({
      where: {
        id,
      },
    });
    console.log("project:", project);
    res.json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    let contributors = req?.body?.contributors
    const { title, short_description,detailed_description,category,target_industry,landing_page,role,patch_video } = req.body;
    if(contributors && contributors.trim().length > 0){
      contributors = JSON.parse(contributors);
    }
    const inputErrors = await validateProject({title, short_description,detailed_description,category,target_industry,landing_page,role,patch_video,contributors});
    if(inputErrors){
      return res.status(httpCodes.BAD_REQUEST).json(apiResponse({errors:inputErrors}))
    }
    const {logo_image,app_image,presentation_slides}=req.files;

    const filesUpload  = await uploadFiles({'logo_image':logo_image,'app_image':app_image,'presentation_slides':presentation_slides});
    if(!filesUpload.status){
      return res.status(httpCodes.BAD_REQUEST).json(apiResponse({errors:filesUpload.errors}))
    }
    const newProject = await Project.create({
      title, short_description,detailed_description,category,target_industry,landing_page,role,patch_video,...filesUpload.filesNames
    });
    let projectContributors = [];
    if(contributors){
      const assignProjectIdToContributors = contributors.map((element)=>{
        return {...element,projectId:newProject.id}
      });
      projectContributors = await Contributor.bulkCreate(assignProjectIdToContributors)
    }
    return res.status(httpCodes.OK).json(apiResponse({data:{project:newProject,contributors:projectContributors}}));
  } catch (error) {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(apiResponse({errors:[error.message]}));
  }
};

const uploadFiles = async (files) => {
  const errors = [];
  const filesNames  = {};
  for (let file of Object.keys(files)) {
    let actualFile = files[file]
    try {
      let extName = path.extname(actualFile.name);
      if(!fileExtensions.includes(extName)){
        throw new Error(`${actualFile.name} extension not allowed`)
      }
      const fileName = renameFile(actualFile.name)
      let destination = uploadDirectory+fileName;
      await actualFile.mv(destination);
      filesNames[file] = fileName
    } catch (err) {
      errors.push(err.message);
    }
  }
  if(errors.length){
    rollback(filesNames)
    return {
      status:false,
      errors
    }
  }else{
    return {status:true,filesNames}
  }
  
};

const renameFile =(name)=>{
  return `${new Date().getTime()}_${name}`
}
const rollback=(files)=>{
  for(let file of Object.keys(files)){
    let filePath = `${uploadDirectory}/${files[file]}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await Project.destroy({
      where: {
        id,
      },
    });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProjectContributors = async (req, res) => {
  const { id } = req.params;
  console.log("project id is: ", id);
  try {
    const contributors = await Contributor.findAll({
      attributes: [
        "id",
        "project",
        "address",
        "access_level",
      ],
      where: { project: id },
    });
    console.log("contributors; ", contributors);
    res.json(contributors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};