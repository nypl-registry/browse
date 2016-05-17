
var WindowTitleMixin = {
  setWindowTitle: function (section, title) {
    var parts = ['data.nypl.org']
    if (section) parts.unshift(section)
    if (title) parts.unshift(title)
    var title = parts.join(' | ')
    console.log('sett: ', title)

    window.document.title = title
  },
}

export default WindowTitleMixin
