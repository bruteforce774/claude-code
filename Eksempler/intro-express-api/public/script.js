async function loadItems() {
  const items = await api.get('/api/items');
  const list = document.getElementById('list');
  list.innerHTML = items.map((item, index) => /*HTML*/`
    <li>
      <input type="text" value="${item}" id="editText${index}" />
      <button onclick="editItem(${index})">Rediger</button>
      <button onclick="deleteItem(${index})">Slett</button>
    </li>
  `).join('');
}

async function editItem(index) {
  const name = document.getElementById(`editText${index}`).value;
  await api.put(`/api/items/${index}`, { name });
  loadItems();
}

async function addItem() {
  const name = document.getElementById('newItem').value;
  await api.post('/api/items', { name });
  document.getElementById('newItem').value = '';
  loadItems();
}

async function deleteItem(index) {
  await api.delete(`/api/items/${index}`);
  loadItems();
}

document.getElementById('addBtn').onclick = addItem;
loadItems();


// async function loadItems() {
//   const res = await fetch('/api/items');
//   const items = await res.json();
//   const list = document.getElementById('list');
//   list.innerHTML = items.map((item, index) => /*HTML*/`
//     <li>
//       <input type="text" value="${item}" id="editText${index}" />
//       <button onclick="editItem(${index})">Rediger</button>
//       <button onclick="deleteItem(${index})">Slett</button>
//     </li>
//   `).join('');
// }

// async function editItem(index) {
//   const name = document.getElementById(`editText${index}`).value;
//   await fetch(`/api/items/${index}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name })
//   });
//   loadItems();
// }

// async function addItem() {
//   const name = document.getElementById('newItem').value;
//   await fetch('/api/items', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name })
//   });
//   document.getElementById('newItem').value = '';
//   loadItems();
// }

// async function deleteItem(index) {
//   await fetch(`/api/items/${index}`, { method: 'DELETE', });
//   loadItems();
// }

// document.getElementById('addBtn').onclick = addItem;
// loadItems();
