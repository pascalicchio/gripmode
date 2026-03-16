const fs = require("fs");
const path = require("path");

module.exports = function () {
  const blogDir = path.join(__dirname, "../blog");
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  
  const posts = [];
  const categories = new Set();

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const postFile = path.join(blogDir, entry.name, "index.njk");
    if (!fs.existsSync(postFile)) continue;
    
    const content = fs.readFileSync(postFile, "utf8");
    
    // Extract frontmatter fields
    const draftMatch = content.match(/^draft:\s*(true)/m);
    if (draftMatch) continue;
    
    const categoryMatch = content.match(/^category:\s*["']?([^"'\n]+)["']?/m);
    if (!categoryMatch) continue;
    const category = categoryMatch[1].trim();
    
    const dateMatch = content.match(/^publishDate:\s*["']?([^"'\n]+)["']?/m);
    const publishDate = dateMatch ? dateMatch[1].trim() : null;
    
    if (publishDate && new Date(publishDate) > new Date()) continue;
    
    posts.push({
      slug: entry.name,
      url: `/blog/${entry.name}/`,
      publishDate: publishDate || "2026-01-01",
      category,
    });
    
    // Collect category slug
    const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    categories.add(catSlug);
  }

  // Sort posts by publishDate descending
  posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  return {
    posts,
    categories: [...categories].sort(),
    totalPages: Math.ceil(posts.length / 9),
  };
};
