'use strict';
const https = require('https');
const { JIRA_PASS, JIRA_PATH } = process.env;

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

function processResult(data) {
    return data.map(singleIssue => {
        return {
            key: singleIssue.key,
            summary: singleIssue.fields.summary,
            assignee: singleIssue.fields.assignee.name
        }
    });
}

function agregateResult(data) {
    return data.reduce((newArray, singleIssue) => {

        const { assignee } = singleIssue;
        if (Array.isArray(newArray[assignee])) {
            newArray[assignee].push(singleIssue);
        } else {
            newArray[assignee] = [singleIssue];
        }

        return newArray;
    }, {});
}

function printOut(data) {
    return Object.keys(data).reduce((newString, singleKey) => {
        const ids = data[singleKey].reduce((newStr, singleItem) => {
            return newStr+=`\n https://jr.avito.ru/browse/${singleItem.key}`;
        },'');
        return newString += `@${singleKey} ${data[singleKey].length}:\n ${ids} \n\n`;
    }, '');
}

function printOutShort(data) {
    return Object.keys(data).reduce((newString, singleKey) => {
        const jql = escape(`assignee in (${singleKey}) AND status in (Resolved, "Waiting for release")`);
        return newString += `@${singleKey} ${data[singleKey].length}:\n https://jr.avito.ru/issues/?jql=${jql} \n\n`;
    }, '');
}

function performSearch(jql) {
    return new Promise(resolve => {
        httpsRequest({
                host: JIRA_PATH,
                path: `/rest/api/2/search?` + (jql ? `&jql=${escape(jql)}&maxResults=500` : ''),
                headers: {
                    Authorization: 'Basic ' + JIRA_PASS,
                    'Content-Type': 'application/json'
                }
            }).then(data => {
                resolve(data.issues);
            });
    })
}

const fullTeam = 'alsolomentsev, dakharin, oaosipov, eisakova, vkaltyrin, mmotylev, poignatov, isolkin, dkunin, dvpanov, myuveselov, mvkamashev';
const votedTeam = 'vkaltyrin, mmotylev, eisakova, myuveselov';
const resolved = `assignee in (${votedTeam}) AND status in (Resolved, "Waiting for release")`;
const inReview = `assignee in (${votedTeam}) AND status = "In Review"`;

performSearch(inReview).then(result => {
    console.log(printOut(agregateResult(processResult(result))));
});

// performSearch(resolved).then(result => {
//     console.log(printOutShort(agregateResult(processResult(result))));
// });