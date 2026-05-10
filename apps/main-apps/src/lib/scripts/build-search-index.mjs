import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

function generateIndex() {
    const articles = [];

    // --- Essentials ---
  const essentialsDir = path.join(postsDirectory, "essentials");
  if (fs.existsSync(essentialsDir)) {
    const categories = fs.readdirSync(essentialsDir);
    categories.forEach(category => {
      const dirPath = path.join(essentialsDir, category);
      if (fs.statSync(dirPath).isDirectory()) {
        fs.readdirSync(dirPath).forEach(file => {
          if (file.endsWith(".md")) {
            const content = fs.readFileSync(path.join(dirPath, file), "utf8");
            const { data } = matter(content);
            articles.push({
              slug: file.replace(/\.md$/, ""),
              title: data.title || "",
              excerpt: data.excerpt || "",
              thumbnail: data.thumbnail || "/images/common/placeholder.jpg",
              date: data.date || "",
              type: "essentials",
              category: category
            });
          }
        });
      }
    });
  }

  // --- Regional ---
  const regions = fs.readdirSync(postsDirectory).filter(d => d !== "essentials" && d !== "revision_history");
  regions.forEach(region => {
    const regionPath = path.join(postsDirectory, region);
    if (fs.statSync(regionPath).isDirectory()) {
      fs.readdirSync(regionPath).forEach(pref => {
        const prefPath = path.join(regionPath, pref);
        if (fs.statSync(prefPath).isDirectory()) {
          fs.readdirSync(prefPath).forEach(file => {
            if (file.endsWith(".md")) {
              const content = fs.readFileSync(path.join(prefPath, file), "utf8");
              const { data } = matter(content);
              articles.push({
                slug: file.replace(/\.md$/, ""),
                title: data.title || "",
                excerpt: data.excerpt || "",
                thumbnail: data.thumbnail || "/images/common/placeholder.jpg",
                date: data.date || "",
                type: "regional",
                region: region,
                prefecture: pref
              });
            }
          });
        }
      });
    }
  });

  const outputPath = path.join(process.cwd(), "public", "search-index.json");
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
  console.log("✅ Search index generated at public/search-index.json");
}

generateIndex();