# Fullstack-JS-chat-app

###### Mobile-first web chat application

A simple realtime chat application which was made using React JS, Node JS and MongoDB.

User interface of given software uses the reactive paradigm and is implemented as modern SPA. All specific components are connected with global store which is provided by redux toolkit. Diffrent pages interact with the own reducers only (code splitting technique introduced by reducers management approach).

Backend controllers and observers are implemented using Node JS. Observers are intended to monitor for changes of Mongo DB change streams. Mongo DB driver is provided by mongoose library.

Real time communication between client and server is provided by socket-io.

This is a responsive web application for viewing in both Mobile and Desktop.

### Screenshots
![This is an image](./screenshots/dialogpage.png)

### Meaningful features

- Unreaded messages counting for each dialog;
- Unreaded message label in single dialog mode (implemented via intersection observer API);
- Online labels everywhere: contacts, chat items, dialog page;
- JWT authentification control;
- Redux code splitting technique (to optimize resource consumption);
