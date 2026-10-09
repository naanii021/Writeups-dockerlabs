import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const plataformas = [
  'dockerlabs',
  'hackmyvm',
  'tryhackme',
  'hackthebox',
  'portswigger',
] as const;

export const dificultades = [
  'muy-facil',
  'facil',
  'media',
  'dificil',
  'insane',
] as const;

export const sistemasOperativos = ['linux', 'windows'] as const;

const writeups = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/writeups' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string().trim().min(1),
      plataforma: z.enum(plataformas),
      dificultad: z.enum(dificultades),
      sistemaOperativo: z.enum(sistemasOperativos),
      fecha: z.coerce.date(),
      tecnicas: z.array(z.string().trim().min(1)).default([]),
      herramientas: z.array(z.string().trim().min(1)).default([]),
      imagenPortada: image().optional(),
      resumen: z.string().trim().min(30).max(240),
      borrador: z.boolean().default(true),
    }),
});

export const collections = { writeups };
