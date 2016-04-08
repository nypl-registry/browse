# NYPL Labs Boilerplate - Webpack + React

## Install

```shell
npm install
```
## Develop

```shell
npm start
```

This will run a development server on [http://localhost:3000](http://localhost:3000).

```shell
npm run lint
```
It is recommended that you add an [ESLint](http://eslint.org/) plugin to your preferred code editor, but you can also use this command.

## Build

```shell
npm run build
```

## Deploy

To deploy you need to have ansible installed (needs to be python2.7)

```
pip install ansible
```
Then just execute the /scripts/deploy.sh

```
./scripts/deploy.sh
```

It will delete/make the dist dir, copt prod_index.html from the root to dist, build the bundle.js and other dist files and execute the ansible playbook that logs into the server and updates/restarts the server
You need to have the private key on your system and have the registry-webserver in your ./ssh/config for it to work.


```
Host registry-webserver 123.123.123.123
    Hostname 123.123.123.123
    IdentityFile ~/.ssh/the_key
    User root
```
    