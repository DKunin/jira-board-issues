# Jira Board Issues

[![Greenkeeper badge](https://badges.greenkeeper.io/DKunin/jira-board-issues.svg)](https://greenkeeper.io/)

Simple module - to make request to jira api, and recieve issues

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [License](#license)

## Install

```console
    git clone git@github.com:DKunin/jira-board-issues.git
    cd jira-board-issues
```

Before usage JIRA_PASS and JIRA_PATH env variables should be set in your .bashrc file, or any other place, you use to declare variables. JIRA_PASS is base64 encoded your 'username:password'.

```bash
    export JIRA_PASS='ZnJlZDpmcmVk' 
    export JIRA_PATH='www.jira.com'
```

```console
    npm start
```

With Docker:

```console
    docker pull dkunin/jira-board-issues
    docker run -p 4747:4747 -e JIRA_PASS=$JIRA_PASS -e JIRA_PATH=$JIRA_PATH -d dkunin/jira-board-issues
```

or if you want to modify/build your own image:

```console
    npm run docker-image-build
    npm run docker-image-start
```

## Usage

Example request:
```
    http://localhost:4747/api/kanban?boardId=229&jql=assignee%20=%20currentUser()
```
jql is currently mandatory

## License

MIT © Dmitri Kunin
