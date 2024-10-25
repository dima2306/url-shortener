module.exports = {
  /**
   * Check if the object is empty
   *
   * @param object
   * @returns {boolean}
   *
   * @link https://stackoverflow.com/a/32108184
   */
  isObjectEmpty: function (object) {
    for (const prop in object) {
      if (Object.hasOwn(object, prop)) {
        return false
      }
    }

    return true
  },

  /**
   * @param string
   * @returns {string}
   */
  capitalizeFirstLetter: function (string) {
    if (! string) {
      return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}
