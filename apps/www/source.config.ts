import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { z } from 'zod';

export default defineConfig({
  generateManifest: true,
  lastModifiedTime: 'git',
});

export const blogs = defineDocs({
  dir: './content/blogs',
  docs: {
    schema: z.object({
      author: z.string().optional(),
      badgeLink: z.object({
        href: z.string(),
        text: z.string(),
      }).optional(),
      date: z.string().or(z.date()),
      description: z.string().optional(),
      title: z.string(),
    }),
  },
});
