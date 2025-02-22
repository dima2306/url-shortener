module.exports = {
  /**
   * Check if the object is empty
   *
   * @param object
   * @returns {boolean}
   *
   * @link https://stackoverflow.com/a/32108184
   */
  isObjectEmpty: function(object) {
    for (const prop in object) {
      if (Object.hasOwn(object, prop)) {
        return false;
      }
    }

    return true;
  },

  /**
   * @param string
   * @returns {string}
   */
  capitalizeFirstLetter: function(string) {
    if (!string) {
      return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  /**
   * Function to get today's date in YYYY-MM-DD format considering a timezone offset
   *
   * @param timezoneOffset
   * @returns {string}
   */
  getTodayDate: function(timezoneOffset = 0) {
    const today = new Date();
    // Calculate the local date by adding the timezone offset in milliseconds
    const localDate = new Date(
        today.getTime() + (timezoneOffset * 60 * 60 * 1000),
    );

    return localDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
  },

  /**
   * Function to slugify a string
   *
   * @param string
   * @returns {string}
   */
  slugify: function(string) {
    return string
        .toString()
        .normalize('NFD') // Normalize to decompose combined characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with a single hyphen
        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, '') // Trim hyphens from start and end
        .replace(/[^a-z0-9 -]/g, '') // Remove invalid characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/@/g, 'at') // Replace @ with 'at'
        .replace(/#/g, 'number') // Replace # with 'number'
        .replace(/\$/g, 'dollar') // Replace $ with 'dollar'
        ;
  },
};
