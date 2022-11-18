<div style="text-align:center;">
  <h1>Url Shortner</h1>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Tech stack includes</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running-the-app">Running</a></li>
      </ul>
    </li>
    <li><a href="#endpoints">Endpoints</a></li>
    <li><a href="#test">Test</a></li>
    <li><a href="#important-notice">Important notice</a></li>
    <li><a href="#contact">Developers Contact</a></li>
  </ol>
</details>

## About the project
It's a project to built a url shortner microservice which will support some functionalities like expiration time, domain blacklisting and domain clearance.
The key features of this is expiration timeout and blacklisting domains. This will give the admin much more controll over the service. Hope you will enjoy using it.

## Build with
1. Nodejs
2. Nestjs
3. Typescript
4. Mongodb
5. Docker
6. JWT
7. Express
8. OpenApi

## Getting started
Lets begin with the Prerequisites and installation processes.

### Prerequisites
* Nodejs
* NestCLi
```bash
  npm i -g @nestjs/cli
```
* Typescript
```bash
  npm install typescript -g
```
* Mongodb

### Installation
To install all the dependencies run.

```bash
npm install
```
Note: There are 3 environment files included with this project.
1. local.env
2. dev.env
3. production.env

If you see the scripts of package.json file, you will see these scripts.
```bash
#local
"start:local": "cross-env NODE_ENV=local nest start --watch"
```
```bash
#dev
"start:dev": "cross-env NODE_ENV=dev node main"
```
```bash
#production
"start:prod": "cross-env NODE_ENV=production node main"
``` 
These NODE_ENV variables data is aligned with those environment files.'local'command is mainly for local development purpose.'dev' and 'prod' commands are for using on cloud environments.

### Running the app

```bash
# local development
npm run start:local

# dev environment
npm run start:dev

# production environment
npm run start:prod
```

## Endpoints
After running the code you will have all the endpoints available for making the api calls. I have not included any information of the endpoints seperately here as they are already properly documented in the SWAGGER link. After running the project, you can just go to the browser and get all of them using the link.
```bash
http://yourdomain/api/docs
```

## Test
I have only added unit test for the project.

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```



## Important notice
For the admin endpoints you need to add an extra header named 'x-auth-token'. Otherwise it won't work.
### How to get 'x-auth-token' token?
You can get that token from the endpoint 
```bash
http://yourdomain/auth/token/super-admin/sign
```
This endpoint is a part of Auth controller. This can be easily get from the swagger documentation.
### How to add the token to header?
If you are use browser, you can add it using MODHEADER browser extension. Otherwise postman or insomnia has that options available to add custom header with the request.

### Dockerfile configuration
There is a Dockerfile included with the project. So anyone can create an image of it and run it using Docker container. If you check the Dockerfile, at the end line of it has command 

```bash
CMD ["npm", "run", "start:dev"]
```
Which indicates on which environment you want to run the app. So please change it according to the information mentioned above if you want to run different environment file.

### BlackList file
All the blacklisted pattern or regex is added to the file.
```bash
src/utils/BLACKLIST.ts
```
Please update this file if you want to add more on the list.
### Env files config

Also inside the env files there are 2 variables named PORT and BASE_URL. Those are very important to make sure that which port you want to run the application and the BASE_URL will be the domain you will run this application.So Please modify it accordingly before your installation.

### Testing configuration
There are 2 testing files included in this project.
1. src/app.controller.spec.ts
2. src/url_shortner/test/urlshortner.controller.spec.ts

If anyone want to write more tests, you are welcome to write more.

Last but not the least, inside the local.env file there is an extra variable added named MONGODB_URI_TEST.
This variable is used to run test so that we can use seperate db for testing.
As I have preferred to use test DB rather using mock,fake or stubs.
But don't worry test DB will be removed after the test run. Since tests are only used to run in the local development period.That's why I have kept it on local env file only. I hope that makes sense.

## Contact

- Author - [Naieem Mahmud Supto](https://github.com/naieem)
