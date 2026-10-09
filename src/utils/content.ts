import { getCollection, type CollectionEntry } from 'astro:content';

export type Writeup = CollectionEntry<'writeups'>;

export async function getPublishedWriteups(): Promise<Writeup[]> {
  const writeups = await getCollection('writeups', ({ data }) =>
    import.meta.env.PROD ? !data.borrador : true,
  );

  return writeups.sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
