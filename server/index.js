const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cluster = require('cluster');
const os = require('os');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cron = require('node-cron');
dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

// Handle non-existing endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});
app.get('/', (req, res) => {
  res.send('Server is running and active!');
  console.log('Server is running and active!');
});

// Schedule a cron job to run every 5 minutes to keep the server alive
cron.schedule('**/2 * * * * *', async () => {
  try {
    console.log('Pinging server to keep it awake...');
    // Change this to your actual server's public URL
    await axios.get('https://tutedude-x2vx.onrender.com');
    console.log('Server pinged successfully');
  } catch (error) {
    console.error('Error pinging the server:', error.message);
  }
});


// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});


if (cluster.isMaster) {
  const numWorkers = os.cpus().length;
  console.log(`Master is running. Forking ${numWorkers} workers.`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
