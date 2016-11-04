/* global $ */
$('.calendarWorkingDayNormal :text.inputTT, .calendarCurrentDayNormal :text.inputTT').each((i, el) => {
  const $el = $(el)
  if ($el.val() === '') {
    $el.val('8:00')
  } else {
    $el.css('background-color', 'rgba(49, 128, 0, 0.32)')
  }
})
