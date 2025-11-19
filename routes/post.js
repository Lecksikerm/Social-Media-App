const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// CREATE A POST
router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE A POST
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res.status(200).json({ message: "The post has been updated" });
    } else {
      return res.status(403).json({ message: "You can update only your post" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE A POST
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json({ message: "The post has been deleted" });
    } else {
      return res.status(403).json({ message: "You can delete only your post" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// LIKE / DISLIKE A POST
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.body.userId.toString();
    if (!post.likes.map(id => id.toString()).includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      return res.status(200).json({ message: "The post has been liked" });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      return res.status(200).json({ message: "The post has been disliked" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET A POST
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/timeline/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let timelinePosts = [];

    if (userId === 'all') {
      // Return all posts from all users
      timelinePosts = await Post.find();
    } else {
      // Return posts from user + followings
      const currentUser = await User.findById(userId);
      if (!currentUser) return res.status(404).json({ message: "User not found" });

      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map(friendId => Post.find({ userId: friendId }))
      );

      timelinePosts = userPosts.concat(...friendPosts);
    }

    res.status(200).json(timelinePosts);
  } catch (err) {
    console.error('Timeline error:', err);
    res.status(500).json(err);
  }
});



module.exports = router;
