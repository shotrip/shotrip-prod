import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

// regional slug process //
export function getAllSlug() {
  const slugs: { region: string; prefecture: string; slug: string }[] = [];

  if (!fs.existsSync(postsDirectory)) return [];
  const regions = fs.readdirSync(postsDirectory);

  regions.forEach((region) => {
    if (region === "essentials") return;

    const regionPath = path.join(postsDirectory, region);
    if (!fs.statSync(regionPath).isDirectory()) return;

    const prefectures = fs.readdirSync(regionPath);

    prefectures.forEach((prefecture) => {
      const prefecturePath = path.join(regionPath, prefecture);
      if (!fs.statSync(prefecturePath).isDirectory()) return;

      const files = fs.readdirSync(prefecturePath);

      files.forEach((file) => {
        if (file.endsWith(".md")) {
          slugs.push({
            region: region,
            prefecture: prefecture,
            slug: file.replace(/\.md$/, ""),
          });
        }
      });
    });
  });

  return slugs;
}

export function getArticlesByPrefecture(region: string, prefecture: string) {
  const prefDirectory = path.join(postsDirectory, region, prefecture);

  if (!fs.existsSync(prefDirectory)) return [];

  const files = fs.readdirSync(prefDirectory);

  const articles = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(prefDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        thumbnail: data.thumbnail || "/images/common/placeholder.jpg",
        date: data.date || "1970-01-01",
        region,
        prefecture,
        type: "regional" as const,
        tags: data.tags || [],
      };
    });

    return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}


// essentials slug process //
export function getAllEssentialsSlug() {
  const essentialsDirectory = path.join(postsDirectory, "essentials");
  const slugs: { category: string; slug: string }[] = [];

  if (!fs.existsSync(essentialsDirectory)) return [];

  const categories = fs.readdirSync(essentialsDirectory);

  categories.forEach((category) => {
    const categoryPath = path.join(essentialsDirectory, category);
    if (!fs.statSync(categoryPath).isDirectory()) return;

    const files = fs.readdirSync(categoryPath);

    files.forEach((file) => {
      if (file.endsWith(".md")) {
        slugs.push({
          category: category,
          slug: file.replace(/\.md$/, ""),
        });
      }
    });
  });

  return slugs;
}


export function getEssentialsArticlesByCategory(category: string) {
  const essentialsDir = path.join(postsDirectory, "essentials", category);

  if (!fs.existsSync(essentialsDir)) return [];

  const files = fs.readdirSync(essentialsDir);

  const articles = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(essentialsDir, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        thumbnail: data.thumbnail || "/images/common/placeholder.jpg",
        date: data.date || "",
        category: category.toLowerCase(),
        tags: data.tags || [],
      };
    });

  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}


//get all articles//
export function getAllArticlesSorted() {
  const allSlugs = getAllSlug();
  const essentialsSlugs = getAllEssentialsSlug();

  const regionalArticles = allSlugs.map(({ region, prefecture, slug}) => {
    const fullPath = path.join(postsDirectory, region, prefecture, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      region,
      prefecture,
      title: data.title || slug,
      excerpt: data.excerpt || "",
      thumbnail: data.thumbnail || "/images/common/placeholder.jpg",
      date: data.date || "1970-01-01",
      type: "regional" as const,
      tags: data.tags || [],
    };
  });

  const essentialsArticles = essentialsSlugs.map(({ category, slug }) => {
    const fullPath = path.join(postsDirectory, "essentials", category, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      category,
      title: data.title || slug,
      excerpt: data.excerpt || "",
      thumbnail: data.thumbnail || "/images/common/placeholder.jpg",
      date: data.date || "1970-01-01",
      type: "essentials" as const,
      tags: data.tags || [],
    };
  });

  return [ ...regionalArticles, ...essentialsArticles ].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

//get articles by region//
export function getArticlesByRegion(region: string) {
  const allArticles = getAllArticlesSorted();
  return allArticles.filter(article => article.type === "regional" && article.region === region);
}


// revision_history slug process //
export function getAllRevisionSlugs() {
  const revisionDirectory = path.join(postsDirectory, "revision_history");
  const slugs: { slug: string }[] = [];

  if (!fs.existsSync(revisionDirectory)) return [];

  const files = fs.readdirSync(revisionDirectory);

  files.forEach((file) => {
    if (file.endsWith(".md")) {
      slugs.push({
        slug: file.replace(/\.md$/, ""),
      });
    }
  });

  return slugs;
}


export function getAllRevisionPosts() {
  const revisionDirectory = path.join(postsDirectory, "revision_history");
  if (!fs.existsSync(revisionDirectory)) return [];

  const files = fs.readdirSync(revisionDirectory);

  const allPosts = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(revisionDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || "No Title",
        date: data.date || "1970-01-01",
      };
    });

    return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}