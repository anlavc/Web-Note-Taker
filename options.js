document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notesList');
    const exportBtn = document.getElementById('exportBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const searchInput = document.getElementById('searchInput');

    let allNotes = [];

    loadNotes();

    async function loadNotes() {
        const result = await chrome.storage.local.get(null); // Get all
        allNotes = Object.values(result).filter(item => item.url && item.title); // Basic validation
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

            html += `
        <tr>
          <td><strong>${escapeHtml(note.title)}</strong></td>
          <td>${truncatedNote}</td>
          <td><a href="${note.url}" target="_blank" title="${note.url}">${shortUrl}</a></td>
          <td>${date}</td>
          <td>
            <button class="danger icon-btn delete-note-btn" data-url="${note.url}">${chrome.i18n.getMessage('deleteBtn')}</button>
          </td>
        </tr>
      `;
        });

        html += `</tbody></table>`;
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
        downloadBlob(blob, `web-notes-export-${new Date().toISOString().slice(0, 10)}.json`);
    });

    exportCsvBtn.addEventListener('click', async () => {
        if (allNotes.length === 0) {
            alert(chrome.i18n.getMessage('alertNoExport'));
            return;
        }

        // Add BOM for Excel to recognize UTF-8
        let csvContent = '\uFEFF';
        // Headers
        csvContent += `"${chrome.i18n.getMessage('tableTitle')}","${chrome.i18n.getMessage('tableUrl')}","${chrome.i18n.getMessage('noteLabel')}","${chrome.i18n.getMessage('tableDate')}"\n`;

        allNotes.forEach(note => {
            const title = (note.title || '').replace(/"/g, '""');
            const url = (note.url || '').replace(/"/g, '""');
            const content = (note.content || '').replace(/"/g, '""').replace(/\n/g, ' '); // Replace newlines with space for simple CSV
            const date = new Date(note.timestamp).toLocaleString().replace(/"/g, '""');

            csvContent += `"${title}","${url}","${content}","${date}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `web-notes-export-${new Date().toISOString().slice(0, 10)}.csv`);
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
            await chrome.storage.local.clear();
            loadNotes();
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
