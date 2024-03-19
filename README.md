<p align="center"><img src="logo.png" alt="PriceProbe" width="300" style="text-align:center"/></p>


## Welcome!

![](https://github.com/shotnothing/TeamPower8/actions/workflows/django.yml//badge.svg)

PriceProbe is a platform that provides data-driven pricing optimization solutions. 
This is a repo for the API server that powers the PriceProbe platform, as well as scraping and data processing utilities.

Currently, this is a monorepo with all our code in one place. Do take a look at each individual folder for each component of this platform and feel free to raise an [issue](https://github.com/shotnothing/TeamPower8/issues) or start a [discussion](https://github.com/shotnothing/TeamPower8/discussions).

## Usage

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

