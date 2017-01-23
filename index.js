'use strict';
const https = require('https');
const express = require('express');
const app = express();
const { JIRA_PASS, JIRA_PATH } = process.env;
const port = 4747;

function httpsRequest(options) {
    return new Promise((resolve, reject) => {
        https.get(options, response => {
            let str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });

            response.on('end', function() {
                resolve(JSON.parse(str));
            });
        }).on('error', e => {
            reject(e);
        });
    });
}

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.get('/api/kanban', function(req, res) {
    const { jql, boardId, quickFilter } = req.query;
    httpsRequest({
        host: JIRA_PATH,
        path: `/rest/agile/1.0/board/${boardId}/issue?quickFilter=${quickFilter}&jql=${escape(
            jql
        )}`,
        headers: {
            Authorization: 'Basic ' + JIRA_PASS,
            'Content-Type': 'application/json'
        }
    }).then(data => res.json(data.issues));
});

app.listen(port);

console.log(`Listening on port ${port}`);