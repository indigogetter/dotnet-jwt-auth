# dotnet-jwt-auth

This project was developed targeting dotnet core v2.2.203.  It provides an example of a custom built JWT authentication scheme.

SQL scripts were written for a MySQL database engine.  My development environment used MySQL Workbench v8.0.16.

The front-end is developed using the ReactJS framework, initialized with `npx create-react-app`.

The project provides a basis and may be extended into something more production ready by creating SSL certificates to communicate over https, or by placing the project behind a reverse proxy such as NGINX.  In such a scenario, it is highly recommended that the consumer review and revise the choice of database name (DotnetJwtAuth) and project namespaces (Indigogetter.*).  I recommend using this guide as a guide -- file by file -- rather than cloning or forking the project blindly.  To maximize the benefit of a thorough review, comments have been placed throughout to facilitate knowledge transfer.


## Building the API

From the project root:

```
cd Api
cd Indigogetter.WebService.Auth
dotnet publish -c Release -o bin/out
```


## Running the API

From the project root:

```
dotnet Api/Indigogetter.WebService.Auth/bin/out/Indigogetter.WebService.Auth.dll
```


## Building the Client (Production)

From the project root:

```
cd Client
cd react-client
npm run build
```

## Running the Client (Dev Mode)

From the project root:

```
cd Client
cd react-client
npm start
```

