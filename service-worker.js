function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'summarize-text',
    title: 'Summarize and Take Notes',
    contexts: ['selection']
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((data, tab) => {
  if (data.menuItemId === 'summarize-text') {
    const selectedText = data.selectionText;
    if (selectedText) {
      chrome.storage.local.set({ lastTextToSummarize: selectedText });
      chrome.storage.local.set({ lastHighlightedNote: selectedText }); // Save the highlighted text as a note

      // Open side panel
      chrome.sidePanel.open({ tabId: tab.id });
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});
