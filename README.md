# Coronavirus UK League Table

Simple script to parse the CSV data from the [UK Coronavirus Dashboard](https://coronavirus.data.gov.uk/) and present the most recent 7-day rolling average positive cases per 100k population in a league table.

## Requirements

- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

## Setup

Install dependencies be running:

```
yarn install
```

## Running

Download the latest data to the `input.csv` file by running:

```
yarn download-data
```

Generate the table from this data by running:

```
yarn start
```
