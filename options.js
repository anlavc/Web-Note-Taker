document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notesList');
    const exportBtn = document.getElementById('exportBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const searchInput = document.getElementById('searchInput'); // This exists in HTML

    // Category Elements
    const newCategoryName = document.getElementById('newCategoryName');
    const newCategoryColor = document.getElementById('newCategoryColor');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoriesList = document.getElementById('categoriesList');

    let allNotes = [];
    let allCategories = [];

    // Initialize
    loadData();

    async function loadData() {
        // Load categories and notes together to ensure categories are available for notes rendering
        const result = await chrome.storage.local.get(['categories']);
        allCategories = result.categories || [];
        renderCategories();

        loadNotes();
    }

    // --- Category Logic ---

    addCategoryBtn.addEventListener('click', async () => {
        const name = newCategoryName.value.trim();
        const color = newCategoryColor.value;

        if (!name) return;

        const newCategory = {
            id: 'cat_' + Date.now(),
            name: name,
            color: color
        };

        allCategories.push(newCategory);
        await chrome.storage.local.set({ categories: allCategories });

        newCategoryName.value = '';
        renderCategories();
    });

    function renderCategories() {
        categoriesList.innerHTML = '';
        allCategories.forEach(cat => {
            const tag = document.createElement('div');
            tag.className = 'category-badge';
            tag.style.backgroundColor = `${cat.color}20`;
            tag.style.border = `1px solid ${cat.color}`;
            tag.style.color = cat.color;

            const span = document.createElement('span');
            span.textContent = cat.name;
            tag.appendChild(span);

            const delBtn = document.createElement('button');
            delBtn.className = 'delete-cat-btn';
            delBtn.innerHTML = '×'; // or use an SVG icon
            delBtn.title = 'Delete Category';

            delBtn.onclick = async () => {
                if (confirm('Delete this category?')) {
                    allCategories = allCategories.filter(c => c.id !== cat.id);
                    await chrome.storage.local.set({ categories: allCategories });
                    renderCategories();
                    loadNotes(); // Re-render notes to clear deleted category tags
                }
            };
            tag.appendChild(delBtn);

            categoriesList.appendChild(tag);
        });
    }

    // --- Note Logic ---

    async function loadNotes() {
        const result = await chrome.storage.local.get(null);
        // Filter out 'categories' key and any config keys, keep only notes (which are keyed by URL)
        allNotes = Object.values(result).filter(item => item && item.url && item.title);
        renderNotes(allNotes);
    }

    function renderNotes(notes) {
        if (notes.length === 0) {
            notesList.innerHTML = `<div class="empty-state">${chrome.i18n.getMessage('emptyState')}</div>`;
            return;
        }

        let html = `
      <table>
        <thead>
          <tr>
            <th>${chrome.i18n.getMessage('tableTitle')}</th>
            <th>${chrome.i18n.getMessage('tableCategory')}</th>
            <th>${chrome.i18n.getMessage('tableNote')}</th>
            <th>${chrome.i18n.getMessage('tableUrl')}</th>
            <th>${chrome.i18n.getMessage('tableDate')}</th>
            <th>${chrome.i18n.getMessage('tableActions')}</th>
          </tr>
        </thead>
        <tbody>
    `;

        notes.forEach(note => {
            const date = new Date(note.timestamp).toLocaleDateString();
            const shortUrl = new URL(note.url).hostname;
            const truncatedNote = note.content && note.content.length > 100 ? escapeHtml(note.content.substring(0, 100)) + '...' : escapeHtml(note.content || '');

            // Find Category
            const category = allCategories.find(c => c.id === note.categoryId);
            let categoryBadge = `<span style="color: #999;">-</span>`;
            if (category) {
                categoryBadge = `
                    <span style="
                        background-color: ${category.color}20; 
                        border: 1px solid ${category.color}; 
                        color: ${category.color}; 
                        padding: 2px 8px; 
                        border-radius: 12px; 
                        font-size: 12px;
                        display: inline-block;
                        max-width: 120px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        vertical-align: middle;
                    " title="${escapeHtml(category.name)}">${escapeHtml(category.name)}</span>
                `;
            }

            html += `
        <tr>
          <td><strong>${escapeHtml(note.title)}</strong></td>
          <td>${categoryBadge}</td>
          <td>${truncatedNote}</td>
          <td><a href="${note.url}" target="_blank" title="${note.url}">${shortUrl}</a></td>
          <td>${date}</td>
          <td>
            <button class="danger icon-btn delete-note-btn" data-url="${note.url}">${chrome.i18n.getMessage('deleteBtn')}</button>
          </td>
        </tr >
                    `;
        });

        html += `</tbody ></table > `;
        notesList.innerHTML = html;

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-note-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const url = e.target.getAttribute('data-url');
                if (confirm(chrome.i18n.getMessage('confirmDelete'))) {
                    await chrome.storage.local.remove(url);
                    loadNotes();
                }
            });
        });
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredNotes = allNotes.filter(note =>
            (note.title && note.title.toLowerCase().includes(query)) ||
            (note.content && note.content.toLowerCase().includes(query)) ||
            (note.url && note.url.toLowerCase().includes(query))
        );
        renderNotes(filteredNotes);
    });

    exportBtn.addEventListener('click', async () => {
        if (allNotes.length === 0) {
            alert(chrome.i18n.getMessage('alertNoExport'));
            return;
        }

        const blob = new Blob([JSON.stringify(allNotes, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `web - notes -export -${new Date().toISOString().slice(0, 10)}.json`);
    });

    exportCsvBtn.addEventListener('click', async () => {
        if (allNotes.length === 0) {
            alert(chrome.i18n.getMessage('alertNoExport'));
            return;
        }

        // Add BOM for Excel to recognize UTF-8
        let csvContent = '\uFEFF';
        // Headers - Using semicolon for better Excel compatibility in many regions (including TR)
        csvContent += `"${chrome.i18n.getMessage('tableTitle')}"; "${chrome.i18n.getMessage('tableCategory')}"; "${chrome.i18n.getMessage('tableUrl')}"; "${chrome.i18n.getMessage('noteLabel')}"; "${chrome.i18n.getMessage('tableDate')}"\n`;

        allNotes.forEach(note => {
            const title = (note.title || '').replace(/"/g, '""');
            const url = (note.url || '').replace(/"/g, '""');
            // Preserve newlines in content but wrap in quotes
            const content = (note.content || '').replace(/"/g, '""');
            const date = new Date(note.timestamp).toLocaleString().replace(/"/g, '""');

            const category = allCategories.find(c => c.id === note.categoryId);
            const catName = category ? category.name.replace(/"/g, '""') : '';

            csvContent += `"${title}"; "${catName}"; "${url}"; "${content}"; "${date}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `web - notes -export -${new Date().toISOString().slice(0, 10)}.csv`);
    });

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearAllBtn.addEventListener('click', async () => {
        if (confirm(chrome.i18n.getMessage('confirmClearAll'))) {
            // Be careful to ONLY clear notes, not categories!
            // chrome.storage.local.clear() removes everything.
            // We should iterate keys and remove only those that look like URLs or aren't configuration.
            // OR: we just restore categories after clear.
            const categories = await chrome.storage.local.get(['categories']);
            await chrome.storage.local.clear();
            if (categories.categories) {
                await chrome.storage.local.set({ categories: categories.categories });
            }
            // Also need to reset icon states if we had a way to iterate tabs, but that's background's job.
            // For now simple clear is fine.
            loadData();
        }
    });

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
