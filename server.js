import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// The application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// The port number the server will listen on
const PORT = process.env.PORT || 3000;

const app = express();

/**
 * __filename and __dirname (needed for ES Modules)
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serve static files from the public folder
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Configure EJS
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */

// Home page
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Organizations page
app.get('/organizations', (req, res) => {
  res.render('organizations', { title: 'Our Partner Organizations' });
});

// Projects page
app.get('/projects', (req, res) => {
  res.render('projects', { title: 'Service Projects' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

