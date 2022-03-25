const { redirect } = require("express/lib/response");

function authentication(req, res, next){
    console.log("authentication")
    console.log(typeof(req.session.username) === "undefined");
    console.log(typeof(req.session.username) );
    if(typeof(req.session.username) === "undefined"){
        res.redirect('/login');
        return;
    }
    next();
}

module.exports = authentication;