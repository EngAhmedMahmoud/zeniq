import { Contributor } from "../models/Contributor";



export const createWorkpackage = async (req, res) => {
  const {  project,
    address,
    access_level } = req.body;
  try {
    const contributor = await Contributor.create({
      project,
      address,
      access_level
    });
    res.json(contributor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
