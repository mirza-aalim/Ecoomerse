import JWT from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import user from '../_models/user.model.js';

export const requireSignIn = (req, res, next) => {
    if (req.headers.token) {
        JWT.verify(req.headers.token, process.env.JWT_SECRET, (error, payload) => {
            if (error) {
                res.status(409).json({ error: true, message: "Invalid Token." })
            } else {
                user.findOne({ _id: new ObjectId(payload._id) }).then((userFound) => {
                    if (userFound) {
                        next()
                    } else {
                        res.status(401).json({ error: true, message: "Unauthorized." });
                    }
                }).catch((error) => {
                    res.status(401).json({ error: true, message: "Unauthorized." });
                });
            }
        });
    } else {
        res.status(401).json({ error: true, message: "Token is Required." });
    }
}
export const isAdmin = (req, res, next) => {
    if (req.headers.token) {
        JWT.verify(req.headers.token, process.env.JWT_SECRET, (error, payload) => {
            if (error) {
                res.status(409).json({ error: true, message: "Invalid Token." })
            } else {
                user.findOne({ _id: new ObjectId(payload._id) }).then((userFound) => {
                    if (userFound.role == true) {
                        next()
                    } else {
                        res.status(401).json({ error: true, message: "Unauthorized Access." });
                    }
                }).catch((error) => {
                    res.status(401).json({ error: true, message: "Unauthorized Access." });
                });
            }
        });
    } else {
        res.status(401).json({ error: true, message: "Token is Required." });
    }
}