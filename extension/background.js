chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case "chat":
            chrome.tabs.create({ url: "https://chatbot.morningstar369.com/" });
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
