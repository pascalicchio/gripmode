module.exports = function (eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/images/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/images/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/llms.txt");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  // Date filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Limit filter
  eleventyConfig.addFilter("limit", (arr, count) => arr.slice(0, count));

  // Slug filter (already built-in but explicit)
  eleventyConfig.addFilter("slug", (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );

  // Collections
  eleventyConfig.addCollection("blogPosts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*/index.njk")
      .filter((post) => {
        if (post.data.draft) return false;
        if (!post.data.category) return false; // listing/category pages have no category
        if (post.data.publishDate && new Date(post.data.publishDate) > new Date()) return false;
        return true;
      })
      .sort((a, b) => {
        const dateA = a.data.publishDate || a.date;
        const dateB = b.data.publishDate || b.date;
        return new Date(dateB) - new Date(dateA);
      });
  });

  eleventyConfig.addCollection("blogCategories", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/blog/*/index.njk");
    const categories = {};
    posts.forEach((post) => {
      const cat = post.data.category;
      if (cat) {
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(post);
      }
    });
    return categories;
  });

  // Category pages for blog
  eleventyConfig.addCollection("categoryPages", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/blog/*/index.njk").filter((p) => !p.data.draft);
    const categories = {};
    posts.forEach((post) => {
      const cat = post.data.category;
      if (cat) {
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(post);
      }
    });
    return Object.entries(categories).map(([name, catPosts]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      posts: catPosts.sort((a, b) => new Date(b.data.publishDate || b.date) - new Date(a.data.publishDate || a.date)),
    }));
  });

  // All pages for sitemap
  eleventyConfig.addCollection("allPages", function (collectionApi) {
    return collectionApi.getAll().filter((item) => {
      return !item.data.draft && item.url !== false;
    });
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
