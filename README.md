# Crosskey Frontend Test Assignment

- This is a web application developed for Crosskey frontend test assignment.
- This app allows users to view, search, add/remove to favourites, and analyze financial data related to funds.
- The application is built using Angular 17 and the data is fetched from a REST API.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Author](#author)

## Features

- **View Funds**: Display a list of funds and their performance displayed using mat-table
- **View Individual Fund**: Display individual fund details using mat-dialog
- **Sort Funds:** Sort funds by various header cells using mat-sort-header
- **Search Funds:** Search for funds by name, company and ISIN using mat-form-field and mat-input
- **Local Storage Management:** Add and remove favourites to local storage.
- **Benchmark Analysis:** Evaluate funds against benchmark performance based on average respective periods of all funds.
- **Graphical Representation:** Visualize fund performance using Chart.js
- **Data Insights:** Access key financial metrics for each fund.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NafiRanta/crosskey-exercise.git

   ```

2. Navigate to the project directory:

   ```bash
   cd funds
   ```

3. Install the dependencies:

   ```bash
    npm install
   ```

## Usage

1. Run the application:

   ```bash
   ng serve
   ```

2. Navigate to `http://localhost:4200/` in your browser.
3. Explore the application!

## Author

- Nafisah Rantasalmi
