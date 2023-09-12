import nodemailer from 'nodemailer';
import mailerConfig from '../_configs/mailer.config.js';

const transporter = nodemailer.createTransport({
    service: mailerConfig.service,
    auth: {
        type: mailerConfig.type,
        clientId: mailerConfig.clientId,
        clientSecret: mailerConfig.clientSecret,
    },
});

const auth = {
    user: mailerConfig.user,
    refreshToken: mailerConfig.refreshToken,
    accessToken: mailerConfig.accessToken,
    expires: mailerConfig.expires,
};

export const sendMail = (receiver, OTP, type) => {
    return new Promise((resolve, reject) => {
        if (type === 'forgot_password') {
            transporter.sendMail({
                from: `IM Collection <${mailerConfig.user}>`,
                to: receiver,
                subject: "Reset password",
                html: "Your forgot password OTP is: " + OTP,
                auth: auth,
            }).then((send) => {
                resolve(send);
            }).catch((err) => {
                reject(err);
            });
        }
    });
};
