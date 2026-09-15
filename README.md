# Resolvia — Technical Support & Ticket Management System

Resolvia is a responsive technical support and ticket management system built with React.js.

It allows users to create, track, search, filter and manage customer support tickets.

## Features

- Create support tickets
- View ticket details
- Update ticket status and priority
- Add resolution notes
- Search tickets
- Filter by status and priority
- Dashboard ticket statistics
- Responsive UI
- REST API integration

## Tech Stack

- React.js
- JavaScript
- Tailwind CSS
- React Router
- REST API
- JSON Server
- Git & GitHub

## REST API

Currently uses JSON Server as a local REST API.

### Endpoints

- GET /tickets
- GET /tickets/:id
- POST /tickets
- PATCH /tickets/:id

## Getting Started

### Install dependencies

npm install

### Start the REST API

npx json-server db.json --port 3001

### Start the React application

npm run dev

Application:
http://localhost:5173

API:
http://localhost:3001

## Project Structure

src/
├── services/
│   └── ticketService.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx

db.json

## Current Status

Core ticket management functionality and REST API integration are implemented.

The project is actively being enhanced with additional features and UI improvements.