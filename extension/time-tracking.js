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
})

function hasClass (el, className) {
  for (let item of el.classList.values()) {
    if (item === className) return true
  }

  return false
}

const leaveButtons = [
  document.getElementById(`leaveButton_0_table`),
  document.getElementById(`leaveButton_1_table`),
  document.getElementById(`leaveButton_2_table`),
  document.getElementById(`leaveButton_3_table`),
  document.getElementById(`leaveButton_4_table`),
  document.getElementById(`leaveButton_5_table`),
  document.getElementById(`leaveButton_6_table`)
]

function workingDay (i) {
  return !hasClass(leaveButtons[i], 'disabled')
}

function noLeaveTime (i) {
  return leaveButtons[i].title === 'Click to enter leave time'
}

function getStartDate () {
  const value = document.getElementsByTagName('input')['dateStr'].value
  return new Date(Date.parse(`${value.substr(0, 4)}-${value.substr(4, 2)}-${value.substr(6, 2)}`))
}

function notInFuture (i) {
  let date = getStartDate()
  date.setDate(date.getDate() + i)
  return new Date().toISOString().substring(0, 10) >= date.toISOString().substring(0, 10)
}

function fillDefaultHours () {
  chrome.storage.sync.get({ taskId: 197, hoursPerDay: '8:00' }, function (items) {
    [0, 1, 2, 3, 4, 5, 6]
      .filter(i => notInFuture(i))
      .filter(i => workingDay(i))
      .filter(i => noLeaveTime(i))
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
