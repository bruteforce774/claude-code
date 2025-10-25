import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();

// Parser HTML-skjema (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));

// In-memory "database"
type Post = { id: string; text: string; createdAt: Date };
const posts: Post[] = [];

// Server-render: felles layout
function page(title: string, body: string) {
  return /*HTML*/`
    <!doctype html>
    <html lang="no">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>${title}</title>
      <style>
        :root { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        body { max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
        header { display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; }
        nav a { margin-right: .75rem; }
        form { display:flex; gap:.5rem; margin: 1rem 0; }
        input[type="text"] { flex:1; padding:.6rem .7rem; border:1px solid #ccc; border-radius:.5rem; }
        button { padding:.6rem .9rem; border:0; border-radius:.5rem; background:#111; color:white; cursor:pointer; }
        ul { list-style: none; padding: 0; }
        li { padding:.6rem .75rem; border:1px solid #eee; border-radius:.5rem; margin:.4rem 0; background:#fafafa; }
        .muted { color:#666; font-size:.9rem }
      </style>
    </head>
    <body>
      <header>
        <h1>${title}</h1>
        <nav>
          <a href="/">Ny post</a>
          <a href="/posts">Alle poster</a>
        </nav>
      </header>
      ${body}
    </body>
    </html>`;
}

// GET /  → viser skjema + siste 5
app.get('/', (_req: Request, res: Response) => {
  const latest = [...posts].reverse().slice(0, 5);
  const list = latest.length
    ? `<ul>` +
      latest.map(p => /*HTML*/`
        <li>
          ${p.text}
          <div class="muted">${p.createdAt.toLocaleString('no-NO')}</div>
        </li>`).join('') +
      `</ul>`
    : `<p class="muted">Ingen poster enda. Skriv noe under 👇</p>`;

  const body = /*HTML*/`
    <form method="POST" action="/submit" autocomplete="off">
      <input type="text" name="text" placeholder="Skriv en kort tekst..." maxlength="200" required />
      <button type="submit">Publiser</button>
    </form>
    <h2>Siste</h2>
    ${list}
  `;

  res.type('html').send(page('Server-render demo', body));
});

// POST /submit → lagrer og redirecter (PRG)
app.post('/submit', (req: Request, res: Response) => {
  const raw = (req.body?.text ?? '').toString().trim();
  if (!raw) {
    // Enkel validering – redirect med enkel feilmelding via query
    return res.redirect('/?error=Tom+tekst');
  }
  const post: Post = { id: crypto.randomUUID(), text: raw, createdAt: new Date() };
  posts.push(post);
  res.redirect('/posts');
});

// GET /posts → liste over alle
app.get('/posts', (_req: Request, res: Response) => {
  const list = posts.length
    ? `<ul>` +
      [...posts].reverse().map(p => /*HTML*/`
        <li>
          ${p.text}
          <div class="muted">#${p.id.slice(0,8)} · ${p.createdAt.toLocaleString('no-NO')}</div>
        </li>`).join('') +
      `</ul>`
    : `<p class="muted">Ingen poster enda.</p>`;

  const body = /*HTML*/`
    <p><a href="/">← Til skjema</a></p>
    <h2>Alle poster (${posts.length})</h2>
    ${list}
  `;

  res.type('html').send(page('Alle poster', body));
});

// (Valgfritt) JSON-endepunkt hvis du vil inspisere i devtools
app.get('/api/posts', (_req, res) => {
  res.json(posts);
});

const PORT = process.env.PORT ?? '3000';
app.listen(Number(PORT), () => {
  console.log(`Server kjører: http://localhost:${PORT}`);
});
