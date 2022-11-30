import express, { Application } from 'express';
import mongoose from 'mongoose';
import mysql from "mysql2";
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import Controller from '@/utils/interfaces/controller.interfaces';
import ErrorMiddleware from './middleware/error.Middleware';
import helmet from 'helmet';
import UserController from './resources/user/user.router';
import UserModel from './resources/user/user.model';
import UserService from './resources/user/user.controller';


class App {
    public express:Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        
        this.initialiseDatabaseConnection();
        UserService.db = UserModel.initializeConnection()
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();

    }
    private initialiseMiddleware(): void {

        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));

    }
    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/', controller.router);

        });


    }
    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        var db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'etable1',
            port: 3307
        })
        db.connect((err: any) => {
            if (!err) {
        
                console.log("Connected to MySql");
            }
            else {
                console.log("Not connected");
            }
        })

    }
    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`app listening on port ${this.port}`);

        });
    }

}
 export default App; 