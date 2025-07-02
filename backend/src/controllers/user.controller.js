
import User from "../models/user.model.js";
import FriendRequest  from "../models/FriendRequest.js"


export async function getRecommendedUsers (req,res){

try{
const currentUserId= req.user.id;
const  currentUser= req.user;

const recommendedUser= await User.find({
    $and:[
{_id:{$ne:currentUserId}},
{_id : {$nin:currentUser.friends}},
{isOnboarded:true}
    ]
})
res.status(200).json(recommendedUser)

}catch(err){
console.error("Erroro in get Recommended controller ",err.message)
res.status(500).json({message:" failed to get  recommended user"})
}




}


export async function getMyFriends(req,res){

    try{
        const user= await User.findById(req.user.id).select("friends")
        .populate("friends"," fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json(user.friends);

    }
    catch(err){
console.error("Erroro in get getMyFriends controller ",err.message)
res.status(500).json({message:" failed to get  friends user"})
    }
}


export async function sendFriendRequest(req,res){

    try{
const myId=req.user.id;
 const {id:recipientId}=req.params
 //prevent sending to yourself (id)
 if(myId===recipientId){
    return res.status(400).json({message:"you cant send friend request to yourself "})

 }
 //if recepient exisist
 const recipient= await User.findById(recipientId)
 if(!recipient){
    return res.status(404).json({message:"Recipient not found "})
 }

 // if user already friends
 if(recipient.friends.includes(myId)){
    return res.status(400).json({message:"you are already friends with the user "})

 }
 

 //chechk if  req already exisists
 const existingRequest= await FriendRequest.findOne({
  $or:[
    {sender:myId,recipient:recipientId},
    {sender:recipientId,recipient:myId}
  ]  
 })
 if(existingRequest){
    return res.status(400).json({
        message:"a friend request already exists between you and the user "
    })
 }

 const friendRequest=await FriendRequest.create({
    sender:myId,
    recipient:recipientId
 })

res.status(201).json(friendRequest)

    }catch(err){
        console.log(" something is not good : ",err.message)
        res.status(500).json({message:" internal error "})

    }
}

export  async function acceptFriendRequest(req,res) {
 
    try{
        const {id:requestId}=req.params
        const friendRequest= await FriendRequest.findById(requestId)
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found "})
        }
        //verify current recepient;
        if(friendRequest.recipient.toString()!==req.user.id){
            return res.status(403).json({message:"you are not authorized to  accedpt this request"})

        }
        friendRequest.status="accepted"
        await friendRequest.save()
        //add each user to others friend array

        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient},
        })
        await  User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })
res.status(200).json({message:"friend request accepted "})
    }
    catch(err){

        console.log(" something is not good : ",err.message)
        res.status(500).json({message:" internal error "})
    }
    

}
/////
export async function getFriendRequests(req,res) {
    
try{

const incomingReqs=await FriendRequest.find({
    recipient:req.user.id,
    status:"pending"
}).populate("sender","fullName profilePic nativeLanguage learningLanguage")
const acceptedReqs= await FriendRequest.find({
    sender:req.user.id,
    status:"accepted"
}).populate("recipient","fullName profilePic")
res.status(200).json({incomingReqs,acceptedReqs})
}
catch(err){
    console.log(" something is not good : ",err.message)
    res.status(500).json({message:" internal error "})
}

}

export async function getOutgoingFriendReqs(req,res) {
    try{
const outgoingRequest=await FriendRequest.find(
    {
        sender:req.user.id,
        status:"pending",
    }
).populate("recipient","fullName profilePic nativeLanguage learningLanguage")

res.status(200).json(outgoingRequest)
    }catch(err){
        console.log(" something is not good : ",err.message)
        res.status(500).json({message:" internal error "})  
    }
    
}