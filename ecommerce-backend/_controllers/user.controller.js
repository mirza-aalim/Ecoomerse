import JWT from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import user from '../_models/user.model.js'
import { sendMail } from '../helpers/nodemailer.helper.js';
import { hashPassword, comparePassword } from '../helpers/password.helper.js';

export const signup = (req, res) => {
    const { name, email, password, address, phone } = req.body;
    if (name) {
        if (email) {
            if (password) {
                if (address) {
                    if (phone) {
                        user.findOne({ email: email }).then((userFound) => {
                            if (userFound) {
                                res.status(409).json({ error: true, message: "Email already exist." });
                            } else {
                                hashPassword(password).then((hashed) => {
                                    if (hashed) {
                                        let newUser = new user({ name, email, address, phone, password: hashed });
                                        newUser.save().then((created) => {
                                            if (created) {
                                                res.status(201).json({ error: false, message: "Account created successfully.", created: created })
                                            } else {
                                                res.status(500).json({ error: true, message: "User not created." })
                                            }
                                        }).catch((error) => {
                                            res.status(500).json({ error: true, message: "User not created." })
                                        });
                                    } else {
                                        res.status(400).json({ error: true, message: "Invalid password." })
                                    }
                                }).catch((error) => {
                                    res.status(400).json({ error: true, message: "Password is Required." })
                                });
                            }
                        }).catch((error) => {
                            res.status(400).json({ error: true, message: "Invalid email address." });
                        });
                    } else {
                        res.status(400).json({ error: true, message: "Phone no is Required." })
                    }
                } else {
                    res.status(400).json({ error: true, message: "Address is Required." })
                }
            } else {
                res.status(400).json({ error: true, message: "Password is Required." })
            }
        } else {
            res.status(400).json({ error: true, message: "Email is Required." })
        }
    } else {
        res.status(400).json({ error: true, message: "Name is Required." })
    }
};
export const login = (req, res) => {
    const { email, password } = req.body;
    if (email) {
        if (password) {
            user.findOne({ email }).then((userFound) => {
                if (userFound) {
                    comparePassword(password, userFound.password).then((compared) => {
                        if (compared) {
                            let token = JWT.sign({ _id: userFound._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
                            res.status(200).json({ error: false, message: "Login Successfully", token: token, user: userFound })

                        } else {
                            res.status(404).json({ error: true, message: "Password not matched." });
                        }
                    }).catch((error) => {
                        res.status(404).json({ error: true, message: "Password not matched." });
                    });
                } else {
                    res.status(404).json({ error: true, message: "Email not exist." });
                }
            }).catch((error) => {
                res.status(400).json({ error: true, message: "Invalid email address." });
            });
        } else {
            res.status(400).json({ error: true, message: "Password is Required." })
        }
    } else {
        res.status(400).json({ error: true, message: "Email is Required." })
    }
}
export const getById = (req, res) => {
    user.findOne({ _id: new ObjectId(req.params.userId) }, { password: 0 }).then((userFound) => {
        if (userFound) {
            res.status(200).json({ error: false, message: "Found successfully.", user: userFound });
        } else {
            res.status(401).json({ error: true, message: "Unauthorized." });
        }
    }).catch((error) => {
        res.status(401).json({ error: true, message: "Unauthorized." });
    });
}
export const protectedRoute = (req, res) => {
    res.status(200).json({ error: false, message: "User is Protected.", ok: true })
}
export const forgotPassword = (req, res) => {
    user.findOne({ email: req.body.email }).then((found) => {
        if (found == null) {
            res.status(404).json({ error: true, message: "Account are not exist." });
        } else {
            let OTP = Math.floor(1000 + Math.random() * 9000);
            user.updateOne({ email: found.email }, { $set: { OTP: OTP } }).then((updatedOTP) => {
                sendMail(found.email, OTP, 'forgot_password').then((send) => {
                    if (send == null) {
                        res.status(400).json({ error: false, message: "An error occurred, Please try again." });
                    } else {
                        res.status(200).json({ error: false, message: "Forgot password mail has been send successfully." });
                    }
                }).catch((error) => {
                    res.status(500).json({ error: true, message: "Email not send" });
                });
            }).catch((error) => {
                res.status(500).json({ error: true, message: "Email not send" });
            });
        }
    }).catch((error) => {
        res.status(500).json({ error: true, message: "Email not send" });
    });
}
export const resetPassword = (req, res) => {
    user.findOne({ email: req.body.email }).then((found) => {
        if (found == null) {
            res.status(404).json({ error: true, message: "Account are not exist." });
        } else {
            if (found.OTP === req.body.OTP) {
                hashPassword(req.body.password).then((hashed) => {
                    if (hashed) {
                        user.updateOne({ email: found.email }, { $set: { password: hashed, OTP: "" } }).then((reset) => {
                            console.log(reset)
                            if (reset.modifiedCount === 1) {
                                res.status(200).json({ error: false, message: "Password has been successfully reset." });
                            } else {
                                res.status(400).json({ error: true, message: "An error occurred, Please try again later." });
                            }
                        }).catch((error) => {
                            res.status(500).json({ error: true, message: "User not updated." });
                        });
                    } else {
                        res.status(203).json({ error: true, message: "OTP is incorrect." });
                    }
                }).catch((error) => {
                    res.status(500).json({ error: true, message: "Invalid password." });
                });
            } else {
                res.status(203).json({ error: true, message: "OTP is incorrect." });
            }
        }
    }).catch((error) => {
        res.status(500).json({ error: false, message: "User not found." });
    })
}
