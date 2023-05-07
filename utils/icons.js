const fs = require('fs')
const path = require('path')

fs.readdir(path.join(__dirname, '..', 'assets', 'img', 'stock'), (err, files) => {
    fs.writeFile(
        path.join(__dirname, 'characters.json'),
        JSON.stringify(files.map((file) => file.replace(/(\w+).png/g, '$1'))),
        () => {}
    )
})
