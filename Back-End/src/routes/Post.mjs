// routes/posts.mjs
import express from "express";
import { Types } from "mongoose";

import { UsersPosts } from "../mongoose/schema/UsersPosts.mjs";
import { user } from "../mongoose/schema/UserAuth.mjs";
import { PostComments } from "../mongoose/schema/PostsComments.mjs";

const router = express.Router();

function parseCursor(cursor) {
  if (!cursor) return null;
  try {
    const decoded = Buffer.from(String(cursor), "base64").toString("utf8");
    const obj = JSON.parse(decoded);
    return { createdAt: new Date(obj.createdAt), _id: Types.ObjectId(obj._id) };
  } catch {
    return null;
  }
}

function makeCursor(post) {
  // post must have createdAt and _id
  return Buffer.from(
    JSON.stringify({
      createdAt: post.createdAt.toISOString(),
      _id: post._id.toString(),
    })
  ).toString("base64");
}

router.get("/api/posts", async (req, res) => {
  try {
    const limit = Math.min(
      100,
      parseInt(String(req.query.limit || "10"), 10) || 10
    );
    const cursor = parseCursor(req.query.cursor);

    const query = {};
    if (cursor) {
      // keyset pagination: createdAt desc, tie-breaker _id
      query.$or = [
        { createdAt: { $lt: cursor.createdAt } },
        { createdAt: cursor.createdAt, _id: { $lt: cursor._id } },
      ];
    }

    // fetch limit+1 to know if there's more
    const docs = await UsersPosts.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = docs.length > limit;
    const page = hasMore ? docs.slice(0, limit) : docs;

    // Next cursor is based on the last item in the page (if any)
    const nextCursor = page.length > 0 ? makeCursor(page[page.length - 1]) : null;

    // Enrich posts with author info and commentsCount in parallel
    const enriched = await Promise.all(
      page.map(async (p) => {
        // find author (select only the public fields)
        const Author = await user
          .findOne({ username: p.author })
          .select("username fullName gender avatar")
          .lean();

        // count comments for this post
        const commentsCount = await PostComments.countDocuments({ postId: p._id });

        return {
          ...p,
          author: Author
            ? {
                username: Author.username,
                fullName: Author.fullName,
                gender: Author.gender,
                avatar: Author.avatar,
              }
            : null,
          commentsCount,
        };
      })
    );

    return res.json({ posts: enriched, nextCursor, hasMore });
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
