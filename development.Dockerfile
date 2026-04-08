#
# Client build container. Results passed to server by bind mount.
#

FROM node:25 AS dev-client

WORKDIR /src

ARG UID=1000
ARG GID=1000

RUN set -eux; \
    if ! getent group "${GID}" >/dev/null; then groupadd --gid "${GID}" devgroup; fi; \
    if ! getent passwd "${UID}" >/dev/null; then useradd --uid "${UID}" --gid "${GID}" --create-home --shell /bin/bash devuser; fi; \
    mkdir -p /home/devuser; \
    chown -R "${UID}:${GID}" /home/devuser /src

ENV HOME=/home/devuser

USER ${UID}:${GID}

RUN echo "0.0.0" > version.txt
COPY --chown=${UID}:${GID} package.json package-lock.json ./
RUN npm install

CMD ["npx", "webpack", "watch", "--mode=development"]

#
# Server container.
#

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev-server

WORKDIR /src

ARG UID=1000
ARG GID=1000

RUN set -eux; \
    if ! getent group "${GID}" >/dev/null; then groupadd --gid "${GID}" devgroup; fi; \
    if ! getent passwd "${UID}" >/dev/null; then useradd --uid "${UID}" --gid "${GID}" --create-home --shell /bin/bash devuser; fi; \
    mkdir -p /home/devuser; \
    chown -R "${UID}:${GID}" /home/devuser /src

ENV HOME=/home/devuser

USER ${UID}:${GID}

COPY --chown=${UID}:${GID} NoSmokingMap.sln NoSmokingMap.csproj ./
RUN dotnet restore

EXPOSE 5218

CMD ["dotnet", "watch", "--no-hot-reload", "--urls", "http://0.0.0.0:5218", "/p:SkipClientBuild=true", "/p:SkipVersionGeneration=true"]
