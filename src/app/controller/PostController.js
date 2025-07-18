import { getPostModel } from "../models/PostModal.js";
class PostController {
  // [POST] /api/posts
  createPosts = async (req, res) => {
    const Post = getPostModel(req.db);
    try {
      let counter = 1;
      const {
        title,
        description,
        slug,
        content,
        authorName,
        authorUrl,
        publishedDate,
        modifiedDate,
        image,
        tags,
        category,
        breadcrumbs,
      } = req.body;
      let uniqueSlug = slug;
      while (await Post.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      const newPost = new Post({
        title,
        description,
        slug: uniqueSlug,
        content,
        authorName,
        authorUrl,
        publishedDate,
        modifiedDate,
        image,
        tags,
        category,
        breadcrumbs,
      });
      // save data to database
      const saveNewPost = await newPost.save();
      res.status(201).json(saveNewPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  getAllPostAndLimit = async (req, res) => {
    const Post = getPostModel(req.db);
    try {
      const { limit } = req.query;

      let query = Post.find({}).select("title slug").sort({ createdAt: -1 });

      if (limit !== undefined) {
        const parsedLimit = parseInt(limit, 10);

        if (isNaN(parsedLimit)) {
          return res.status(400).json({ message: "Limit must be a number" });
        }

        if (parsedLimit < 1) {
          return res
            .status(400)
            .json({ message: "Limit must be greater than 0" });
        }

        query = query.limit(parsedLimit);
      }

      const posts = await query.exec();
      return res.status(200).json(posts);
    } catch (err) {
      console.log("loi 500 :", err);
      return res.status(500).json({ message: "Lỗi server khi lấy bài viết" });
    }
  };

  // [POST] / api/posts/find  find posts by tags
  filterPost = async (req, res) => {
    const Post = getPostModel(req.db);
    try {
      const { tags } = req.body;
      const limit = Math.max(1, parseInt(req?.query?.limit) || 10);

      // Validate tags input
      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid tags. Tags should be a non-empty array.",
        });
      }

      // Sanitize tags array
      const sanitizedTags = tags.filter(
        (tag) => typeof tag === "string" && tag.trim()
      );

      if (sanitizedTags.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No valid tags provided." });
      }

      // Get posts with specified fields using select
      const postList = await Post.find({ tags: { $in: sanitizedTags } })
        .select("createdAt image.url title description authorName slug _id")
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      // Check if posts were found
      if (!postList || postList.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No posts found matching the tags.",
        });
      }

      // Return posts
      res.status(200).json(postList);
    } catch (error) {
      console.error("Error in filterPost:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
  // [GET] /api/posts/find/query?q=query&limit=number find posts by query
  getPostByQuery = async (req, res) => {
    const Post = getPostModel(req.db);
    try {
      const query = req.query.q?.trim();
      const limit = Math.max(1, parseInt(req.query.limit, 10) || 5);

      // Validate query
      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Query là bắt buộc",
        });
      }

      // Sanitize query to prevent regex injection
      const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Search in title and content with case-insensitive regex
      const posts = await Post.find({
        $or: [
          { title: { $regex: sanitizedQuery, $options: "i" } },
          { content: { $regex: sanitizedQuery, $options: "i" } },
        ],
      })
        .select("title slug") // Exclude version key
        .limit(limit)
        .sort({ createdAt: -1 });

      // Handle no results
      if (!posts?.length) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bài viết phù hợp",
          query: query,
        });
      }

      // Return success response
      return res.status(200).json({
        success: true,
        data: posts,
        total: posts.length,
        query: query,
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bài viết:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tìm kiếm bài viết",
        error: error.message,
      });
    }
  };
  // [GET] /api/posts/:slug
  getPostBySlug = async (req, res) => {
    const Post = getPostModel(req.db);
    try {
      const slug = req.params.slug;
      if (!slug) {
        return res.status(400).json({ message: "Slug là bắt buộc" });
      }
      const post = await Post.findOne({ slug });
      if (!post) {
        return res.status(404).json({ message: "Không tìm thấy bài viết" });
      }

      res.status(200).json(post);
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error); // Thêm log chi tiết
      res.status(500).json({ message: "Lỗi khi lấy bài viết" });
    }
  };
  getPostById = async (req, res) => {
    const Post = getPostModel(req.db);
    const _id = req.params.id;
    console.log("id:", _id);
    if (!_id) {
      return res.status(400).json({ message: "error" });
    }
    try {
      const post = await Post.findById(_id).exec();
      console.log("post:", post);
      if (!post) {
        return res.status(404).json({ message: "not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
      res.status(500).json({ message: "error" });
    }
  };
  // [DELETE] /api/posts/:id
  deletePost = async (req, res) => {
    const Post = getPostModel(req.db);
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "cant receive id blogs" });
    }
    try {
      await Post.findByIdAndDelete(id);
      res.json({ message: "Xóa thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  //[PUT] /api/posts/:id
  updatePost = async (req, res) => {
    const Post = getPostModel(req.db);
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "cant receive id blogs" });
    }
    try {
      const data = req.body;
      const updatedAt = new Date();
      const blogUpdate = {
        ...data,
        updatedAt,
      };
      Object.keys(blogUpdate).forEach(
        (key) => blogUpdate[key] === undefined && delete blogUpdate[key]
      );
      await Post.findByIdAndUpdate(id, blogUpdate);
      return res.json({
        message: "update thành công",
        blogUpdate: blogUpdate,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  };
  //[GET] /api/posts?page=1&limit=10
  getPostsWithPagination = async (req, res) => {
    const Post = getPostModel(req.db);
    try {
      // Input validation and sanitization
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 15));
      const skip = (page - 1) * limit;

      // Add basic query filters
      const query = {};
      const sortOptions = { createdAt: -1 };

      // Use lean() for better performance since we only need JSON data
      const [posts, totalPosts] = await Promise.all([
        Post.find(query)
          .select("title description image.url slug _id")
          .lean()
          .skip(skip)
          .limit(limit)
          .sort(sortOptions),
        Post.countDocuments(query),
      ]);

      // Handle no results
      if (!posts.length && page > 1) {
        return res.status(404).json({
          success: false,
          message: "No posts found for this page",
        });
      }

      const totalPages = Math.ceil(totalPosts / limit);
      return res.status(200).json({
        success: true,
        data: {
          posts,
          pagination: {
            currentPage: page,
            totalPages,
            totalPosts,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      console.error("Pagination error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching paginated posts",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
  // [GET] /api/posts/sitemap
  getPostRenderSiteMap = async (req, res) => {
    const config = req.app.locals.config;
    const Post = getPostModel(req.db);
    try {
      const posts = await Post.find({})
        .select("slug title image publishedDate modifiedDate")
        .sort({ createdAt: -1 });

      const host = config.DOMAIN;

      const data = posts.map((post) => {
        const loc = `${host}/post/${post.slug}`;
        const lastmod = new Date(
          post.modifiedDate || post.publishedDate || Date.now()
        ).toISOString();

        let images = {};

        if (post.image?.url) {
          const imageUrl = post.image.url.startsWith("http")
            ? post.image.url
            : `${host}/${post.image.url.replace(/^\/+/, "")}`;

          images = {
            loc: imageUrl,
            title: post.image.alt || post.title,
            caption: post.image.alt || post.title,
          };
        }

        return {
          loc,
          lastmod,
          images,
        };
      });

      return res.status(200).json(data);
    } catch (err) {
      console.error("Lỗi API sitemap:", err);
      return res.status(500).json({ message: "server error", err });
    }
  };
  patchLikePostById = async (req, res) => {
    const Post = getPostModel(req.db);
    const _id = req.query.postId;
    if (!_id) {
      console.log("err receiver id:", _id);
      return res.status(404).json({
        success: false,
        message: "not found id",
      });
    }
    const { username } = req.body;
    if (!username) {
      console.log("err receiver username:", username);
      return res.status(404).json({
        success: false,
        message: "not found username",
      });
    }
    try {
      const post = await Post.findById(_id);
      if (!post) {
        return res.status(404).json({ message: "Không tìm thấy bài viết" });
      }
      const alreadyLiked = post.likes.includes(username);

      const updatedLikes = await Post.findOneAndUpdate(
        { _id },
        alreadyLiked
          ? { $pull: { likes: username } }
          : { $addToSet: { likes: username } },
        { new: true }
      );
      return res.json({
        message: alreadyLiked ? "Đã bỏ thích" : "Đã thích bài viết",
        success: true,
        likes: updatedLikes.likes,
      });
    } catch (error) {
      console.log("err server:", error);
      return res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  };
}
export default new PostController();
