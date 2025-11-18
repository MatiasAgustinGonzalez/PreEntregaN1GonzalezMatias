const socket = io();

// Render helper
const renderList = (products) => {
    const list = document.getElementById('list');
    if (!products?.length) {
        list.innerHTML = '<p>No hay productos.</p>';
        return;
    }
    list.innerHTML = products.map(p => `
    <div class="card">
      <b>${p.title}</b> — $${p.price}<br/>
      <span class="muted">id: ${p.id} | code: ${p.code}</span>
    </div>
  `).join('');
};

// Actualizaciones desde el servidor
socket.on('products:update', renderList);

// Crear producto vía WS
const createForm = document.getElementById('createForm');
const createMsg = document.getElementById('createMsg');
createForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(createForm);
    const payload = {
        title: fd.get('title'),
        description: fd.get('description'),
        code: fd.get('code'),
        price: Number(fd.get('price')),
        status: fd.get('status') === 'on',
        stock: Number(fd.get('stock')),
        category: fd.get('category'),
        thumbnails: (fd.get('thumbnails') || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
    };
    socket.emit('product:create', payload, (resp) => {
        if (resp.ok) {
            createMsg.textContent = `Creado: ${resp.created.id}`;
            createForm.reset();
        } else {
            createMsg.textContent = `Error: ${resp.error}`;
        }
    });
});

// Eliminar producto vía WS
const deleteForm = document.getElementById('deleteForm');
const deleteMsg = document.getElementById('deleteMsg');
deleteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = new FormData(deleteForm).get('id');
    socket.emit('product:delete', id, (resp) => {
        if (resp.ok) {
            deleteMsg.textContent = `Eliminado: ${resp.deleted.id}`;
            deleteForm.reset();
        } else {
            deleteMsg.textContent = `Error: ${resp.error}`;
        }
    });
});
