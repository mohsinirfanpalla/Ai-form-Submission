import {Router  } from "express";
import {
    register,
    login,
    getMe,
    patchProfile,
    patchPassword,
    deleteAccount,
} from "../controllers/auth.controller.js";
import {protect} from "../middleware/auth.js";

const Router = Router ();
Router.post("/register", register)
Router.post("/login",  login    )                                                                                                                                                                                                                                                      ", register)
Router.post("/me", protect,getMe)
Router.post("/profile",protect ,patchProfile )
Router.post("/password", protect , patchPassword )
Router.post("/me", protect ,deleteAccount  )

export default Router ;