No Smoking Map
==============

A web application for finding non-smoking bars in your city and making it easy to update information about whether bars
allow smoking. Data is based on OpenStreetMap (querying with Overpass).

### Getting started

Open a command line to this directory and first build the client (NPM, Webpack) after installing NPM:

```shell
npm install
npm run build-dev
```

Then set up your configuration by first copying the template:

```shell
cp appsettings.Development.template.json appsettings.Development.json
```

Then open `appsettings.Development.json` and replace `OAuthSettings.ClientId` and `OAuthSettings.ClientSecret` with your
development OAuth credentials. Do so by logging into the
[OSM dev environment](https://master.apis.dev.openstreetmap.org/) and going to "My Account > OAuth 2 Applications". Set
`OAuthSettings.RedirectUri` to the URL your server will use, such as `https://localhost:5219/osm_auth/post_auth`.

Set up your connection string in `appsettings.Development.json` to a PostgreSQL database.

Then, build, run migrations, and run the server as follows:

```shell
dotnet build
dotnet ef database update
dotnet run --urls "https://localhost:5219"
```

Navigate in the browser to [https://localhost:5219](https://localhost:5219).

Make sure to rerun `npm run build-dev` any time you make client changes and `dotnet build` any time you make server
changes.
