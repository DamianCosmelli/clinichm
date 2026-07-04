FROM mcr.microsoft.com/dotnet/sdk:8.0

RUN apt-get update && apt-get install -y xz-utils --no-install-recommends && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://nodejs.org/dist/v18.20.4/node-v18.20.4-linux-x64.tar.xz \
    | tar -xJ -C /usr/local --strip-components=1 \
    && node --version && npm --version
