#!/bin/bash
###############################################
# To use: 
# https://raw.github.com/gist/2776351/???
# chmod 777 install_postgresql_apt-get.sh
# ./install_postgresql_apt-get.sh
###############################################
echo "*****************************************"
echo " Installing PostgreSQL on Ubuntu"
echo "*****************************************"
	sudo apt-get install postgresql postgresql-devel postgresql-contrib postgresql-docs -y
sudo service postgresql initdb
# Use MD5 Authentication
sudo sed -i.bak -e 's/ident$/md5/' -e 's/peer$/md5/' /var/lib/pgsql9/data/pg_hba.conf
#start
sudo /sbin/chkconfig --levels 235 postgresql on
sudo service postgresql start

# http://imperialwicket.com/aws-install-postgresql-on-amazon-linux-quick-and-dirty

