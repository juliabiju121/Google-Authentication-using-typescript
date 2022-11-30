import axios from 'axios';
import mysql from 'mysql2';

class UserModel {
    public static initializeConnection():mysql.Connection {
        var db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'etable1',
            port: 3307
        })
        db.connect((err) => {
            if (!err) {

                console.log("Connected to MySql");
            }
            else {
                console.log("Not connected");
            }
        })
        return db;
    }

    
   
    }
export default UserModel;