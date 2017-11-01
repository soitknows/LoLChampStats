const express = require('express');
const app = express();

const path = require('path');

// serve the whole directroy as static files
app.use(express.static(__dirname));

// Start the app by listening on the default Heroku port or 8080
app.listen(process.env.PORT || 8080);

console.log('Your content is now served on http://localhost:8080');

//route
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
