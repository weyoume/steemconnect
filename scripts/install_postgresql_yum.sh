#!/bin/bash
###############################################
# To use: 
# https://raw.github.com/gist/2776351/???
# chmod 777 install_postgresql.sh
# ./install_postgresql.sh
###############################################
echo "*****************************************"
echo " Installing PostgreSQL"
echo "*****************************************"
sudo yum -y install postgresql94 postgresql94-server
# /usr/pgsql-9.4/bin/postgresql94-setup initdb

sudo service postgresql initdb
# Use MD5 Authentication
sudo sed -i.bak -e 's/ident$/md5/' -e 's/peer$/md5/' /var/lib/pgsql94/data/pg_hba.conf
#start
sudo /sbin/chkconfig --levels 235 postgresql on
sudo service postgresql start

# http://imperialwicket.com/aws-install-postgresql-on-amazon-linux-quick-and-dirty

