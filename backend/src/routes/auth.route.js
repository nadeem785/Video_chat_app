
import express from  "express"
import { signUp } from "../controllers/auth.controller.js"
import { login,logout ,onboard} from "../controllers/auth.controller.js"
const router=express.Router()
import { protectRoute } from "../middleware/auth.middleware.js"

router.post("/signup",signUp)
router.post("/login",login)
router.post("/logout",logout)

router.post("/onboarding",protectRoute,onboard)

router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user})
})

export default router;