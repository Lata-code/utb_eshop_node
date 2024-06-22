const errorHandler = (err, req, res, next) =>{
    if(err.name === 'UnauthorizedError'){
        //jwt authentication error
        return res.status(401).json({message:"The User is not authorized !"})
    }

    if(err.name === 'ValidationError'){
        //jwt Validation Error
        return res.status(401).json({message:err})
    }

    return res.status(500).json(err)
}

module.exports = errorHandler;