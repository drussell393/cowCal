/*
 * cowCal Javascript calendar plugin
 * Author: Dave Russell Jr (drussell393)
 * License: MIT
 */

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/*
 * Here's something fun to blow minds. Below is the conversion function for timezones.
 * Because the server (this was originally built for WordPress) has a different saved
 * timezone from our local timezone in some cases, we want to be able to change everything
 * to the remote timezone. Here's the problem with that:
 *
 * - PHP uses seconds using the DateTimeZone class.
 * - Javascript uses seconds, minutes, and milliseconds mixed in. Date.prototype.getTime()
 *   is using milliseconds, while Date.prototype.getTimezoneOffset() uses minutes. In order
 *   to keep everything sane, we're going to convert everything to milliseconds.
 */
 
function convertTimezone(remoteUTCOffset) {
    // Handle our local time
    var localTime = new Date();
    var localUTC = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
    console.log(localTime.getHours() + ':' + localTime.getMinutes() + ':' + localTime.getSeconds());

    // Handle our desired time (from our settings page)
    var remoteTime = new Date(localUTC + (remoteUTCOffset * 1000));
    console.log(remoteTime.getHours() + ':' + remoteTime.getMinutes() + ':' + remoteTime.getSeconds());

    // Return our converted time
    return remoteTime;
}

function cowCal(remoteUTCOffset, month, year, firstDayofWeek) {
    // Get our current date/time
    var currentTime = convertTimezone(remoteUTCOffset);

    // Defining calendar presets
    this.namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var cowNamesOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.month = ((isNaN(month) || month == null) ? currentTime.getMonth() : month);
    this.year = ((isNaN(year) || year == null) ? currentTime.getFullYear() : year);
    this.firstDayofWeek = ((isNaN(firstDayofWeek) || firstDayofWeek == null) ? 0 : firstDayofWeek);
    // Check for leap years
    if (((this.year % 4) == 0) || ((this.year % 100) == 0) && ((this.year % 400) == 0)) {
        var cowDaysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    } else {
        var cowDaysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
    this.firstDayofMonth = new Date(this.year, this.month, 1).getDay();
    this.daysInMonth = cowDaysInMonths[this.month];
    this.nameOfMonth = cowNamesOfMonths[this.month];
}

cowCal.prototype.month = function() {
    var htmlOutput;
    htmlOutput += '<table class="cowCal-month">';
    htmlOutput += '<tr>';
    var i = this.firstDayofWeek;

    // Generate our labels for the days of the week
    if (i > 0) {
        for (i < 7; i++;) {
            htmlOutput += '<th>' + this.namesOfDays[i] + '</th>';
        }
        var i = 0;
        for (i < this.firstDayofWeek; i++;) {
            htmlOutput += '<th>' + this.namesOfDays[i] + '</th>';
        }
    }
    else
    {
        console.log(i);
        htmlOutput += '<th>' + this.namesOfDays[i] + '</th>';
    }
    htmlOutput += '</tr>';
    
    // Generate our actual days in the month
    var dayNumber = 1;
    var week = 0;
    var dayPosition = 0;

    for (week < 9; week++;) {
        htmlOutput += '<tr>';
        for (dayPosition <= 6; dayPosition++;) {
            htmlOutput += '<td>';
            if ((dayNumber <= this.daysInMonth) && (week > 0 || dayPosition >= this.firstDayofWeek)) {
                htmlOutput += dayNumber;
                dayNumber++;
            }
            htmlOutput += '</td>';
        }
        if (dayNumber > this.daysInMonth) {
            break;
        }
        else
        {
            htmlOutput += '</tr>';
            htmlOutput += '<tr>';
        }
    }
    htmlOutput += '</tr>';
    htmlOutput += '</table>';

    // Make htmlOutput part of the prototype/object
    this.htmlOutput = htmlOutput;
}
            
