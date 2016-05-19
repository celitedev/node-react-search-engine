## Requirements
 - Ansible 2.0.2
 - Vagrant 1.8.1
 - VirtualBox 5.0

## Installation
 - Install VirtualBox (https://www.virtualbox.org/wiki/Downloads)
 - Install Vagrant (https://www.vagrantup.com/downloads.html)
 - Install Ansible (http://docs.ansible.com/ansible/intro_installation.html)
 - Clone repository
 - Run `sudo ansible-galaxy install -r ./ansible/requirements.yml`
 - Run `sudo -- sh -c "echo '192.168.33.35 kwhen.local' >> /etc/hosts"`
 - Run `vagrant up`
 - Run `vagrant provision`

## Local development
 - `npm install`
 - `bower install`
 - `npm start`
 - `npm run rendering`
 - `open localhost:7000`
