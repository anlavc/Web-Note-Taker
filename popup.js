document.addEventListener('DOMContentLoaded', async () => {
    const urlDisplay = document.getElementById('urlDisplay');
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const noteTitleDisplay = document.getElementById('noteTitleDisplay');
    const noteContentDisplay = document.getElementById('noteContentDisplay');
    const titleInput = document.getElementById('titleInput'); // Matched to HTML id="titleInput"
    const noteInput = document.getElementById('noteContent'); // Matched to HTML id="noteContent"

    const openOptionsBtn = document.getElementById('openOptions');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const categorySelect = document.getElementById('categorySelect'); // New element

    let currentUrl = '';
    let currentTabId = null; // New variable

    // Get current tab URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
        currentUrl = tab.url;
        currentTabId = tab.id; // Set currentTabId
        urlDisplay.textContent = new URL(currentUrl).hostname + (new URL(currentUrl).pathname.length > 1 ? '...' : '');
        urlDisplay.title = currentUrl;
        loadNote();
        loadCategories(); // Load categories when popup opens
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

    // New function to load categories
    async function loadCategories() {
        const result = await chrome.storage.local.get(['categories']);
        const categories = result.categories || [];

        // Keep the first "No Category" option
        categorySelect.innerHTML = `<option value="">${chrome.i18n.getMessage('noCategory')}</option>`;

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });

        // Re-select if we already loaded the note and it had a category
        const resultNote = await chrome.storage.local.get([currentUrl]);
        if (resultNote[currentUrl] && resultNote[currentUrl].categoryId) {
            categorySelect.value = resultNote[currentUrl].categoryId;
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
            titleInput.value = noteTitleDisplay.textContent; // Use titleInput
            noteInput.value = noteContentDisplay.textContent; // Use noteInput
            // Set category if it exists in the note
            chrome.storage.local.get(currentUrl, (result) => {
                const note = result[currentUrl];
                if (note && note.categoryId) {
                    categorySelect.value = note.categoryId;
                } else {
                    categorySelect.value = '';
                }
            });
        } else {
            titleInput.value = ''; // Use titleInput
            noteInput.value = ''; // Use noteInput
            categorySelect.value = ''; // Clear category for new note
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
        const title = titleInput.value.trim(); // Use titleInput
        const content = noteInput.value.trim(); // Use noteInput
        const categoryId = categorySelect.value; // Get selected category

        if (!title && !content) {
            alert(chrome.i18n.getMessage('alertEnterContent'));
            return;
        }

        const noteData = {
            title,
            content,
            url: currentUrl,
            categoryId: categoryId, // Save category
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
