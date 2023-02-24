import express from "express";
import morgan from "morgan";
import projectsRoutes from "./routes/projects.js";
import fileUpload from "express-fileupload";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({  
    limits: { fileSize: 50*1024*1024 },
    abortOnLimit:true
}));

// middleware
app.use(morgan("dev"));
app.use("/api/v1/projects",projectsRoutes);

export default app;