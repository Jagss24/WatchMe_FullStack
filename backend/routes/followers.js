import app from "express";
import User from "../models/user.js";

const router = app.Router();

router.post("/follow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    const followerUser = await User.findById(followerId);
    const followingUser = await User.findById(followingId);
    if (followerUser && followerUser) {
      if (followerUser.following.includes(followingId)) {
        console.log("You already follow this account");
        return res
          .status(200)
          .json({ message: "You already follow this account" });
      }
      followerUser.following.push(followingId);
      followingUser.followers.push(followerId);
      await followerUser.save();
      await followingUser.save();
      return res.status(200).json({ message: "Followed Successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "some error occured", error });
  }
});

router.post("/unfollow", async (req, res) => {
  try {
    const { unfollowerId, unfollowingId } = req.body;
    const unfollowerUser = await User.findById(unfollowerId);
    const unfollowingUser = await User.findById(unfollowingId);
    if (unfollowerUser && unfollowerUser) {
      if (unfollowerUser.following.includes(unfollowingId)) {
        unfollowerUser.following.remove(unfollowingId);
        unfollowingUser.followers.remove(unfollowerId);
        await unfollowerUser.save();
        await unfollowingUser.save();
        return res.status(200).json({ message: "UnFollowed Successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "some error occured", error });
  }
});

router.get("/followBack", async (req, res) => {
  try {
    const { loggedInuserId, viewingUserId } = req.query;
    const loggedInuser = await User.findById(loggedInuserId);
    const viewingUser = await User.findById(viewingUserId);
    if (loggedInuser && viewingUser) {
      const isviewingUserFollowsLoggedInUser =
        viewingUser.following.includes(loggedInuserId); // for Follow back button
      const isloggedInUSerFollowsviewingUSer =
        loggedInuser.following.includes(viewingUserId); // for Unfollow button

        if (isviewingUserFollowsLoggedInUser && !isloggedInUSerFollowsviewingUSer) {
          return res.status(200).json({ message: "Follow back" });
        }
      if (
        !isloggedInUSerFollowsviewingUSer
      ) {
        return res.status(200).json({ message: "Follow" }); //it means they don't follow each other
      }
      if (isloggedInUSerFollowsviewingUSer) {
        return res.status(200).json({ message: "Unfollow" });
      }
    } else {
      res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "some error occured", error });
  }
});
router.get("/getfollowerCounts", async (req, res) => {
  try {
    const { userId } = req.query;
    const isUser = await User.findById(userId);
    if (isUser) {
      const followerCount = isUser.followers.length;
      return res
        .status(200)
        .json({ message: "Followers count achieved", count: followerCount });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "some error occured", error });
  }
});
export default router;
