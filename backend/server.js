     const express = require('express');
     const dotenv = require('dotenv');
     const morgan = require('morgan');
     const cors = require('cors');
     const path = require('path'); // Import the 'path' module
     
     dotenv.config({ path: './.env'});
    
     const connectDB = require('./config/db');
    const errorHandler = require('./middleware/errorHandler')
    
    connectDB();
    
    const app = express();
    
    app.use(express.json());
    
    // Enable CORS for all origins
    app.use(cors());
    
    app.use(morgan('tiny'));
    
    // Serve static files from the 'frontend' directory
    app.use(express.static(path.join(__dirname, '../frontend')));
    
    
    app.use('/api/movies', require('./routes/movies'));
    app.use('/api/messages', require('./routes/messages'));
    
    // This route will now be overridden by index.html in your frontend folder
    app.get('/', (req, res) => {
      res.send('API is running...');
    });
    
    const PORT = process.env.PORT || 5000;
    
    app.use(errorHandler);
    
    app.listen(
      PORT,
     console.log(`Server is running in ${process.env.NODE_ENV} made on port ${PORT}`)
    );