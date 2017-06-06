export default {
  functional: true,
  render: function (h, { data, children }) {
  // data.staticClass = data.staticClass ? `${c} ${data.staticClass}` : c

    return h('div', data, children)
  }
}
