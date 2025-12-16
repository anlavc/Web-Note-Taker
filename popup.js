document.addEventListener('DOMContentLoaded', async () => {
    const urlDisplay = document.getElementById('urlDisplay');
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const noteTitleDisplay = document.getElementById('noteTitleDisplay');
    const noteContentDisplay = document.getElementById('noteContentDisplay');
    const noteTitleInput = document.getElementById('noteTitle');
    const noteContentInput = document.getElementById('noteContent');

    const openOptionsBtn = document.getElementById('openOptions');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    let currentUrl = '';

    // Get current tab URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
        currentUrl = tab.url;
        urlDisplay.textContent = new URL(currentUrl).hostname + (new URL(currentUrl).pathname.length > 1 ? '...' : '');
        urlDisplay.title = currentUrl;
        loadNote();
    } else {
        urlDisplay.textContent = chrome.i18n.getMessage('noUrl');
    }

    // Load note from storage
    async function loadNote() {
        const result = await chrome.storage.local.get(currentUrl);
        const note = result[currentUrl];

        if (note) {
            showViewMode(note);
        } else {
            showEditMode(true); // true = isNew
        }
    }

    function showViewMode(note) {
        noteTitleDisplay.textContent = note.title;
        noteContentDisplay.textContent = note.content;
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
    }

    function showEditMode(isNew = false) {
        if (!isNew) {
            noteTitleInput.value = noteTitleDisplay.textContent;
            noteContentInput.value = noteContentDisplay.textContent;
        } else {
            noteTitleInput.value = '';
            noteContentInput.value = '';
        }
        viewMode.style.display = 'none';
        editMode.style.display = 'block';

        cancelBtn.style.display = isNew ? 'none' : 'inline-block';
    }

    // Event Listeners
    openOptionsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });

    editBtn.addEventListener('click', () => {
        showEditMode(false);
    });

    cancelBtn.addEventListener('click', () => {
        loadNote(); // Reload to discard changes and go back to view
    });

    saveBtn.addEventListener('click', async () => {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (!title && !content) {
            alert(chrome.i18n.getMessage('alertEnterContent'));
            return;
        }

        const noteData = {
            title,
            content,
            url: currentUrl,
            timestamp: new Date().toISOString()
        };

        await chrome.storage.local.set({ [currentUrl]: noteData });
        loadNote();
    });

    deleteBtn.addEventListener('click', async () => {
        if (confirm(chrome.i18n.getMessage('confirmDelete'))) {
            await chrome.storage.local.remove(currentUrl);
            showEditMode(true);
        }
    });
});
