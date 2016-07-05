## Requirements
 - Node 6.0.0
 - NPM 3.8.6
 - Babel 5


## Local development
 - `npm install`
 - `bower install`
 - `npm run start`
 - `open https://localhost:7000`

 ## Production
 - `npm run set-schema-production`
 - `npm run build`
 - `npm run production`

## Deploying
- Install Ansible (http://docs.ansible.com/ansible/intro_installation.html)
- Install roles from requirements list. Command: `sudo ansible-galaxy install -r ./ansible/requirements.yml`

### Deploying to server
- `./deploy {inventory}` - Fast deployment, inventroy it's .ini file in ansible direcotry (e.g. staging, production etc.)
or
- `ansible-playbook -i ./ansible/{inventory}.ini ./ansible/site.yml` - Flexible deployment through ansible-playbook.

### Run react application

To stop/start/restart react js application

    sudo service kwhen-frontend-client start
    sudo service kwhen-frontend-client stop
    sudo service kwhen-frontend-client restart


## Local development

(DEPRECATED - only used when working with rethinkdb/horizon.io locally which isn't needed atm)

 - `npm install horizon -g`
 - `npm install`
 - `bower install`
 -  install RethinkDB // https://www.rethinkdb.com
 - `npm run db`
 - `hz create-cert`
 - `npm run set-schema-dev`
 - `npm run start`
 - `open https://localhost:7000`
