# Websocket Chat

A websocket chat application built with socket.io, React.js, Express.js, Node.js and MongoDB.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

- [Node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Installing

- Clone the repository

- Add **variables.env** to the project root

  - example: variables.env

```
NODE_ENV=development
DATABASE=mongodb://<dbuser>:<dbpassword>@<dburi>
SECRET=choclatechip
KEY=cookiesncream
PORT=7777
```

- Install dependencies and seed the database with sample data

```
npm run build
```

- Run the development servers

```
npm run dev
```

## Users

| Name  | Email (login)  | Password |
| ----- | -------------- | -------- |
| Admin | admin@mail.com | admin    |
| Ben   | ben@mail.com   | ben      |
| Eli   | eli@mail.com   | eli      |

## Built With

- [React](https://reactjs.org/) - The client side javascript framework
- [Semantic UI](https://react.semantic-ui.com) - ui framework
- [Socket.io](https://socket.io/) - Web socket library for realtime bi-directional communication between wb clients and servers.
- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Node.js web application framework

## License

This project is licensed under the MIT License
