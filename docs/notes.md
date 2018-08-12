# HELPFUL STUFF 

### RUN ASAP
```bash
npm i
```

### INSTALL POSTGRESQL VIA APT-GET/YUM

```bash
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

### USING THE POSTGRESQL SHELL

you can then enter the postgresql shell via 

```sudo -u postgres psql 
// postgres : linux username , psql : linux cli program
```
```
/** 
 * I THINK IT'S STUPID THAT THE USER IS POSTGRES 
 * THE PACKAGES ARE CALLED POSTGRESQL
 * AND THE CLI IS PSQL
 * WUT o.O
 **/
 ```

##### create a psql user, the one which will be running the sequelize command below

```bash
[user@linux ezconnect]$ whoami
user
[user@linux ezconnect]$ sudo -u postgres psql
psql (9.4.17)
Type "help" for help.

postgres=# CREATE ROLE user LOGIN;
CREATE ROLE
postgres=# CREATE DATABASE user;
CREATE DATABASE
postgres=# CREATE DATABASE ezconnect;
CREATE DATABASE
postgres=# ALTER USER user WITH PASSWORD 'password';
ALTER USER
```

##### check the port in the PSQL Shell
```bash
[user@linux ezconnect]$ sudo -u postgres psql
[sudo] password for user: _______
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
postgresql://user:password@localhost:5432/ezconnect
```

## just a precaution

an npm version of mysql needs to be installed, either mysql or mysql2, it's a dev dependancy but you may need to install it via
```bash
[user@linux ~]$ npm i -g mysql
```
or
```bash
[user@linux ~]$ npm i -g mysql2
```

## install sequelize

```bash
[user@linux ezconnect]$ npm i -g sequelize-cli
```

We run sequelize in the root of our ezconnect repo to autogenerate some tables from json schema's
The configuration is set in db/config/config.json and is used at db/model/index.js to initialize sequelize

```bash
[user@linux ezconnect]$ sequelize db:migrate
```

## HELPFUL POSTGRES KNOWLEDGE 

```\dg``` shows roles AKA users
```bash
user=# \dg
                             List of roles
 Role name |                   Attributes                   | Member of
-----------+------------------------------------------------+-----------
 user      | Create DB                                      | {}
 postgres  | Superuser, Create role, Create DB, Replication | {}
```

add attributes to role

```bash
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

```bash
[user@linux ezconnect]$ /etc/init.d/postgresql reload
```

or 

```bash
[user@linux ezconnect]$ ./scripts/repost.sh
```
