console.log("Starting index.js...");
require('dotenv').config();
const app = require('./src/app');

console.log("App module loaded");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});