import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Metadata } from "next";

export async function getPostMetadata(
  relativePath: string,
  urlPath: string
): Promise<Metadata> {
  const filePath = path.join(process.cwd(), "posts", relativePath);

  try {
    if (!fs.existsSync(filePath)) return {};

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      title: data.title,
      description: data.excerpt,
      openGraph: {
        title: data.title,
        description: data.excerpt,
        url: urlPath,
        siteName: "Shotrip",
        images: data.thumbnail ? [{ url: data.thumbnail }] : [],
        type: "article",
        publishedTime: data.date,
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.excerpt,
        images: data.thumbnail ? [data.thumbnail] : [],
      },
    };
  } catch (e) {
    console.error("Metadata generation error:", e);
    return {};
  }
}