// // require('dotenv').config();
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');

// // const app = express();

// // // Middleware
// // app.use(express.json());
// // app.use(cors());

// // // Test route to ensure server works
// // app.get('/', (req, res) => {
// //   res.json({ message: 'Server is running!' });
// // });

// // // Temporarily comment out all other routes to isolate the issue
// // // app.use('/api/auth', require('./routes/auth'));
// // // app.use('/api/expenses', require('./routes/expenses'));

// // // Connect to MongoDB
// // mongoose.connect(process.env.MONGO_URI)
// //   .then(() => console.log('✅ MongoDB connected'))
// //   .catch(err => console.error('❌ MongoDB connection error:', err));

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// // });
// // Add this at the VERY TOP of your server.js file, before any other requires
// console.log('🚀 Starting server debug...');

// // Override Express methods to catch the problematic route
// const express = require('express');
// const originalRouter = express.Router;

// express.Router = function(...args) {
//   const router = originalRouter.apply(this, args);
  
//   // Wrap all HTTP methods
//   ['get', 'post', 'put', 'delete', 'patch', 'all', 'use'].forEach(method => {
//     const originalMethod = router[method];
//     router[method] = function(path, ...middlewares) {
//       try {
//         console.log(`✅ Registering ${method.toUpperCase()} route: "${path}"`);
        
//         // Validate the path
//         if (typeof path !== 'string' && typeof path !== 'function') {
//           throw new Error(`Invalid path type: ${typeof path}`);
//         }
        
//         if (typeof path === 'string') {
//           // Check for common problematic patterns
//           if (path.includes(':') && !path.match(/:[a-zA-Z_][a-zA-Z0-9_]*/)) {
//             throw new Error(`Invalid parameter in path: ${path}`);
//           }
          
//           if (path.endsWith(':')) {
//             throw new Error(`Path ends with colon: ${path}`);
//           }
          
//           if (path.includes(':/')) {
//             throw new Error(`Malformed parameter in path: ${path}`);
//           }
//         }
        
//         return originalMethod.call(this, path, ...middlewares);
//       } catch (error) {
//         console.error(`❌ ERROR registering ${method.toUpperCase()} route: "${path}"`);
//         console.error('Error details:', error.message);
//         console.error('Stack trace:', error.stack);
//         throw error;
//       }
//     };
//   });
  
//   return router;
// };

// // Also wrap the main app methods
// const originalApp = express;
// const wrappedExpress = function(...args) {
//   const app = originalApp(...args);
  
//   ['get', 'post', 'put', 'delete', 'patch', 'all', 'use'].forEach(method => {
//     const originalMethod = app[method];
//     app[method] = function(path, ...middlewares) {
//       try {
//         console.log(`✅ Registering APP ${method.toUpperCase()} route: "${path}"`);
        
//         if (typeof path === 'string') {
//           // Check for problematic patterns
//           if (path.includes(':') && !path.match(/:[a-zA-Z_][a-zA-Z0-9_]*/)) {
//             throw new Error(`Invalid parameter in path: ${path}`);
//           }
          
//           if (path.endsWith(':')) {
//             throw new Error(`Path ends with colon: ${path}`);
//           }
          
//           if (path.includes(':/')) {
//             throw new Error(`Malformed parameter in path: ${path}`);
//           }
//         }
        
//         return originalMethod.call(this, path, ...middlewares);
//       } catch (error) {
//         console.error(`❌ ERROR registering APP ${method.toUpperCase()} route: "${path}"`);
//         console.error('Error details:', error.message);
//         console.error('Stack trace:', error.stack);
//         throw error;
//       }
//     };
//   });
  
//   return app;
// };

// // Copy all properties from original express
// Object.setPrototypeOf(wrappedExpress, originalApp);
// Object.keys(originalApp).forEach(key => {
//   wrappedExpress[key] = originalApp[key];
// });

// // Replace express with our wrapped version
// module.exports = wrappedExpress;

// // Now your regular server code starts here
// require('dotenv').config();
// const mongoose = require('mongoose');
// const cors = require('cors');

// console.log('📦 Loading dependencies...');

// // Create Express app using our wrapped version
// const app = wrappedExpress();

// console.log('⚙️ Setting up middleware...');

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Basic health check route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Server is running!',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// console.log('🔗 Setting up routes...');

// // Load routes - these will be debugged if they fail
// try {
//   console.log('Loading auth routes...');
//   app.use('/api/auth', require('./routes/auth'));
// } catch (error) {
//   console.error('❌ Failed to load auth routes:', error.message);
// }

// try {
//   console.log('Loading expense routes...');
//   app.use('/api/expenses', require('./routes/expenses'));
// } catch (error) {
//   console.error('❌ Failed to load expense routes:', error.message);
// }

// // Add any other routes here with try-catch blocks
// // try {
// //   console.log('Loading other routes...');
// //   app.use('/api/other', require('./routes/other'));
// // } catch (error) {
// //   console.error('❌ Failed to load other routes:', error.message);
// // }

// console.log('🗄️ Connecting to MongoDB...');

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected successfully'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('🚨 Unhandled error:', err);
//   res.status(500).json({ 
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// const PORT = process.env.PORT || 5000;

// console.log(`🚀 Starting server on port ${PORT}...`);

// app.listen(PORT, () => {
//   console.log(`✅ Server successfully running on port ${PORT}`);
//   console.log(`🌐 Access your app at: http://localhost:${PORT}`);
// });
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Load routes with try-catch blocks
try {
  app.use('/api/auth', require('./routes/auth'));
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  app.use('/api/expenses', require('./routes/expenses'));
} catch (error) {
  console.error('Error loading expense routes:', error.message);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});