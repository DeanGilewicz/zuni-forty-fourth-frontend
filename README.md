<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h2 align="center">🏠 Zuni Forty Fourth Frontend 🏠</h2>
  <p align="center">
    A Vue JS Application!
  </p>
</div>

<br />
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#deployment">Deployment</a></li>
  </ol>
</details>

<br />

## About The Project

This application was built as the frontend for Zuni Forty Fourth Backend where each resident can learn a little more about their neighbors by seeing who their contact information and who lives where. Users can also view upcoming community events and available companies for utilities, internet etc.

There were several reasons for working on this project, including the chance to:

- implement UI with Vue JS
- handle authentication via JWT
- integrate with REST API
- write unit tests with Mocha / Chai
- write e2e tests with Cypress
- work with SCSS

In order to access the application, users receive an "invitation" email, which is either to join as an `owner` or `user`.

An `owner` invitation will direct the user to `/owner-registration-confirmation` to complete the form and register.

A `user` invitation will direct the user to `/user-registration-confirmation` to complete the form and register.

Once confirmed, the user can `login` with the `temp password` provided in their invitation email.

When logged in, the user can visit `my profile` and update their details along with changing their password.

Should a user forget their password then they can visit `/forgot-password` and complete the form. Once submitted, they will receive an email with a `reset code` and be directed to `/forgot-password-reset` to use this code and change their password.

As an `owner` you are able to invite a `user` to join the application as a household member of the property that you belong to. An `owner` is also able to delete a `user` that belongs to the same property as the `owner`.

As a `user` you are not able to modify or invite other users.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### **Built With**

Below is a list of the major pieces of the tech stack that were used for this application.

- [![VueJS][vuejs]][vuejs-url]
- [![Mocha][mocha]][mocha-url]
- [![Chai][chai]][chai-url]
- [![Cypress][cypress]][cypress-url]
- [![JWT][jwt]][jwt-url]
- [![Sass][sass]][sass-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Getting Started

The following information will provide you with the details necessary to get the application up and running locally.

### **Prerequisites**

On your operating system of choice, ensure that [NodeJS](https://nodejs.org/en/) version `16.13.2` is installed. It is recommended that a Node Version Manager be used, such as [NVM](https://github.com/nvm-sh/nvm). When installing `NodeJS` this way, the correctly associated `npm` version should automatically be installed.

```sh
nvm install node@16.13.2
```

### **Installation**

Once `NodeJS` and `npm` are installed you can follow these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/DeanGilewicz/zuni-forty-fourth-frontend.git
   ```
2. Install NPM packages
   ```sh
   npm i
   ```
3. Run the application
   ```sh
   npm run serve
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Usage

This application provides a variety of commands in `package.json`:

- serve
  - compiles and hot-reloads app for development running on a local server
- build
  - compiles and minifies app for production
- lint
  - lints and fixes code based on eslint config
- test:e2e
  - runs end to end tests via Cypress
- test:unit
  - runs unit tests via Mocha / Chai

Once the server is up and running `npm run serve` you can visit [http://localhost:8080/](http://localhost:8080/) to view the app.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Deployment

Vue creates a `dist` folder containing the minified production-ready code which can be deployed to a variety of services.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[vuejs]: https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=ffffff
[vuejs-url]: https://vuejs.org/
[mocha]: https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=ffffff
[mocha-url]: https://mochajs.org/
[chai]: https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai
[chai-url]: https://www.chaijs.com/
[cypress]: https://img.shields.io/badge/Cypress-ffffff?style=for-the-badge&logo=cypress&logoColor=17202C
[cypress-url]: https://www.cypress.io/
[jwt]: https://img.shields.io/badge/jwt-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=ffffff
[jwt-url]: https://jwt.io/
[sass]: https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=ffffff
[sass-url]: https://sass-lang.com/
