const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

          const express = require('express');
          const morgan = require('morgan');
          const cors = require('cors');
          const path = require('path'); // Import the 'path' module
          const cookieParser = require('cookie-parser'); // Import cookie-parser
          
         
          const connectDB = require('./config/db');
         const errorHandler = require('./middleware/errorHandler')
         
         connectDB();
         
         const app = express();
         
         app.use(express.json());
         app.use(cookieParser()); // Use cookie-parser middleware
         

         
         const allowed = ['http://localhost:3000',
                          'http://localhost:5000',
                          'http://127.0.0.1:5500'];
         
         app.use(cors({
           origin: (origin, cb) => {
             // allow REST-tools / Postman (origin undefined)
             if (!origin || allowed.includes(origin)) return cb(null, true);
             cb(new Error('Not allowed by CORS'));
           },
           credentials: true,   // cookies
         }));         app.use(morgan('tiny'));
         
         app.use('/api/auth', require('./routes/auth')); // Mount auth routes
         app.use('/api/movies', require('./routes/movies')); // Mount movies routes
         
         // Serve static files from the 'frontend' directory
         const frontendPath = path.join(__dirname, '../frontend');
         console.log(`Serving static files from: ${frontendPath}`);
         app.use(express.static(frontendPath));

         // Explicitly serve index.html for the root route
         app.get('/', (req, res) => {
           res.sendFile(path.join(frontendPath, 'index.html'));
         });
         
         const PORT = process.env.PORT || 3000;
         
         app.use(errorHandler);
         
         app.listen(
           PORT,
           () => console.log(`Server is running in ${process.env.NODE_ENV} made on port ${PORT}`)
         );