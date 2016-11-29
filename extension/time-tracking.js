/* global chrome */

function eachTaskRow (cb) {
  const taskRows = [].slice.call(document.getElementsByClassName('taskRow'))
  taskRows.forEach(cb)
}

eachTaskRow((el, i) => {
  const taskId = el.getAttribute('id').replace('taskRow', '')

  const task = el.getElementsByClassName('task')[0]

  const taskName = task.innerText

  task.addEventListener('mouseover', () => {
    task.innerText = `${taskName} (taskId: ${taskId})`
  })

  task.addEventListener('mouseout', () => {
    task.innerText = taskName
  })
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'ready') {
    fillDefaultHours()
  }
}
)

function hasClass (el, className) {
  for (let item of el.classList.values()) {
    if (item === className) return true
  }

  return false
}

function fillDefaultHours () {
  chrome.storage.sync.get({ taskId: 197, hoursPerDay: '8:00' }, function (items) {
    [0, 1, 2, 3, 4, 5, 6]
      .filter(i => {
        const leaveButton = document.getElementById(`leaveButton_${i}_table`)
        return !hasClass(leaveButton, 'disabled') && leaveButton.title === 'Click to enter leave time'
      })
      .map(i => document.getElementById(`spent_${items.taskId}_${i}`))
      .filter(el => el.value === '')
      .forEach(el => {
        el.focus()
        el.value = items.hoursPerDay
        el.style.backgroundColor = 'rgba(255, 235, 141, 0.58)'
        el.blur()
      })
  })
}
