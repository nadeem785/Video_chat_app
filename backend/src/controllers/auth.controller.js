
import { upsertStreamUser } from '../lib/stream.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'


export const signUp= async (req,res)=>{
    const {password,email, fullName}=req.body;

    try{
        if(!password ||!email || !fullName){
            return res.status(400).json({message:" All fields are required "})

        }
        if(password.length<6){
            return res.status(400).json({message:"password length must be greater than 6 "})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ message: "Invalid email format" });
}




        const user= await User.findOne({email})
        if(user){
            return res.status(400).json({message:"email already exists"})
        }
       

const idx= Math.floor(Math.random()*100)+1;
const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`

        const newUser= await  User.create({
            fullName,
            password,
            email,
            profilePic:randomAvatar,

        })

      try{

        await upsertStreamUser({
            id:newUser._id.toString(),
            name:newUser.fullName,
            image:newUser.profilePic||"",
            
        })
        console.log(`Stream user created for ${newUser.fullName}`)
     
      }catch (err){
        console.log("the error connection of Stream : ",err.message)
      }
            //generate jwt token
            generateToken(newUser._id,res);
            
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })

       





    }
    catch(err){
console.log("error msg : ",err)
res.status(500).json({message:"something went wrong "})
    }
}
export const login= async (req,res)=>{
  

    try{
        const {email, password}=req.body;
        if(!password ||!email){
            return res.status(400).json({message:" All fields are required "})

        }

const user= await User.findOne({email});
if(!user)return res.status(401).json({message:"invalid password or email "})

const isPasswordCorrect = await user.matchPassword(password)

 if( !isPasswordCorrect)return res.status(401).json({message:"invalid password or email "}) 


    generateToken(user._id,res);
            
    res.status(201).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic
    })

    }
    catch(err){
        console.log("error msg : ",err)
        res.status(500).json({message:"something went wrong "})
    }
}


export const logout=(req,res)=>{
    res.clearCookie("jwt")
    res.status(200).json({success:true, message:"Logout successful"})
}


export const  onboard =  async (req,res)=>
{
 
    try{
const userId= req.user._id
const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;
if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
    return res.status(400).json({
      message: "All fields are required",
      missingFields: [
        !fullName && "fullName",
        !bio && "bio",
        !nativeLanguage && "nativeLanguage",
        !learningLanguage && "learningLanguage",
        !location && "location",
      ].filter(Boolean),
    });
  }

   const updatedUser= await User.findByIdAndUpdate(
    userId, {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );
if(!updatedUser)return res.status(404).json({ message: "User not found" });

try {
    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || "",
    });
    console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
  } catch (streamError) {
    console.log("Error updating Stream user during onboarding:", streamError.message);
  }


res.status(200).json({ success: true, user: updatedUser });
    }
catch(err){
    console.error("Onboarding error:", err);
    res.status(500).json({ message: "Internal Server Error" });
}
}