module.exports = {
  layout: "layout.njk",
  tags: ["blog"],
  ogType: "article",
  eleventyComputed: {
    breadcrumbs: (data) => [
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog/" },
      { name: data.title, url: data.page.url },
    ],
  },
};
