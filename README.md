<p align="center"><img src="logo.png" alt="PriceProbe" width="300" style="text-align:center"/></p>

## Welcome!👋

![](https://github.com/shotnothing/TeamPower8/actions/workflows/django.yml//badge.svg)

PriceProbe is a platform that provides data-driven pricing optimization solutions. 
This is a repo for the API server that powers the PriceProbe platform, as well as scraping and data processing utilities.

Currently, this is a monorepo with all our code in one place. Do take a look at each individual folder for each component of this platform and feel free to raise an [issue](https://github.com/shotnothing/TeamPower8/issues) or start a [discussion](https://github.com/shotnothing/TeamPower8/discussions).

The website server is at http://3101.jwen.cc:3000/.
The API server is at http://3101api.jwen.cc/. 

Try [http://3101api.jwen.cc:80/api/product/p/531](http://3101api.jwen.cc:80/api/product/p/531)!

## Quickstart
#### Installation
First, clone the repo

```bash
git clone https://github.com/shotnothing/TeamPower8.git
cd TeamPower8
```

#### Setup 
**(Backend Only)** Before starting the backend, you will need a Supabase account and setup the authentication and tables, as shown in our [wiki](https://github.com/shotnothing/TeamPower8/wiki).
Set the Supabase credentials to your top-level `.env` file with:
```
SUPABASE_KEY=<your key>
SUPABASE_URL=<your url>
```
This file should be at the same level as docker-compose.yaml. If it dosen't exist, create the .env file and put the credentials in.

**(Frontend Only)** You also need to set your NextJS and Google credentials in ./webapp/.env.local, as specified in the tech report (not shared in this repo, contact a team member for a copy):
```
NEXTAUTH_SECRET=<>
NEXTAUTH_URL=<API server URL (localhost or http://3101.jwen.cc)>:3000
GOOGLE_CLIENT_ID=<>
GOOGLE_CLIENT_SECRET=<>
```

**(Backend Only)** You will also need to compute the analytics. It will take a very long time without a GPU, so we have provided the precaulclated analytics results in a seperate git repo. The associated pre-scraped product data is also available in that repo as cleaned_rows.csv. To use it, do
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

#### Running
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

You can also run the backend unit tests with:
```bash
docker-compose up test
```

## Introduction

Take a look at each directory for details on individual components.

Our rough architecture is as follows:

```
Scrapers -> Database(PostgreSQL on Supabase) -> Backend Server(Django on EC2) -> Frontend Website
```

Some things you may find useful:
- We currently host the server as an AWS EC2 instance.
- We use docker to manage our environment.
- We host our PostgreSQL database that contains collected pricing and product data on Supabase.

## Support

- [Wiki](https://github.com/shotnothing/TeamPower8/wiki)
- [Docker compose up FAQ](https://github.com/shotnothing/TeamPower8/wiki/FAQ-for-docker-compose-up)

