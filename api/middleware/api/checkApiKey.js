module.exports = (req, res, next) => {
    if(req.headers.apikey == '' || req.headers.apikey != process.env.API_KEY){
        return res.status(401).json({message:"Invalid Api Key."});
    }
    next();
}