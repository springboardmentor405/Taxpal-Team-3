// index.js serves as a simple wrapper when the project is treated as an ES module.
// Rather than using CommonJS `require`, we import the main server file which
// already contains the full app configuration. This prevents the
// "require is not defined in ES module scope" error that occurred earlier.

import "./server.js";

// If someone still runs `node index.js` directly they will just trigger the
// server startup logic defined in server.js via this import. No additional
// code is needed here.
