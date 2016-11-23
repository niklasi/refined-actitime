/* global $, chrome */

$('.taskRow').each((i, el) => {
  const taskId = $(el).attr('id').replace('taskRow', '')

  const $task = $('span.task', el)
  const taskName = $task.text()

  $task.on('mouseover', () => {
    $task.text(`${taskName} (taskId: ${taskId})`)
  })

  $task.on('mouseout', () => {
    $task.text(taskName)
  })
})

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === 'ready') {
      chrome.storage.sync.get({ taskId: 197, hoursPerDay: '8:00' }, function (items) {
        $(`#taskRow${items.taskId} :text.inputTT`).each((i, el) => {
          const workingDay = $(`#leaveButton_${i}_table.disabled`).length === 0
          const $el = $(el)
          $el.focus()
          if ($el.val() === '' && workingDay) {
            $el.val(items.hoursPerDay)
            $el.css('background-color', 'rgba(255, 235, 141, 0.58)')
          }
          $el.blur()
        })
      })
    }
  }
)
