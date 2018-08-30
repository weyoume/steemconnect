[![CircleCI Build Status](https://circleci.com/gh/eziranetwork/weauth.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/eziranetwork/weauth)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/eziranetwork/weauth/dev/LICENSE)
[![WeYouMe channel on Discord](https://img.shields.io/badge/chat-discord-738bd7.svg)](https://discord.gg/djnEYKN)

# weAuth API and Console UI

## Install

Download and install Node.js >= 7.7.1 then run
```
npm install
```

Add config vars
```
NODE_API_URL=https://api.ezira.io
NODE_API_URL_SERVER=https://api.ezira.io
BROADCASTER_USERNAME=CHAIN_ACCOUNT_NAME_STRING
BROADCASTER_POSTING_KEY=CHAIN_ACCOUNT_POSTING_PRIVATE_KEY
JWT_SECRET=somerandomstringsecret
DEBUG=weauth:*
dburl=postgresql://user:pass@localhost:port/db
PORT=5555
CONTENT_DEFAULT='self'
CONTENT_SCRIPT_SRC='self','unsafe-eval','unsafe-inline'
CONTENT_CONNECT_SRC='self',*.ezira.io
CONTENT_FRAME_SRC='self'
CONTENT_STYLE_SRC='self','unsafe-inline'
CONTENT_IMG_SRC='self',steemitimages.com,steemit-production-imageproxy-thumbnail.s3.amazonaws.com,data:
CONTENT_FONT_SRC='self'

```

## Run
```
npm start
```

## Api

### Routes

*/api/me* - Get user profile (require user or app token)

*/api/* - Broadcast posting operation for user (require app token)

## OAuth2
*/api/oauth2/authorize* - Issue new app token (require user token)

## Tokens
Tokens are created with JWT, the payload is public. Here is how it look:

### Token for user
```
{
  role: 'user',
  user: 'guest'
}
```
The token hash is saved on user localStorage once he login.

### Token for application
```
{
  role: 'app',
  proxy: 'example',
  user: 'guest',
  scope: ['vote', 'comment']
}
```

The token hash is sent to the application once user authorize the application.
