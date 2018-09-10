[![CircleCI Build Status](https://circleci.com/gh/WeYouMe/weauth.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/WeYouMe/weauth)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/WeYouMe/weauth/dev/LICENSE)
[![WeYouMe channel on Discord](https://img.shields.io/badge/chat-discord-738bd7.svg)](https://discord.gg/djnEYKN)

# WeAuth API and Console UI

## Install

Download and install Node.js >= 7.7.1 then run
```
npm install
```

Add config vars
```
NODE_API_URL=https://api.WeYouMe.io
NODE_API_URL_SERVER=https://api.WeYouMe.io
BROADCASTER_USERNAME=CHAIN_ACCOUNT_NAME_STRING
BROADCASTER_POSTING_KEY=CHAIN_ACCOUNT_POSTING_PRIVATE_KEY
JWT_SECRET=somerandomstringsecret
DEBUG=weauth:*
dburl=postgresql://user:pass@localhost:port/db
PORT=5555
CONTENT_DEFAULT='self'
CONTENT_SCRIPT_SRC='self','unsafe-eval','unsafe-inline'
CONTENT_CONNECT_SRC='self',*.WeYouMe.io
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


# HELPFUL STUFF 

### RUN ASAP
```console
npm i
```

### LINUX - INSTALL POSTGRESQL VIA APT-GET/YUM

```console
[user@linux ~]$ sudo yum -y install postgresql94 postgresql94-server
[user@linux ~]$ sudo service postgresql94 initdb
# Use MD5 Authentication
[user@linux ~]$ sudo sed -i.bak -e 's/ident$/md5/' -e 's/peer$/md5/' /var/lib/pgsql94/data/pg_hba.conf
#start
[user@linux ~]$ sudo service postgresql94 start
```

or 

```./scripts/install_postgresql_yum.sh``` 

or 

```./scripts/install_postgresql_apt-get.sh``` 

depending on the package manager

### OSX - INSTALL POSTGRESQL VIA BREW

```console
user@osx:~$ brew install postgresql
```

#### START AS SERVICE OSX

```console
user@osx:~$ brew services start postgresql
```

### LINUX USING THE POSTGRESQL SHELL

you can then enter the postgresql shell via 

```sudo -u postgres psql 
// postgres : linux username , psql : linux cli program
```

### OSX USING THE POSTGRESQL SHELL
```console
user@osx:~$ psql postgres
```
#### FYI
```
/** 
 * I THINK IT'S STUPID THAT THE USER IS POSTGRES 
 * THE PACKAGES ARE CALLED POSTGRESQL
 * AND THE CLI IS PSQL
 * WUT o.O
 **/
 ```

##### OSX/LINUX create a psql user within psql, the one which will be running the sequelize command below

```console
[user@linux weauth]$ whoami
user
[user@linux weauth]$ sudo -u postgres psql
psql (9.4.17)
Type "help" for help.

postgres=# CREATE ROLE user LOGIN;
CREATE ROLE
postgres=# CREATE DATABASE user;
CREATE DATABASE
postgres=# CREATE DATABASE auth;
CREATE DATABASE
postgres=# ALTER USER user WITH PASSWORD 'password';
ALTER USER
```

##### check the port in the PSQL Shell
###### LINUX
```console
[user@linux weauth]$ sudo -u postgres psql
```
###### OSX
```console
user@osx:~$ psql postgresql
```
then
```console
[sudo] password for user: __________
psql (9.4.17)
Type "help" for help.

postgres=# SHOW port;
 port
------
 5432
(1 row)

postgres=# _
 ```

#### let's figure out our database url!

there's a few formats

```
postgresql://
postgresql://localhost
postgresql://localhost:5432
postgresql://localhost/mydb
postgresql://user@localhost
postgresql://user:secret@localhost
postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp
postgresql://localhost/mydb?user=other&password=secret
```

we're going to use

```
postgresql://user:password@localhost:5432/auth
```

## just a precaution

an npm version of mysql needs to be installed, either mysql or mysql2, it's a dev dependancy but you may need to install it via
```console
[user@linux ~]$ npm i -g mysql
```
or
```console
[user@linux ~]$ npm i -g mysql2
```

## install sequelize

```console
[user@linux weauth]$ npm i -g sequelize-cli
```

We run sequelize in the root of our weauth repo to autogenerate some tables from json schema's
The configuration is set in db/config/config.json and is used at db/model/index.js to initialize sequelize

MAKE SURE THAT POSTGRESQL DB "auth" OR WHATEVER YOU WANT TO USE EXISTS FIRST
```console
[user@linux weauth]$ sequelize db:migrate
```

## HELPFUL POSTGRES KNOWLEDGE 

```\dg``` shows roles AKA users
```console
user=# \dg
                             List of roles
 Role name |                   Attributes                   | Member of
-----------+------------------------------------------------+-----------
 user      | Create DB                                      | {}
 postgres  | Superuser, Create role, Create DB, Replication | {}
```

add attributes to role

```console
user=# ALTER ROLE user WITH SUPERUSER CREATEROLE REPLICATION;
ALTER ROLE
user=# \dg
                             List of roles
 Role name |                   Attributes                   | Member of
-----------+------------------------------------------------+-----------
 lopu      | Superuser, Create role, Create DB, Replication | {}
 postgres  | Superuser, Create role, Create DB, Replication | {}

user=# _
```

if you fall into authentication woes then you'll have to read about md5, trust, peer, ident authentication methods, ident is annoying, so we want md5, trust, or peer

## TO RESTART POSTGRESQL

```console
[user@linux weauth]$ /etc/init.d/postgresql reload
```

or 

```console
[user@linux weauth]$ ./scripts/repost.sh
```
