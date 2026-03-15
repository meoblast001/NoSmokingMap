FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Verify installation
RUN node -v && npm -v

WORKDIR /src

RUN echo "0.0.0" > version.txt
COPY package.json package-lock.json ./
RUN npm install

COPY NoSmokingMap.sln NoSmokingMap.csproj ./
RUN dotnet restore

COPY ./ ./
RUN dotnet build -c Release
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "NoSmokingMap.dll"]
