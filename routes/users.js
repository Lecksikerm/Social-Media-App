const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');


router.put('/:id', async (req, res) => {
  try {
    const requesterId = req.body.userId;
    const requesterIsAdmin = req.body.isAdmin === true;

    if (req.body.isAdmin !== undefined) {
      delete req.body.isAdmin;
    }

    if (requesterId !== req.params.id && !requesterIsAdmin) {
      return res.status(403).json({ message: "Forbidden: Only admins can update other users" });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).lean(); 

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    delete updatedUser.password;
    return res.status(200).json(updatedUser);

  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const requesterId = req.body.userId;
    const requesterIsAdmin = req.body.isAdmin === true;

    if (requesterId !== req.params.id && !requesterIsAdmin) {
      return res.status(403).json({ message: "Forbidden: Only admins can delete other users" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    delete user.password;
    return res.status(200).json(user);
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json(err);
  }
});

router.put('/:id/follow', async (req, res) => {
  try {
    if (req.body.userId === req.params.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followerId = req.body.userId.toString();

    if (!userToFollow.followers.map(id => id.toString()).includes(followerId)) {
      userToFollow.followers.push(req.body.userId);
      currentUser.followings.push(req.params.id);

      await userToFollow.save();
      await currentUser.save();

      return res.status(200).json({ message: "User followed successfully" });
    } else {
      return res.status(400).json({ message: "You already follow this user" });
    }
  } catch (err) {
    console.error('Follow user error:', err);
    return res.status(500).json(err);
  }
});


router.put('/:id/unfollow', async (req, res) => {
  try {
    if (req.body.userId === req.params.id) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followerId = req.body.userId.toString();
    const targetId = req.params.id.toString();

    if (userToUnfollow.followers.map(id => id.toString()).includes(followerId)) {
      userToUnfollow.followers = userToUnfollow.followers.filter(
        id => id.toString() !== followerId
      );
      currentUser.followings = currentUser.followings.filter(
        id => id.toString() !== targetId
      );

      await userToUnfollow.save();
      await currentUser.save();

      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      return res.status(400).json({ message: "You do not follow this user" });
    }

  } catch (err) {
    console.error('Unfollow user error:', err);
    return res.status(500).json(err);
  }
});

module.exports = router;
