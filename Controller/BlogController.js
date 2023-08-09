const Blog = require("../Models/Blog");


exports.GetBlogById = async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId).populate({
      path: "author",
      select: "profile.first_name profile.last_name profile.profile_pic",
    });

    if (!blog) {
      console.warn("here");
      return res
        .status(404)
        .json({ success: false, message: "Blog not found !!" });
    }

    const blogData = {
      ...blog._doc,
      author: blog.author.profile.first_name + blog.author.profile.last_name,
      profile_pic: blog.author.profile.profile_pic,
    };

    // console.log(postData);

    res.status(200).json({ success: true, blogData });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.GetBlogs = async (req, res) => {
  try {
    const blogs =
      //   req.userType !== "ngo"
      //         ?
      await Blog.find().populate({
        path: "author",
        select: "profile.first_name profile.last_name profile.profile_pic",
      });
    // : await Blog.find({ author: req.user._id }).populate({
    //     path: "author",
    //     select: "profile.first_name profile.last_name profile.profile_pic",
    //   });

    if (!blogs) {
      return res
        .status(404)
        .json({ success: false, message: "No blogs found !!" });
    }

    // console.log(blogs[0].author);

    const blogsData = blogs.map((blog) => {
      const blogData = {
        ...blog._doc,
        author: blog.author.profile.first_name + blog.author.profile.last_name,
        profile_pic: blog.author.profile.profile_pic,
      };
      return blogData;
    });

    console.log(blogsData);

    return res.status(200).json({ success: true, blogsData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.CreateBlog = async (req, res) => {
  try {
    // if (req.userType !== "ngo") {
    //   return res
    //     .status(401)
    //     .send({ success: false, message: "Not Authorized." });
    // }

    const user = req.user;

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content is require to create a blog !!!",
      });
    }

    const newBlog = new Blog({
      title,
      content,
      author: user._id,
    });

    const createdBlog = await newBlog.save();

    return res.status(200).json(createdBlog);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.UpdateBlog = async (req, res) => {
  try {
    // if (req.userType !== "ngo") {
    //   return res
    //     .status(401)
    //     .send({ success: false, message: "Not Authorized." });
    // }

    const blogId = req.params.id;
    const { title, content, blogUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content is require to create a blog !!!",
      });
    }

    const blog = await Blog.findById(blogId).populate(
      "author",
      "profile.first_name" + "profile.last_name"
    );

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog Not Found." });
    }

    if (title) {
      blog.title = title;
    }

    if (content) {
      blog.content = content;
    }

    if (blogUrl) {
      blog.blogUrl = blogUrl;
    }

    blog.updatedAt = Date.now();

    const updatedBlog = await blog.save();

    const blogData = {
      ...updatedBlog._doc,
      author: updatedBlog.author.profile.first_name + updatedBlog.author.profile.last_name,
    };

    // console.log(postData);

    return res.status(200).json({ success: true, blogData });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.DeleteBlog = async (req, res) => {
  try {
    // if (req.userType !== "user" && req.userType !== "Admin") {
    //   return res
    //     .status(401)
    //     .send({ success: false, message: "Not Authorized." });
    // }

    const blogId = req.params.id;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.uploadFile = (req, res) => {
  console.log(req.userType);
//   if (req.userType !== "ngo") {
//     return res.status(401).json({ success: false, message: "Not Authorized." });
//   }

  if (!req.fileUrl) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const fileUrl = req.fileUrl;
  return res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    url: fileUrl,
  });
};
