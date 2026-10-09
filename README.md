# Portfolio de ciberseguridad de Dani

Portfolio estático construido con Astro 7, TypeScript, MDX y Tailwind CSS 4. El núcleo es la colección `writeups`: Astro valida el frontmatter con Zod y genera una ruta HTML por máquina durante el build.

## Desarrollo

```bash
npm install
npx astro dev --background
```

El servidor en segundo plano se gestiona con:

```bash
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Comprobaciones disponibles:

```bash
npm run check
npm run build
npm run preview
```

`npm run build` crea el sitio en `dist/` y después ejecuta Pagefind para generar el índice de búsqueda estática.

## Crear un writeup

1. Copia `templates/writeup.mdx` dentro de `src/content/writeups/`.
2. Ponle un nombre de archivo apto para URL, por ejemplo `cap-dockerlabs.mdx`.
3. Completa el frontmatter y conserva las secciones de la plantilla.
4. Usa `borrador: true` mientras trabajas. Los borradores se excluyen de producción.

El frontmatter admite:

- `titulo`: nombre visible de la máquina.
- `plataforma`: `dockerlabs`, `hackmyvm`, `tryhackme`, `hackthebox` o `portswigger`.
- `dificultad`: `muy-facil`, `facil`, `media`, `dificil` o `insane`.
- `sistemaOperativo`: `linux` o `windows`.
- `fecha`: fecha compatible con YAML.
- `tecnicas` y `herramientas`: listas de texto.
- `imagenPortada`: imagen local opcional; Astro la optimiza mediante `astro:assets`.
- `resumen`: entre 30 y 240 caracteres.
- `borrador`: controla su publicación.

Dentro de MDX están disponibles `<Callout>`, `<Terminal>` y `<Flag>`. MDX combina la escritura sencilla de Markdown con componentes reutilizables; no convierte el sitio en una aplicación React ni añade hidratación por sí mismo.

## Despliegue en Netlify

El repositorio incluye `netlify.toml`. Al importar el repositorio en Netlify se ejecutará `npm run build` y se publicará `dist/`. Define `SITE_URL` con el dominio definitivo para generar URLs canónicas, Open Graph, RSS, sitemap y robots correctamente.
