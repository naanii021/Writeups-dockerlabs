import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getPublishedWriteups } from '../utils/content';

export const GET: APIRoute = async (context) => {
  const writeups = await getPublishedWriteups();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? 'https://naanii021.github.io',
    items: writeups.map(({ id, data }) => ({
      title: data.titulo,
      description: data.resumen,
      pubDate: data.fecha,
      link: `/writeups/${id}/`,
      categories: [data.plataforma, data.dificultad, ...data.tecnicas],
    })),
    customData: '<language>es-es</language>',
  });
};
