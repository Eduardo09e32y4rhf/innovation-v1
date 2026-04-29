const fs = require('fs');
const pngToIco = require('png-to-ico');

pngToIco('assets/logo.png')
  .then(buf => {
    fs.writeFileSync('assets/logo.ico', buf);
    console.log('Icon created successfully');
  })
  .catch(console.error);
