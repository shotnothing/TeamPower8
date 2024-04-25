<p align="center"><img src="logo.png" alt="PriceProbe" width="300" style="text-align:center"/></p>

## Welcome!

![](https://github.com/shotnothing/TeamPower8/actions/workflows/django.yml//badge.svg)

PriceProbe is a platform that provides data-driven pricing optimization solutions. 
This is a repo for the API server that powers the PriceProbe platform, as well as scraping and data processing utilities.

Currently, this is a monorepo with all our code in one place. Do take a look at each individual folder for each component of this platform and feel free to raise an [issue](https://github.com/shotnothing/TeamPower8/issues) or start a [discussion](https://github.com/shotnothing/TeamPower8/discussions).

## Quickstart
#### Prerequesites 
Before starting the backend, you will need a Supabase account and setup the authentication and tables, as shown in our [wiki](https://github.com/shotnothing/TeamPower8/wiki).

You will also need to compute the analytics. It will take a very long time without a GPU, so we have provided the precaulclated analytics results in a seperate git repo. To use it, do
```bash
cd ./analytics/
mkdir export
cd ./export/
git clone https://github.com/shotnothing/DSA3101-Checkpoint.git
mv ./DSA3101-Checkpoint/* ./ 
rm -rf ./DSA3101-Checkpoint
# In windows, rm -r -Force ./DSA3101-Checkpoint
cd ../../
```

Alternatively, if you want to run it yourself (WARNING: It can take >1 hour to run if you don't have a good GPU), do 
```bash
mkdir ./analytics/export
python ./analytics/analytics.py
```

#### Setup
To start both the frontend and backend, do
```bash
docker-compose up
```

To just run the frontend, do
```bash
docker-compose up webapp
```

To just run the backend, do
```bash
docker-compose up api
```

## Introduction

Take a look at each directory for details on individual components.

Our rough architecture is as follows:

```
Scrapers -> Database(PostgreSQL on Supabase) -> Backend Server(Django on EC2) -> Frontend Server(React on WIP)
```

Some things you may find useful:
- We currently host the server as an AWS EC2 instance.
- We use docker to manage our environment.
- We host our PostgreSQL database that contains collected pricing and product data on Supabase.

## Support

- [Wiki](https://github.com/shotnothing/TeamPower8/wiki)

