import { Router } from "express";
import verifyToken from "../middlewares/token.middleware.js";
import { userRegister,userLogin,userUpdate,userDelete } from "../contollers/AuthControllers.js";
const route = Router();

route.post('/signup', userRegister );

route.post('/login', userLogin);

route.put('/update', verifyToken, userUpdate );

route.delete('/delete/:id', verifyToken, userDelete );

export default route;
