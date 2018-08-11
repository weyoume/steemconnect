# HELPFUL STUFF 

### RUN ASAP
```console
npm i
```

### INSTALL POSTGRESQL VIA APT-GET/YUM

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
[user@linux ezconnect]$ whoami
user
[user@linux ezconnect]$ sudo -u postgres psql
psql (9.2.24)
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
[sudo] password for user:
psql (9.2.24)
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

```console
[user@linux ezconnect]$ npm i -g sequelize-cli
```

We run sequelize in the root of our ezconnect repo to autogenerate some tables from json schema's

```console
[user@linux ezconnect]$ sequelize db:migrate --url 'postgresql://user:password@localhost:5432/ezconnect'
```

or

```console
[user@linux ezconnect]$ ./scripts/migrate_with_sequelize.sh
```
