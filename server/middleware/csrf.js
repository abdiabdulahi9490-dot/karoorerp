// server/middleware/csrf.js
const csurf = require('csurf');

// Default to cookie-based CSRF tokens for APIs that serve HTML forms.
const csrfProtection = csurf({ cookie: true });

module.exports = csrfProtection;
