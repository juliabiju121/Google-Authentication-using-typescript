const express = require('express')
const mysql = require('mysql2');
var app = express();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
let getGoogleOAuthURL = require('./config/oauth');
const get_access_token = require('./config/getAcessToken');
const get_profile_data = require('./config/getprofiledata');
const e = require('express');
app.use(express.json());

//Connecting database
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

//creating users
app.post('/api', verifytoken, (req, res) => {
    let employee = req.body;
    if (employee.Name && employee.emailId && employee.password) {
        let sql = `INSERT INTO table1 (Name, EmailId, Password, isAuthUser) VALUES (?,?,?,?)`;
        db.query(sql, [employee.Name, employee.emailId, employee.password, false], (err, result) => {
            if (err) {
                res.send("Error: " + err);
            }
            else
                res.send(result);
        })
    }
    else {
        console.log("Cannot create User");
        res.status(500).send({ error: "Cannot Create User" });
    }
});

//Updating the user
app.put('/api/:id', verifytoken, (req, res) => {
    //console.log('reached put first line')
    const id = req.params.id;
    const employee = req.body;
    if (employee.Name) {
        let sql = `UPDATE table1
         SET Name = ?
             Where Id = ?`;

        let data = [employee.Name, id];
        db.query(sql, data, (err, result) => {
            if (err) {
                console.log("error:" + err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
});

//Delete a user
app.delete('/api/:id', verifytoken, (req, res) => {
    const id = req.params.id;
    let sql = `Delete from table1 where id=(?)`;
    db.query(sql, id, (err, result) => {
        if (err) {
            console.log("error:" + err);
        }
        else {
            res.send(result);
        }
    });

});

//retrieve 
app.get('/api', verifytoken, (req, res) => {
    let sql = `Select * from table1`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log("error: " + err);
        }
        else {
            console.log(result)
            res.send(result);
        }
    })
});

//middleware
function verifytoken(req, res, next) {
    console.log(req.headers);
    let authHeader = req.headers.authorization
    if (authHeader == undefined) {
        res.send("Token Not Provided")
    }
    let token = authHeader.split(" ")[1]
    jwt.verify(token, "secret", function (err, decoded) {
        if (err) {
            res.status(500).send({ error: "Aunthetication Failed" });
        }
        else {
            next();
        }
    })
}

//oauth
app.get('/re', async (req, res) => {
    console.log('Req query', req.query.code);
    let accessToken = await get_access_token(req.query.code)
    console.log(accessToken);
    let profiledata = await get_profile_data(accessToken.data.access_token)
    console.log(profiledata);
    let sql1 = `select emailId from table1 where emailId = '${profiledata.data.email}'`
    db.query(sql1, (err, result) => {
        if (err) {
            console.log("error: " + err);
        }
        let frontend = {
            emailId: profiledata.data.email,
        }
        if (result.length > 0 && result[0].emailId == profiledata.data.email) {
            let token = jwt.sign(frontend, "secret", { expiresIn: 86400 });
            res.send({ Authentication: 'True', token: token });
        }
        else {
            let sql2 = `INSERT INTO table1 (Name, EmailId, password, isAuthUser) VALUES (?,?,?,?)`;
            db.query(sql2, [profiledata.data.name, profiledata.data.email, null, true], (err, result) => {
                if (err) {
                    res.send("Error: " + err);
                }
                let token = jwt.sign(frontend, "secret", { expiresIn: 86400 });
                res.send({ Authentication: 'True', token: token });
            })

        }
    })
})

//Calling Oauth
app.get('/auth', (req, res) => {
    let redirect_uri = getGoogleOAuthURL()
    console.log(redirect_uri);
    res.redirect(redirect_uri)
})

// login
app.post("/login", jsonParser, function (req, res) {
    if (req.body.emailId == undefined || req.body.password == undefined) {
        res.status(500).send({ error: 'Authentication failed' })
        console.log('Sorry!..Authentication Failed')
        return;
    }
    let emailId = req.body.emailId;
    let password = req.body.password;
    let qr = `select Name from table1 where emailId='${emailId}' and password='${password}' and isAuthUser='false'`;
    db.query(qr, (err, result) => {
        if (err || result.length == 0) {
            console.log(' Sorry!.....Login failed')
            res.status(500).send({ ERROR: 'Login failed' });
            return;
        }
        let resp = {
            Id: result[0].Id,
            Name: result[0].Name
        }
        let token = jwt.sign(resp, "secret", { expiresIn: 86400 });
        res.send({ Authentication: "True", token: token });
    });
});

const port = 5000;
app.listen(5000, () => {
    console.log('Started')
});