No Smoking Map
==============

A web application for finding non-smoking bars in your city and making it easy to update information about whether bars
allow smoking. Data is based on OpenStreetMap (querying with Overpass).

### Development - Getting started

Set up your configuration by first copying the template:

```shell
cp appsettings.Development.template.json appsettings.Development.json
```

Then open `appsettings.Development.json` and replace `OAuthSettings.ClientId` and `OAuthSettings.ClientSecret` with your
development OAuth credentials. Do so by logging into the
[OSM dev environment](https://master.apis.dev.openstreetmap.org/) and going to "My Account > OAuth 2 Applications".

You will then need to create and install a fake SSL certificate. Navigate to the subdirectory `certs/` and execute:

```shell
mkcert -install
mkcert localhost
```

Return to the project root, build the docker images, and finally start the containers in watch mode.

```shell
docker compose build
docker compose watch
```

Wait a moment for the services to come online and then navigate in the browser to
[https://localhost:5219](https://localhost:5219) to see the application. For subsequent starts, you only need to run the
final watch command. You will need to recreate your SSL certificate when it expires.
