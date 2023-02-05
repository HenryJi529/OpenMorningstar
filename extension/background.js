chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case "ai":
            chrome.tabs.create({ url: "https://chat.openai.com/" });
            break;
        case "joke":
            chrome.tabs.create({ url: "https://morningstar369.com/joke/" });
            break;
        case "nav":
            chrome.tabs.create({ url: "https://morningstar369.com/nav/" });
            break;
        case "share":
            chrome.tabs.create({ url: "https://morningstar369.com/share/" });
            break;
        default:
            break;
    }
});
