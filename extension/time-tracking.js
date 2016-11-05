/* global $, chrome */
chrome.storage.sync.get({ taskId: 197, hoursPerDay: 8 }, function (items) {
  $(`#taskRow${items.taskId} .calendarWorkingDayNormal :text.inputTT, #taskRow${items.taskId} .calendarCurrentDayNormal :text.inputTT`).each((i, el) => {
    const $el = $(el)
    if ($el.val() === '') {
      $el.val(items.hoursPerDay)
      $el.css('background-color', 'rgba(255, 235, 141, 0.58)')
    }
  })
})
