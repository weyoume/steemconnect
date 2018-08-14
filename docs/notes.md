# HELPFUL STUFF 

### RUN ASAP
```console
npm i
```

### INSTALL POSTGRESQL VIA APT-GET/YUM

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

```console
[user@linux ezauth]$ whoami
user
[user@linux ezauth]$ sudo -u postgres psql
psql (9.4.17)
Type "help" for help.

postgres=# CREATE ROLE user LOGIN;
CREATE ROLE
postgres=# CREATE DATABASE user;
CREATE DATABASE
postgres=# CREATE DATABASE ezauth;
CREATE DATABASE
postgres=# ALTER USER user WITH PASSWORD 'password';
ALTER USER
```

##### check the port in the PSQL Shell
```console
[user@linux ezauth]$ sudo -u postgres psql
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
postgresql://user:password@localhost:5432/ezauth
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
[user@linux ezauth]$ npm i -g sequelize-cli
```

We run sequelize in the root of our ezauth repo to autogenerate some tables from json schema's
The configuration is set in db/config/config.json and is used at db/model/index.js to initialize sequelize

```console
[user@linux ezauth]$ sequelize db:migrate
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
[user@linux ezauth]$ /etc/init.d/postgresql reload
```

or 

```console
[user@linux ezauth]$ ./scripts/repost.sh
```
