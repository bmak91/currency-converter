let isFirstRun = true;
let rate, timestamp;

chrome.browserAction.onClicked.addListener(async (tab) => {
  ({ timestamp, rate } = await storage.get(["timestamp", "rate"]));

  if ((new Date() - timestamp) / 1000 / 60 / 60 > 12) {
    try {
      let resp = await fetch(
        "https://lirarate.com/wp-json/lirarate/v1/rates?currency=LBP&type=buy&date=latest"
      );
      let data = await resp.json();
      [timestamp, rate] = data[0];
      await storage.set({ timestamp, rate });
    } catch (e) {
      console.error(e);
    }
  }

  const onReady = (message) => {
    if (message === "ready") {
      chrome.tabs.sendMessage(tab.id, rate);
    }
  };

  if (isFirstRun) {
    isFirstRun = false;
    chrome.extension.onMessage.addListener(onReady);
  }

  chrome.tabs.executeScript(null, { file: "js/contentScript.js" });
});

function storage() {}

storage.get = (...key) => {
  return new Promise((rs, _) => chrome.storage.local.get(...key, rs));
};
storage.set = (items) =>
  new Promise((rs, _) => chrome.storage.local.set(items, rs));
