# syntax=docker/dockerfile:1

################################################################################
# Build Environment - webapi

# Create a stage for building the application.
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS build-webapi

COPY ./webapi /source

WORKDIR /source

# This is the architecture you’re building for, which is passed in by the builder.
# Placing it here allows the previous steps to be cached across architectures.
ARG TARGETARCH

# Build the application.
# Leverage a cache mount to /root/.nuget/packages so that subsequent builds don't have to re-download packages.
# If TARGETARCH is "amd64", replace it with "x64" - "x64" is .NET's canonical name for this and "amd64" doesn't
#   work in .NET 6.0.
RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet publish -a ${TARGETARCH/amd64/x64} --use-current-runtime --self-contained false -o /app

################################################################################
# Node Image

FROM node:18-alpine AS node_base

################################################################################
# Run Environmnent - reactapp

FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS final-reactapp
COPY --from=node_base . .

WORKDIR /app
COPY /reactapp /app/reactapp

WORKDIR reactapp
RUN npm install
#ENTRYPOINT ["pwd"]
ENTRYPOINT ["npm","run","dev"]

################################################################################
# Run Environmnent - webapi

FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine AS final-webapi
WORKDIR /app

COPY --from=build-webapi /app /app/webapi
#COPY /reactapp /app/reactapp
COPY ./start.sh .
#COPY --from=build-reactapp /app ./reactapp

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser
USER appuser

#RUN ls -l start.sh
#RUN chmod +x /start.sh
ENTRYPOINT ["sh","start.sh"]