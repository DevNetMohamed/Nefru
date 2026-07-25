// import app from './app.js';
// import { connectedDB } from './config/db.js';
// import { env } from './config/env.js';

// async function startServer() {
//   try {
//     await connectedDB();

//     app.listen(env.port, () => {
//       console.log(`Backend server running on port ${env.port}`);
//     });
//   } catch (error) {
//     console.error('Failed to start backend server:', error);
//     process.exit(1);
//   }
// }

// startServer();

import app from "./app.js";
import { connectedDB } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectedDB();

    app.listen(env.port, () => {
      console.log(`Backend server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
}

startServer();
