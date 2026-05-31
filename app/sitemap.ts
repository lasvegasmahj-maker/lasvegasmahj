import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://lasvegasmahj.com",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://lasvegasmahj.com/mahjong-lessons-las-vegas",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://lasvegasmahj.com/mahjong-parties-las-vegas",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://lasvegasmahj.com/mahjong-open-play-las-vegas",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://lasvegasmahj.com/mahjong-corporate-las-vegas",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: "https://lasvegasmahj.com/about",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://lasvegasmahj.com/mahjong-lessons-summerlin",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://lasvegasmahj.com/mahjong-lessons-henderson",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://lasvegasmahj.com/learn-mahjong",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://lasvegasmahj.com/mahjong-sets-guide",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    // Hidden until the next live event:
    // {
    //   url: "https://lasvegasmahj.com/events/cafe-lola-open-play-may-2026",
    //   lastModified: new Date("2026-05-23"),
    //   changeFrequency: "weekly",
    //   priority: 0.75,
    // },
    {
      url: "https://lasvegasmahj.com/blog",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://lasvegasmahj.com/blog/things-to-do-las-vegas-besides-gambling",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://lasvegasmahj.com/blog/bachelorette-party-ideas-las-vegas",
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
