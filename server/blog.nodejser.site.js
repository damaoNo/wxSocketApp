/**
 * Created by ChenChao on 2017/2/23.
 */

const http = require('http');
const port = 80;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
            <style type="text/css">
                html,body,iframe{margin: 0; padding: 0; height: 100%; width: 100%}
            </style>
        </head>
        <body>
            <iframe src="http://s30735.rxsg.ledu.com/" frameborder="0"></iframe>
        </body>
        </html>
    `);
});

server.listen(port, () => {
    console.log(`Server running at port: ${port}`);
});