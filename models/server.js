const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            usersLogin: '/api/auth',
            usersPath: '/api/users',
            deliveries: '/api/deliveries'
        }

        //DB Connection
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Routes
        this.routes();
    }

    async connectDB(){
        await dbConection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Read and parse body
        this.app.use(express.json());

        //Public directory
        this.app.use(express.static('public'));

    }

    routes(){
        this.app.use(this.paths.usersLogin, require('../routes/login.routes'));
        this.app.use(this.paths.usersPath, require('../routes/user.routes'));
        this.app.use(this.paths.deliveries, require('../routes/deliveries.routes'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('App running in port ', this.port);
        });
    }
}

module.exports = Server;