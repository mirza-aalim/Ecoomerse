import bcrypt from 'bcrypt';

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        if (password) {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds).then((hashedPassword) => {
                resolve(hashedPassword)
            }).catch((error) => {
                reject(error)
            });
        } else {
            reject('Please provide password')
        }
    })
}

export const comparePassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        if (password && hashedPassword) {
            bcrypt.compare(password, hashedPassword).then((compared) => {
                if (compared) {
                    resolve(compared)
                } else {
                    reject(compared)
                }
            }).catch((error) => {
                reject(error)
            });
        } else {
            reject('Please provide password')
        }
    })
}