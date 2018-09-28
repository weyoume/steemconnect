[![CircleCI Build Status](https://circleci.com/gh/WeYouMe/weauth.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/WeYouMe/weauth)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/WeYouMe/weauth/dev/LICENSE)
[![WeYouMe channel on Discord](https://img.shields.io/badge/chat-discord-738bd7.svg)](https://discord.gg/djnEYKN)

# WeAuth API and Console UI

## INSTALLATION INSTRUCTIONS

## Install Dependancies
##### Node.js >= 7.7.1 is required 
```
npm i
```

## Configure .env
##### configuration variables, postgresql instructions are below
```
NODE_API_URL=https://api.WeYouMe.io
NODE_API_URL_SERVER=https://api.WeYouMe.io
BROADCASTER_USERNAME=CHAIN_ACCOUNT_NAME_STRING
BROADCASTER_POSTING_KEY=CHAIN_ACCOUNT_POSTING_PRIVATE_KEY
JWT_SECRET=somerandomstringthatneedstostaysecret
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

## Install Postgresql, create a user, a database, and then generate required schemas
### All instructions are included below :D

## Install PostgreSQL

### Linux

#### apt-get
```
sudo apt-get install postgresql -y
sudo service postgresql initdb
sudo sed -i.bak -e 's/ident$/md5/' -e 's/peer$/md5/' /var/lib/pgsql9/data/pg_hba.conf
sudo /sbin/chkconfig --levels 235 postgresql on
sudo service postgresql start
// 1 liner
sudo apt-get install postgresql -y && service postgresql initdb && sed -i.bak -e 's/ident$/md5/' -e 's/peer$/md5/' /var/lib/pgsql9/data/pg_hba.conf && /sbin/chkconfig --levels 235 postgresql on && service postgresql start
```
#### yum
```console
sudo yum -y install postgresql94 postgresql94-server
sudo service postgresql94 initdb
sudo sed -i.bak -e 's/ident$/md5/' -e 's/peer$/md5/' /var/lib/pgsql94/data/pg_hba.conf
sudo service postgresql94 start
// 1 liner
sudo yum -y install postgresql94 postgresql94-server && service postgresql94 initdb && sed -i.bak -e 's/ident$/md5/' -e 's/peer$/md5/' /var/lib/pgsql94/data/pg_hba.conf && service postgresql94 start

```
or 
```./scripts/install_postgresql_yum.sh``` 
or 
```./scripts/install_postgresql_apt-get.sh``` 

### OSX

#### Brew
```console
brew install postgresql
brew services start postgresql
// 1 liner
brew install postgresql && services start postgresql
```

## Opening postgresql/postgres/psql through a cli, sh/bash

### Linux
```
sudo -u postgres psql 
// postgres = linux username , psql = linux cli program
```
### OSX
```console
psql postgres
```

## Create a psql user within the psql shell
#### this user will be used a lot
first open psql
##### LINUX
```console
sudo -u postgres psql
```
##### OSX
```console
psql postgres
```
then run
```console
whoami
user // this is the user you want to be creating within postgresql
sudo -u postgres psql
psql (9.4.17)
Type "help" for help.

postgres=# CREATE ROLE user LOGIN; // replace "user" with the username of the machine ie. what whoami returned above
CREATE ROLE
postgres=# CREATE DATABASE user;
CREATE DATABASE
postgres=# ALTER USER user WITH PASSWORD 'password';
ALTER USER
```

## Create the database that WeAuth will use
first open psql
##### LINUX
```console
sudo -u user psql // can just run psql if you made the user in postgresql/psql with the same username as your machine username ie. what whoami returns, the default postgresql username is postgres
```
##### OSX
```console
psql user // can leave blank if you made the user in postgresql/psql with the same username as your machine username ie. what whoami returns, the default postgresql username is postgres
```
then run
```console
postgres=# CREATE DATABASE weauth; // or name the database whatever you want
CREATE DATABASE
```

## check the port in the PSQL Shell
#### Hint. it's 5432
first open psql
##### LINUX
```console
sudo -u user psql // can just run psql if you made the user in postgresql/psql with the same username as your machine username ie. what whoami returns, the default postgresql username is postgres
```
##### OSX
```console
psql user // can leave blank if you made the user in postgresql/psql with the same username as your machine username ie. what whoami returns, the default postgresql username is postgres
```
then run
```console
password for user: __________
psql (9.4.17)
Type "help" for help.

postgres=# SHOW port;
 port
------
 5432
(1 row)

postgres=# _
```

## let's figure out our database url!
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
we're going to use, make sure to replace user, password, localhost, and weauth if you didn't use weauth for your postgresql database name
```
postgresql://user:password@localhost:5432/weauth
```

## just a precaution

an npm version of mysql needs to be installed, either mysql or mysql2, it's a dev dependancy but you may need to install it via
```console
npm i -g mysql
```
or try if necessary 
```console
npm i -g mysql2
```

## install sequelize

```console
npm i -g sequelize-cli
```

We use sequelize to autogenerate some tables and their schemas for postgresql from json schema's stored in db/models.
Sequelize will use a connection config stored at db/config.json which looks like the below, you'll have to fill in the username and password and database with the postgresql username and password and database you made above

```javascript
{
	"database": "weauth",
	"username": "user",
	"password": "password",
	"host" : "localhost",
	"logging": false,
	"dialect" : "postgres",
  "operatorsAliases": false,
  "pool": {
    "max": 150,
    "min": 0,
    "idle": 10000
	},
	"port":5432
}
```
## Set Up Psql

## Create Tables in PSQL
### run this in the root WeAuth directory you cloned to
```console
sequelize db:migrate
```

# Finally Running WeAuth
## Run Production
### Builds and Starts
```
npm run run
```
or
## Build Production
```
npm run build
```
## Start Production
```
npm run start
```

## Run Dev
### Builds and Starts
```
npm run rundev
```
or
## Build Dev
```
npm run builddev
```
## Start Dev
```
npm run startdev
```

# Docs
## Api
### Routes

*/api/me* - Get user profile (require user or app token)

*/api/* - Broadcast posting operation for user (require app token)

#### OAuth2
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

## POSTGRES HELPFUL STUFF 

will show a kind of state info showing the database and user you're in
```\conninfo```
```
psql (10.5)
Type "help" for help.

postgres=# \conninfo
You are connected to database "postgres" as user "postgres" via socket in "/tmp" at port "5432".
postgres=#
```

shows roles/users
```\dg``` 
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

shows databases
```\dt``` 
```console
user=# \dt
 auth      | lopu  | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 lopu      | lopu  | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 postgres  | lopu  | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 template0 | lopu  | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/lopu          +
           |       |          |             |             | lopu=CTc/lopu
 template1 | lopu  | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/lopu          +
           |       |          |             |             | lopu=CTc/lopu
```

connect to the database "database"
```\c database```
```console
user=# \dt
 public | SequelizeMeta | table | lopu
 public | apps          | table | lopu
 public | metadata      | table | lopu
 public | tokens        | table | lopu
```

shows tables in current database
```\dt```
```console
user=# \dg
                             List of roles
 Role name |                   Attributes                   | Member of
-----------+------------------------------------------------+-----------
 user      | Create DB                                      | {}
 postgres  | Superuser, Create role, Create DB, Replication | {}
```

shows a table's "table" schema
```\d table```
```console
 id            | integer                  |           | not null | nextval('apps_id_seq'::regclass)
 client_id     | character varying(255)   |           | not null |
 secret        | character varying(255)   |           | not null |
 owner         | character varying(255)   |           |          |
 redirect_uris | jsonb                    |           |          |
 name          | character varying(255)   |           |          |
 description   | text                     |           |          |
 icon          | text                     |           |          |
 website       | text                     |           |          |
 beneficiaries | jsonb                    |           |          |
 allowed_ips   | jsonb                    |           |          |
 is_approved   | boolean                  |           |          | true
 is_public     | boolean                  |           |          | false
 is_disabled   | boolean                  |           |          | false
 created_at    | timestamp with time zone |           | not null |
 updated_at    | timestamp with time zone |           | not null |
```

shows a table's data
```select * from "table"```
```console
  1 | weapp     | g34h4w6jw645h54 | webuilder   | ["https://alpha.weyoume.src", "http://alpha.weyoume.src"] | weapp | official weapp |      | alpha.weyoume.src |               |             | t           | t         | f           | 2018-09-26 05:54:41.036+10 | 2018-09-26 05:55:20.358+10
```

if you fall into authentication woes then you'll have to read about md5, trust, peer, ident authentication methods, ident is annoying, so we want md5, trust, or peer

## TO RESTART POSTGRESQL

```console
/etc/init.d/postgresql reload
```
or 
```console
./scripts/repost.sh
```