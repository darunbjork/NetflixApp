const dotenv = require('dotenv');
dotenv.config({ path: './.env', debug: true });
console.log('MONGO_URI from .env:', process.env.MONGO_URI);

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
         

         
         const allowed = [ process.env.FRONTEND_URL,
          'http://localhost:3000',
                          'http://localhost:5000',
                          'http://127.0.0.1:5500',
                          'http://localhost:5500',
                          ];
         
         app.use(cors({
           origin: (origin, callback) => {
             console.log('Incoming request origin:', origin); // Re-added for debugging
             if (allowed.indexOf(origin) !== -1 || !origin) {
               callback(null, true);
             } else {
               callback(new Error('Not allowed by CORS'));
             }
           },
           credentials: true,   // cookies
         }));         
         app.use(morgan('tiny'));
         
         app.use('/api/auth', require('./routes/auth')); // Mount auth routes
         app.use('/api/movies', require('./routes/movies')); // Mount movies routes
         
         // app.use(express.static(frontendPath));

         // Explicitly serve index.html for the root route
         // app.get('/', (req, res) => {
         //   res.sendFile(path.join(frontendPath, 'index.html'));
         // });
         
         const PORT = process.env.PORT || 3000;
         
         app.use(errorHandler);
         
         app.listen(
           PORT,
           () => console.log(`Server is running in ${process.env.NODE_ENV} made on port ${PORT}`)
         );