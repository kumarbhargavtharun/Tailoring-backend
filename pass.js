const bcrypt = require('bcryptjs');
pass=bcrypt.hash('admin123', 10)
console.log(pass)
