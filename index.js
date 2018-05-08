#!/usr/bin/env node

'use strict';

const https = require('https');

const { JIRA_PASS, JIRA_PATH } = process.env;

function httpsRequest(options) {
    return new Promise((resolve, reject) => {
        https
            .get(options, response => {
                let str = '';

                response.on('data', function(chunk) {
                    str += chunk;
                });

                response.on('end', function() {
                    resolve(JSON.parse(str));
                });
            })
            .on('error', e => {
                reject(e);
            });
    });
}

function performSearch(jql) {
    return new Promise(resolve => {
        httpsRequest({
            host: JIRA_PATH,
            path:
                `/rest/api/2/search?` +
                (jql ? `&jql=${escape(jql)}&maxResults=20` : ''),
            headers: {
                Authorization: 'Basic ' + JIRA_PASS,
                'Content-Type': 'application/json'
            }
        }).then(data => {
            resolve(data.issues);
        });
    });
}

const resolved = `project = AVPM AND issuetype = Deploy ORDER BY key DESC, summary DESC`;


performSearch(resolved).then(result => {
    console.log(result);
});
