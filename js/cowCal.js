/*
 * cowCal Javascript calendar plugin
 * Author: Dave Russell (drussell393)
 * License: MIT
 */

function convertTimezone(remoteUTCOffset) {
    // Handle our local time
    var localTime = new Date();
    var localUTC = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);

    // Handle our desired time (from our settings page)
    var remoteTime = new Date(localUTC + (3600000 * remoteUTCOffset));
    
    // Return our converted time
    return remoteTime.toLocaleString();
}

function generateCalendar(remoteUTCOffset, month, year) {
    // Set our available sizes
    var sizeArray = ['day', '4days', 'week', 'month', 'year'];

    // Get our current date/time
    var currentTime = convertTimezone(remoteUTCOffset);
    
    // Defining calendar presets
    this.cowNamesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.cowNamesOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.month = ((isNaN(month) || month == null) ? currentTime.getMonth() : month);
    this.year = ((isNaN(year) || year == null) ? currentTime.getFullYear() : year);
    var size = ((isInArray(size, sizesArray)) ? size : 'month');
    // Check for leap years
    if (((this.year % 4) == 0) || ((this.year % 100) == 0) && ((this.year % 400) == 0)) {
        var cowDaysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    } else {
        var cowDaysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }

    this.firstDayofMonth = new Date(this.year, this.month, 1).getDay();
    this.daysInMonth = cowDaysInMonths[this.month];
    this.nameOfMonth = cowNamesOfMonth[this.month];
    // Month Calendar
    if (this.size == 'month') {

        // Find general information about this month (position of first day, days in it, and name of the month)
    }
}


