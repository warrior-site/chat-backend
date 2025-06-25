// routes/user.route.js
import express from 'express';
import multer from 'multer';
import { acceptFriendRequest, acceptGroupJoinRequest, chatInfo, createGroup, getChatTargetDetails, getFriendRequests, getGroupJoinRequests, getProfilePicture, joinGroupRequest, profile, searchUserOrGroup, sendFriendRequest, uploadPreferences } from '../controllers/user.controller.js';
import { checkAuth } from '../controllers/auth.controller.js';
import { fetchFriends, fetchGroups } from '../controllers/user.controller.js';



const Router = express.Router();
const upload = multer({ dest: 'uploads/' });

console.log('✅ user.route.js loaded');

Router.post('/profile', upload.single("file"), profile);

// ✅ FIXED: Added multer middleware to handle file upload
Router.post("/preferences", upload.single("file"), uploadPreferences);
Router.post('/create-group',upload.single('avatar'),createGroup)
Router.get('/search',searchUserOrGroup)
Router.post("/send-friend-request",sendFriendRequest);
Router.post("/join-group", joinGroupRequest);
Router.post('/friends', fetchFriends);
Router.post('/groups', fetchGroups);
Router.post("/accept",acceptFriendRequest)
Router.post("/get-friend-requests",getFriendRequests)
Router.post("/get-group-requests",getGroupJoinRequests)
Router.post("/accept-group-request", acceptGroupJoinRequest);
// backend/routes/userRoutes.js or similar
Router.get('/profile/:id',getProfilePicture)
Router.get("/group/:id",getChatTargetDetails)
Router.get('/chat-info/:chatType/:targetId',chatInfo)


export default Router;
