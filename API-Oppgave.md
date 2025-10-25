# Oppgave

Lag et prosjekt fra grunna av med express og typescript som har et REST API.
SJekk dagens kode i [intro-express-api](./Eksempler/intro-express-api/)
Bruk koden i [Form and list](./Hovedeksempler/FormAndList/v5b%20fjerne%20gjentakelse%20med%20arv/) for å implementere API-endepunktene.

## Oppsumering av dagens leksjoner

### Kort sammendrag del 1

Dagens forelesning fokuserte på **server-rendered nettsider** og **REST API-er med Express**. Instructoren gikk gjennom to eksempler:

1. **Server-rendered webapplikasjon** - HTML genereres på serveren
2. **REST API** - API som returnerer JSON-data

---

### Del 1: Server-Rendered Nettsider

**Konsept:**

- En webapplikasjon som genererer HTML på serveren (gammelt paradigme fra 1990-2000-tallet: PHP, ASP, Perl)
- Funksjonalitet: homepage med skjema og liste, plus `/posts`-side som viser alle poster

**In-Memory Database:**

- Posts lagres i RAM på serveren
- Struktur: `{ id, text, createdAt }`
- Data mistes hvis serveren stoppes (ingen persistent lagring)

**GET / (Homepage):**

- Viser de 5 siste postene
- Har et skjema for å legge til nye poster
- Generer HTML via `page(title, body)`-funksjon

**Form-taggen i server-rendered design:**

- `method="get"` - sender data i URL som query parameters
- `method="post"` - sender data i request body som "form data" (skjult)
- Submitknapp trigget av `type="submit"`

**HTTP 302 Redirect:**

- Når POST-request blir håndtert, sender serveren 302 (redirect)
- Eksempel: POST til `/submit` → redirect til `/posts`
- Bruker blir ledet til en ny side etter innsending

**POST /submit (Skjema-innsending):**

- Henter `request.body.text`
- Lager nytt post-objekt med ID og timestamp
- Legger til i posts-array
- Redirect til `/posts`-siden

**GET /posts (Alle poster):**

- Viser alle poster (ikke bare de 5 siste)
- Link tilbake til homepage

**GET /api/posts (JSON-endpoint):**

- Samme data, men som JSON i stedet for HTML
- Kombinerer HTML-servering med API

---

### Del 2: REST API med Express

**Setup:**

- Import av Express + Path (filhåndtering)
- `app.use(express.json())` - parser JSON fra requests
- `app.use(express.static('public'))` - server statiske filer direkte

**Statiske filer (public-mappen):**

- Alt i `/public` blir tilgjengelig via URL
- Eksempel: `dummy.png` → `http://localhost/dummy.png`
- Viktig: må gjenstart serveren for å aktivere

**Request Flow (Frontend → Backend):**

1. Browser ber om `/` → får `index.html`
2. HTML ber om `/script.js` → gets JavaScript fra public-mappa
3. JavaScript kaller `loadItems()` → `fetch('/api/items')`
4. GET `/api/items` → API returnerer JSON

**GET /api/items:**

- Handler-funksjon som returnerer `response.json(items)`
- Enkel og ren - bare sender JSON-data

**POST /api/items (Legge til nytt item):**

- Henter navn fra `request.body` via object destructuring
- Validering: hvis navn mangler → status 400 (Bad Request)
- Hvis OK: push til items-array → returnerer status 201 (Created)
- Returnerer hele item-objektet tilbake til klient

**Client-side POST:**

```javascript
fetch('/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: inputValue })
})
```

**HTTP-statuskoder:**

- `200` - OK (default)
- `201` - Created (brukes på POST som lykkes)
- `202` - Accepted
- `400` - Bad Request (validering feilet)
- `302` - Redirect (brukt i server-rendered design)

**Viktige HTTP-konvensjoner:**

- POST skal returnere 201 når noe blir laget
- Kan sende hele objektet tilbake slik at klient unngår ekstra fetch
- Bruk riktig statuskode for å indikere hva som skjedde

---

### Neste steg (etter pause)

- Implementere **UPDATE** (PUT/PATCH)
- Implementere **DELETE**
- Possibly leke med `axios` som alternativ til `fetch`

**Status:** Halvveis gjennom eksemplet. Fundamentals for API-design er dekket.

### Kort sammendrag del 2

---

### Del 3: Fullføring av CRUD (Delete & Update) + API-organisering

**Mål:** Implementere DELETE og UPDATE operasjoner for å fullføre CRUD.

---

#### DELETE - Slette items

**Frontend (JavaScript):**

```javascript
items.map((item, index) => 
  // Knapp som kaller deleteItem(index)
)

async function deleteItem(index) {
  await fetch(`/api/items/${index}`, { method: 'DELETE' })
  loadItems() // Reload list
}
```

**Backend (Express):**

- Route: `DELETE /api/items/:index`
- Henter indeks fra URL parameters: `request.params.index`
- Bruker indeksen til å slette fra array
- Returnerer `{ message: "deleted" }`
- Frontend reloader listen etter delete

**Viktig:** HTTP-verbet må være `DELETE` (ikke POST)

---

#### UPDATE/EDIT - Redigere items

**Diskusjon: PUT vs PATCH**

- **PUT** - Send hele det nye objektet (hel erstatning)
- **PATCH** - Send bare feltene som har endret seg (delvis oppdatering)
- I dette eksemplet: bruker **PUT** fordi vi bare oppdaterer tekst

**Frontend (JavaScript):**

```javascript
async function editItem(index) {
  const newText = prompt("Edit text:")
  await fetch(`/api/items/${index}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newText })
  })
  loadItems() // Reload list
}
```

**Backend (Express):**

- Route: `PUT /api/items/:index`
- Henter indeks fra URL: `request.params.index`
- Henter navn fra body: `request.body.name`
- Oppdaterer arrayen på gitt indeks
- Returnerer statuskode 200

---

### API-Organisering - Single Responsibility Principle

**Problemet:** API-kall spredt rundt i frontend-koden

**Problem-eksempel:**

```javascript
// Blandet i mange funksjoner:
async function loadItems() {
  const response = await fetch('/api/items')
  const data = await response.json()
  // + rendering logic
}
```

Hvis du har 100 steder med fetch-kall og skal bytte til Axios, må du endre 100 steder!

**Løsning: Dedikert API-modul**

```javascript
// api.js
async function doRequest(verb, url, body = null) {
  const options = {
    method: verb,
    headers: { 'Content-Type': 'application/json' }
  }
  if (body) options.body = JSON.stringify(body)
  
  const response = await fetch(url, options)
  return response.json()
}

// Curried helper functions
const get = (url) => doRequest('GET', url)
const post = (url, body) => doRequest('POST', url, body)
const put = (url, index, body) => doRequest('PUT', `${url}/${index}`, body)
const deleteItem = (url, index) => doRequest('DELETE', `${url}/${index}`)

// Usage:
const items = await api.get('/api/items')
await api.post('/api/items', { name: 'new item' })
```

**Frontend blir mye enklere:**

```javascript
// Før: Blandet logikk
async function loadItems() {
  const res = await fetch('/api/items')
  const items = await res.json()
  // + rendering
}

// Etter: Rent og enkelt
async function loadItems() {
  const items = await api.get('/api/items')
  renderItems(items)
}
```

---

### SOLID-Prinsipper - Single Responsibility Principle (SRP)

**Definisjon:** Hver del av koden skal ha **ett ansvar**

**Eks. fra denne koden:**

**Dårlig (blandet ansvar):**

```javascript
// Ansvar 1: Hente fra API
// Ansvar 2: Tegne HTML
function loadItems() {
  fetch('/api/items')...     // HOW TO GET DATA
  renderItems(data)          // HOW TO RENDER
}
```

**Bra (separert ansvar):**

```javascript
// API-modul: ansvar = HOW TO CALL API
async function get(url) { ... }

// UI-funksjon: ansvar = HOW TO RENDER
function loadItems() {
  const items = await api.get('/api/items')
  renderItems(items)
}
```

**Fordel:** Hvis du bytter fra `fetch` til `axios`, endrer du bare API-modulen!

---

### Axios som alternativ til Fetch

**Axios CDN (global):**

```html
<script src="https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.js"></script>
```

**Fetch vs Axios:**

```javascript
// Fetch (verbose)
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
const data = await response.json()

// Axios (kortere)
const { data } = await axios.post(url, data)
```

**Med API-modul blir det en one-liner:**

```javascript
const post = (url, body) => axios.post(url, body).then(res => res.data)
```

---

### Oppgave for studenter

**Oppgave:** Ta en eksisterende app (f.eks. `FormAndList/v5b`) og:

1. Lag et Express API fra bunnen av
2. Implementer alle CRUD operasjoner (GET, POST, PUT, DELETE)
3. Koble frontend til API-et
4. Bruk API-modulen for å organisere koden
5. Test at data persister når siden reloades (lagret i API, ikke localStorage)

**Eksempel-app:** `FormAndList` eller enkel `Todo`-applikasjon

**Målet:** Lær hvordan man organiserer API-kall og forstår hele request-response-syklusen.
