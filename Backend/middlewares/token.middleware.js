import jwt from 'jsonwebtoken'

const verifyToken = (req,res,next)=>{
    const authHeaders = req.headers['authorization'];
    if(!authHeaders){
        return res.status(402).json({"message":"Authorization headers missing"});
    }
    const token = authHeaders.split(' ')[1];

    if(!token){
        return res.status(402).json({"message":"Invalid token"});
    }

    try {
        const decoded  = jwt.verify(token,'secert999');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(402).json({"message":"No token is provided"});
    }

}
export default verifyToken;