FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY API/*.csproj ./API/
RUN dotnet restore

# copy everything else and build app
COPY API/. ./API/
WORKDIR /source/API
RUN dotnet publish -c release -o /published

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /published ./
ENTRYPOINT ["dotnet", "API.dll"]