import "dotenv/config"
import {sequelize} from "./config/db.js";

import app from "./app.js";
async function main() {
  const port = process.env.PORT || 5003;
  try {
    await sequelize.sync({ force: false });
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Enable to start the server",error);
  }
}
main();