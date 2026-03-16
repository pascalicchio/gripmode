const fs = require("fs");
const path = require("path");

module.exports = function () {
  const blogDir = path.join(__dirname, "../blog");
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });

  const posts = [];
  const categoryMap = {};

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const postFile = path.join(blogDir, entry.name, "index.njk");
    if (!fs.existsSync(postFile)) continue;

    const content = fs.readFileSync(postFile, "utf8");

    // Skip drafts
    if (/^draft:\s*true/m.test(content)) continue;

    // Require category
    const categoryMatch = content.match(/^category:\s*["']?([^"'\n]+)["']?/m);
    if (!categoryMatch) continue;
    const category = categoryMatch[1].trim();

    // Skip future-dated posts
    const dateMatch = content.match(/^publishDate:\s*["']?([^"'\n]+)["']?/m);
    const publishDate = dateMatch ? dateMatch[1].trim() : null;
    if (publishDate && new Date(publishDate) > new Date()) continue;

    // Extract title and metaDesc
    const titleMatch = content.match(/^title:\s*["']([^"']+)["']/m);
    const metaDescMatch = content.match(/^metaDesc:\s*["']([^"']+)["']/m);

    const post = {
      slug: entry.name,
      url: `/blog/${entry.name}/`,
      publishDate: publishDate || "2026-01-01",
      category,
      title: titleMatch ? titleMatch[1].trim() : entry.name,
      metaDesc: metaDescMatch ? metaDescMatch[1].trim() : "",
    };

    posts.push(post);

    // Group by category
    const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!categoryMap[catSlug]) categoryMap[catSlug] = { name: category, slug: catSlug, posts: [] };
    categoryMap[catSlug].posts.push(post);
  }

  // Sort posts by publishDate descending
  posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  // Build sorted categoryList
  const categoryList = Object.values(categoryMap).map((cat) => ({
    ...cat,
    posts: cat.posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)),
  })).sort((a, b) => a.name.localeCompare(b.name));

  return {
    posts,
    categories: categoryList.map((c) => c.slug),
    categoryList,
    totalPages: Math.ceil(posts.length / 9),
  };
};
