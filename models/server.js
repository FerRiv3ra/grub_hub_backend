const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      adminsPath: '/api/admins',
      deliveries: '/api/visits',
      eventsPath: '/api/events',
      uploadPath: '/api/upload',
      usersLogin: '/api/auth',
      usersPath: '/api/users',
    };

    //DB Connection
    this.connectDB();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();
  }

  async connectDB() {
    await dbConection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Read and parse body
    this.app.use(express.json());

    //Public directory
    this.app.use(express.static('public'));

    //Upload files
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.adminsPath, require('../routes/admins.routes'));
    this.app.use(this.paths.usersLogin, require('../routes/login.routes'));
    this.app.use(this.paths.usersPath, require('../routes/user.routes'));
    this.app.use(this.paths.deliveries, require('../routes/deliveries.routes'));
    this.app.use(this.paths.eventsPath, require('../routes/event.routes'));
    this.app.use(this.paths.uploadPath, require('../routes/upload.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('App running in port ', this.port);
    });
  }
}

module.exports = Server;
