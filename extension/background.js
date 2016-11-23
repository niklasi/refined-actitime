/* global chrome */

chrome.webNavigation.onCompleted.addListener(function (details) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: 'ready'})
  })
})
