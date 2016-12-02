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
    createWeekLinks()
    AddKeyboardShortcuts()
  }
})

function GoToLocation(url) {
  window.location = url;
}

function AddKeyboardShortcuts() {
  Mousetrap.bind(['h','left'], function(e) {
    GoToLocation(document.getElementById("previousWeek").href);
  });
  Mousetrap.bind(['l','right'], function(e) {
    GoToLocation(document.getElementById("nextWeek").href);
  });
}

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

function formattedDateString (date) {
  return date.toISOString().substring(0, 10)
}

function getStartDate () {
  const value = document.getElementsByTagName('input')['dateStr'].value
  const date = new Date(Date.parse(`${value.substr(0, 4)}-${value.substr(4, 2)}-${value.substr(6, 2)}`))
  // Check if it is a monday
  if (date.getDay() === 1) return date

  date.setDate(date.getDate() - (date.getDay() - 1))
  return date
}

function notInFuture (i) {
  let date = getStartDate()
  date.setDate(date.getDate() + i)
  const today = formattedDateString(new Date())
  const candidate = formattedDateString(date)
  console.log(today, candidate)
  return today >= candidate
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

function createDateSelectorLink (text, date, id) {
  const a = document.createElement('a')
  const idAttribute = document.createAttribute('id')
  const href = document.createAttribute('href')
  const formattedDate = formattedDateString(date).replace(/-/g, '')
  href.value = `submit_tt.do?dateStr=${formattedDate}`
  idAttribute.value = id
  a.attributes.setNamedItem(href)
  a.attributes.setNamedItem(idAttribute)
  a.innerText = text
  return a
}

function createWeekLinks () {
  const linkContainer = document.getElementById('fromDateSelector')
  const prevDate = getStartDate()
  prevDate.setDate(prevDate.getDate() - 7)
  linkContainer.appendChild(createDateSelectorLink('<< Previous week', prevDate, 'previousWeek'))
  linkContainer.appendChild(document.createTextNode(' '))
  const nextDate = getStartDate()
  nextDate.setDate(nextDate.getDate() + 7)
  linkContainer.appendChild(createDateSelectorLink('Next week >>', nextDate, 'nextWeek'))
}

