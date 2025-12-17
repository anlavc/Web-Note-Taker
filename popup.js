document.addEventListener('DOMContentLoaded', async () => {
    // Apply theme immediately
    chrome.storage.local.get('theme', (result) => {
        if (result.theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    });

    const urlDisplay = document.getElementById('urlDisplay');
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const noteTitleDisplay = document.getElementById('noteTitleDisplay');
    const noteContentDisplay = document.getElementById('noteContentDisplay');
    const titleInput = document.getElementById('titleInput');
    const noteInput = document.getElementById('noteContent');

    // Buttons
    const openOptionsBtn = document.getElementById('openOptions');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const categorySelect = document.getElementById('categorySelect');

    const takeScreenshotBtn = document.getElementById('takeScreenshotBtn');
    const screenshotPreview = document.getElementById('screenshotPreview');
    const screenshotDisplay = document.getElementById('screenshotDisplay');
    const removeScreenshotBtn = document.getElementById('removeScreenshotBtn');
    const noteScreenshotView = document.getElementById('noteScreenshotView'); // For View Mode

    let currentUrl = '';
    let currentScreenshotInfo = null; // To store dataUrl

    // Get current tab URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
        currentUrl = tab.url;
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

    // Load categories
    async function loadCategories() {
        if (!categorySelect) return;

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
        if (currentUrl) {
            const resultNote = await chrome.storage.local.get([currentUrl]);
            if (resultNote[currentUrl] && resultNote[currentUrl].categoryId) {
                categorySelect.value = resultNote[currentUrl].categoryId;
            }
        }
    }

    // Screenshot Logic
    if (takeScreenshotBtn) {
        takeScreenshotBtn.addEventListener('click', () => {
            chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 50 }, (dataUrl) => {
                if (chrome.runtime.lastError) {
                    alert('Error capturing screenshot: ' + chrome.runtime.lastError.message);
                    return;
                }

                // Resize image to reduce storage size
                resizeImage(dataUrl, 800, (resizedDataUrl) => {
                    currentScreenshotInfo = resizedDataUrl;
                    showScreenshotPreview(resizedDataUrl);
                });
            });
        });
    }

    if (removeScreenshotBtn) {
        removeScreenshotBtn.addEventListener('click', () => {
            currentScreenshotInfo = null;
            if (screenshotPreview) screenshotPreview.style.display = 'none';
        });
    }

    function showScreenshotPreview(dataUrl) {
        if (screenshotDisplay) {
            screenshotDisplay.src = dataUrl;
        }
        if (screenshotPreview) {
            screenshotPreview.style.display = 'block';
        }
    }

    function resizeImage(url, maxWidth, callback) {
        const sourceImage = new Image();
        sourceImage.onload = function () {
            const canvas = document.createElement("canvas");
            let width = sourceImage.width;
            let height = sourceImage.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(sourceImage, 0, 0, width, height);

            callback(canvas.toDataURL("image/jpeg", 0.7));
        }
        sourceImage.src = url;
    }

    // View Mode
    function showViewMode(note) {
        if (noteTitleDisplay) noteTitleDisplay.textContent = note.title;
        if (noteContentDisplay) noteContentDisplay.textContent = note.content;

        if (note.screenshot && noteScreenshotView) {
            noteScreenshotView.src = note.screenshot;
            noteScreenshotView.style.display = 'block';
            noteScreenshotView.onclick = () => {
                const newTab = window.open();
                newTab.document.write(`<img src="${note.screenshot}" style="max-width: 100%;">`);
            };
            noteScreenshotView.style.cursor = 'pointer';
        } else if (noteScreenshotView) {
            noteScreenshotView.style.display = 'none';
        }

        if (viewMode) viewMode.style.display = 'block';
        if (editMode) editMode.style.display = 'none';
    }

    // Edit Mode
    function showEditMode(isNew = false) {
        if (!isNew) {
            if (titleInput && noteTitleDisplay) titleInput.value = noteTitleDisplay.textContent;
            if (noteInput && noteContentDisplay) noteInput.value = noteContentDisplay.textContent;

            chrome.storage.local.get(currentUrl, (result) => {
                const note = result[currentUrl];
                // Category handling
                if (note && note.categoryId && categorySelect) {
                    categorySelect.value = note.categoryId;
                } else if (categorySelect) {
                    categorySelect.value = '';
                }

                // Screenshot handling
                if (note && note.screenshot) {
                    currentScreenshotInfo = note.screenshot;
                    showScreenshotPreview(note.screenshot);
                } else {
                    currentScreenshotInfo = null;
                    if (screenshotPreview) screenshotPreview.style.display = 'none';
                }
            });
        } else {
            if (titleInput) titleInput.value = '';
            if (noteInput) noteInput.value = '';
            if (categorySelect) categorySelect.value = '';
            currentScreenshotInfo = null;
            if (screenshotPreview) screenshotPreview.style.display = 'none';
        }

        if (viewMode) viewMode.style.display = 'none';
        if (editMode) editMode.style.display = 'block';
        if (cancelBtn) cancelBtn.style.display = isNew ? 'none' : 'inline-block';
    }

    // Event Listeners
    if (openOptionsBtn) {
        openOptionsBtn.addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showEditMode(false);
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            loadNote();
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const title = titleInput ? titleInput.value.trim() : '';
            const content = noteInput ? noteInput.value.trim() : '';
            const categoryId = categorySelect ? categorySelect.value : '';
            const screenshot = currentScreenshotInfo;

            if (!title && !content && !screenshot) {
                alert(chrome.i18n.getMessage('alertEnterContent'));
                return;
            }

            const noteData = {
                title,
                content,
                url: currentUrl,
                categoryId,
                screenshot,
                timestamp: new Date().toISOString()
            };

            try {
                await chrome.storage.local.set({ [currentUrl]: noteData });
                loadNote();
            } catch (e) {
                if (e.message.includes('QUOTA_BYTES')) {
                    alert("Error: Note is too large. Please remove the screenshot or shorten text.");
                } else {
                    alert("Error saving note: " + e.message);
                }
            }
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (confirm(chrome.i18n.getMessage('confirmDelete'))) {
                await chrome.storage.local.remove(currentUrl);
                showEditMode(true);
            }
        });
    }

});
