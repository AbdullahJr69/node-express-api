const express = require('express')
const router = express.Router()
const fs = require('fs');

router.get('/', (req, res, next) => {
    res.status(303) // 303 code is used to tell that the server sent this response to direct the client to get the requested resource at another URI with a GET request.
    .json({
        "URI description": "This is the main /downloads route.",
        "request": {
            "type": "GET",
            "description": "To download a file, add filename after a slash.",
            "example" : "Here's an example to download a file named 'api.jpeg'",
            "URL": `${req.protocol}://${req.get('host')}/downloads/api.jpeg`
        }
    })
})
router.get('/:id', (req, res, next) => {
    var fileId = req.params.id;
    if (fs.existsSync(`${__dirname}/../../static/${fileId}`)) {
        res.status(200).download(
            `${__dirname}/../../static/${fileId}`, filename=`${fileId}`
        )
    } else {
        res.status(404).json({
            "description" : "File was not found.",
            "filename": `${fileId}`
        })
    }
})

module.exports = router;