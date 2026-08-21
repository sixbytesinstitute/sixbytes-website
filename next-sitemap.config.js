/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://sixbytes.in",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    "/admin",
    "/admin/*",
    "/dashboard",
    "/dashboard/*",
    "/student-login",
    "/api/*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/student-login", "/api"],
      },
    ],
  },
};