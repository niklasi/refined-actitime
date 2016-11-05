/* global chrome */
// Saves options to chrome.storage.sync.
function saveOptions () {
  var taskId = document.getElementById('default-task').value
  var hoursPerDay = document.getElementById('default-time').value
  chrome.storage.sync.set({ taskId, hoursPerDay }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status')
    status.textContent = 'Options saved.'
    setTimeout(function () {
      status.textContent = ''
    }, 750)
  })
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions () {
  chrome.storage.sync.get({ taskId: 197, hoursPerDay: '8:00' }, function (items) {
    document.getElementById('default-task').value = items.taskId
    document.getElementById('default-time').value = items.hoursPerDay
  })
}
document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
