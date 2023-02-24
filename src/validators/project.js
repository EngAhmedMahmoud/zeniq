import Joi from "joi";
import { AccessLevels, Categories, Roles } from "../constants/enum.js";
const projectInputErrors = async({title, short_description,detailed_description,category,target_industry,landing_page,role,patch_video,contributors})=>{
    const schema = Joi.object({
        title: Joi.string()
            .min(5)
            .max(200)
            .required(),
    
        short_description:Joi.string()
        .required(),
    
        detailed_description:Joi.string()
        .required(),
    
        category:Joi.string().valid(...Categories)
        .required(),
    
        target_industry:Joi.string()
        .required(),
    
        landing_page:Joi.string().uri()
        .required(),
    
        patch_video:Joi.string().uri()
        .required(),

        role:Joi.string().valid(...Roles).required(),

        contributors:Joi.array().items({
            access_level:Joi.string().valid(...AccessLevels).required(),
            address:Joi.string().required()
        })    
    });
    const validateInputs = await schema.validate({title, short_description,detailed_description,category,target_industry,landing_page,role,patch_video,contributors});
   
    return validateInputs?.error?.details.map(({message})=>{
        return message
    })
}

export default projectInputErrors;