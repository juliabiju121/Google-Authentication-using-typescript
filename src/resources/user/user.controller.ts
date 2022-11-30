import HttpException from "@/utils/exceptions/http.exception";
import { NextFunction, Request, Response, Router } from "express";
import UserModel from "./user.model";

import Authentication from "../../utils/authentication";
let jwt =require('jsonwebtoken')

class UserService {
    
    static db: any;
    constructor() {
       
    }
    //createUser
    public static createNewUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        let employee = req.body;
        if (employee.Name && employee.emailId && employee.password) {
            let sql = `INSERT INTO table1 (Name, EmailId, Password, isAuthUser) VALUES (?,?,?,?)`;
            UserService.db.query(sql, [employee.Name, employee.emailId, employee.password, false], (err: string, result: any) => {
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
    };


    // update user 
    public static updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const id = req.params.id;
        const employee = req.body;
        if (employee.Name) {
            let sql = `UPDATE table1
             SET Name = ?
                 Where Id = ?`;

            let data = [employee.Name, id];
            UserService.db.query(sql, data, (err: string, result: any) => {
                if (err) {
                    console.log("error:" + err);
                    res.send(err);
                }
                else {
                    res.send(result);
                }
            });
        }
    }

    //delete User
    public static deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const id = req.params.id;
        let sql = `Delete from table1 where id=(?)`;
        UserService.db.query(sql, id, (err: string, result: any) => {
            if (err) {
                console.log("error:" + err);
            }
            else {
                res.send(result);
            }
        });
    }

    //retrieve user
    public static retrieveUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        let sql = `Select * from table1`;
        UserService.db.query(sql, (err: string, result: any) => {
            if (err) {
                console.log("error: " + err);
            }
            else {
                console.log(result)
                res.send(result);
            }
        })
    };


    //Authentication 
    public static authentication = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        console.log('Req query', req.query.code);
        let accessToken = await Authentication.getAcessToken(req.query.code)
        console.log('AccessToken'+accessToken);
        let profiledata = await Authentication.getprofiledata(accessToken.data.access_token)
        console.log("Profile Data"+profiledata);
        let sql1 = `select emailId from table1 where emailId = '${profiledata.data.email}'`
        UserService.db.query(sql1, (err: string, result: string | any[]) => {
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
                UserService.db.query(sql2, [profiledata.data.name, profiledata.data.email, null, true], (err: string, result: any) => {
                    if (err) {
                        res.send("Error: " + err);
                    }
                    let token = jwt.sign(frontend, "secret", { expiresIn: 86400 });
                    res.send({ Authentication: 'True', token: token });
                })

            }
        })
    }



    //Oauthentication
    public static oauthAuthentication = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        console.log('Entered auth');
        let redirect_uri = await Authentication.getGoogleOAuthURL()
        console.log(redirect_uri);
        res.redirect(redirect_uri)
    }

    //loginUser
    public static userLogin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        if (req.body.emailId == undefined || req.body.password == undefined) {
            res.status(500).send({ error: 'Authentication failed' })
            console.log('Sorry!..Authentication Failed')
            return;
        }
        let emailId = req.body.emailId;
        let password = req.body.password;
        let qr = `select Name from table1 where emailId='${emailId}' and password='${password}' and isAuthUser='false'`;
        console.log("Query"+qr);
        
        UserService.db.query(qr, (err: any, result:any) => {
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
    }
    public static verifyToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        console.log(req.headers);
        let authHeader:any = req.headers.authorization
        if (authHeader == undefined) {
            res.send("Token Not Provided")
        }
        let token = authHeader.split(" ")[1]
        jwt.verify(token, "secret", function (err: any, decoded: any) {
            if (err) {
                res.status(500).send({ error: "Aunthetication Failed" });
            }
            else {
                next();
            }
        })
    }


} export default UserService;