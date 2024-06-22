const { expressjwt: jwt } = require("express-jwt");
function authjwt() {
    const secretKey = process.env.SECRET_KEY;

    return jwt({
        secret: secretKey,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            {url:/\/api\/v1\/products(.*)/, methods:['GET', 'options']},
            {url:/\/api\/v1\/category(.*)/, methods:['GET', 'options']},
            '/api/v1/user/login',
            '/api/v1/user/register'

        ]
    })
}

async function isRevoked(req, jwt){
    const payload = jwt.payload;
    if(!payload.isAdmin){
        return true
    }
    return false;
}

module.exports = authjwt;
