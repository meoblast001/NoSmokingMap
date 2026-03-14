#
# Client build container. Results passed to server by bind mount.
#

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev-base

FROM node:25 AS dev-client

WORKDIR /src

RUN echo "0.0.0" > version.txt
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig.json webpack.config.js ./
COPY Client ./Client

CMD ["npx", "webpack", "watch", "--mode=development"]

#
# Server container.
#

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev-server

WORKDIR /src

COPY NoSmokingMap.sln NoSmokingMap.csproj ./
RUN dotnet restore

COPY ./ ./

EXPOSE 5218

CMD ["dotnet", "watch", "--no-hot-reload", "--urls", "http://0.0.0.0:5218", "/p:SkipClientBuild=true", "/p:SkipVersionGeneration=true"]
