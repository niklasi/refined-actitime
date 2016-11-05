/* global $, chrome */
chrome.storage.sync.get({ taskId: 197, hoursPerDay: '8:00' }, function (items) {
  $(`#taskRow${items.taskId} :text.inputTT`).each((i, el) => {
    const workingDay = $(`#leaveButton_${i}_table.disabled`).length === 0
    const $el = $(el)
    if ($el.val() === '' && workingDay) {
      $el.val(items.hoursPerDay)
      $el.css('background-color', 'rgba(255, 235, 141, 0.58)')
    }
  })
})
