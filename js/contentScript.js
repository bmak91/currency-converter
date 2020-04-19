(async () => {
  const src = chrome.extension.getURL("js/contentMain.js");
  const contentScript = await import(src);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    contentScript.main({ rate: message });
  });

  chrome.runtime.sendMessage("ready");
})();
