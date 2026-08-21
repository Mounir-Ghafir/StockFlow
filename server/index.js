const app = require('./src/app');
const connectDatabase = require('./src/config/db');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`StockFlow API listening on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start StockFlow API:', error.message);
  process.exitCode = 1;
});
