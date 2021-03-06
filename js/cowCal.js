/*
 * cowCal Javascript calendar plugin
 * Author: Dave Russell Jr (drussell393)
 * License: MIT
 */

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

    // Handle our desired time (from our settings page)
    var remoteTime = new Date(localUTC + (remoteUTCOffset * 1000));

    // Return our converted time
    return remoteTime;
}

function cowCal(remoteUTCOffset, month, year) {
    // Get our current date/time
    var currentTime = convertTimezone(remoteUTCOffset);

    // Defining calendar presets
    this.namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var cowNamesOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.month = ((isNaN(month) || month == null) ? currentTime.getMonth() : month);
    this.year = ((isNaN(year) || year == null) ? currentTime.getFullYear() : year);
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

cowCal.prototype.cowHolidayChooser = function(phpAction) {
    jQuery('td.cowDay').click(function() {
        console.log('test');
        jQuery.ajax({
            type: 'POST',
            url: phpAction,
            data: jQuery(this).data('date'),
            success: function(msg) {
                jQuery(this).find('.holidayChooser .isHoliday').prop('checked', msg[0]);
                jQuery(this).find('.holidayChooser .isRepeating').prop('checked', msg[1]);
                jQuery(this).find('.holidayChooser').show();
            }
        });
    });
}

cowCal.prototype.cowClickSubmit = function(phpAction, element) {
    jQuery(element).on('click', function() {
        this.preventDefault();
        jQuery.ajax({
            type: 'POST',
            url: phpAction,
            data: jQuery(element).serialize(),
            success: function() {
                jQuery('successMsg').show();
            }
        });
    });
}

cowCal.prototype.cowMonth = function(holidayChooser) {
    var htmlOutput = '<div class="cowCal-month">';
    htmlOutput += '<h3>' + this.nameOfMonth + '</h3>';
    htmlOutput += '<table>';
    htmlOutput += '<tr>';

    // Generate our labels for the days of the week
    for (var i = 0; i < 7; i++) {
        htmlOutput += '<th>' + this.namesOfDays[i] + '</th>';
    }
    htmlOutput += '</tr>';
    
    // Generate our actual days in the month
    var dayNumber = 1;

    for (var week = 0; week < 9; week++) {
        htmlOutput += '<tr>';
        for (var dayPosition = 0; dayPosition <= 6; dayPosition++) {
            htmlOutput += '<td class="cowDay" data-date="' + this.month + dayNumber + this.year + '">';
            if ((dayNumber <= this.daysInMonth) && (week > 0 || dayPosition >= this.firstDayofMonth)) {
                htmlOutput += dayNumber;
                if (holidayChooser == true) {
                    htmlOutput += '<div class="holidayChooser">';
                    htmlOutput += '<label for="isHoliday">Holiday?</label>';
                    htmlOutput += '<input type="checkbox" value="1" class="isHoliday" id="isHoliday" />';
                    htmlOutput += '<label for="isRepeating">Repeats every year?</label>';
                    htmlOutput += '<input type="checkbox" value="1" class="isRepeating" id="isRepeating" />';
                    htmlOutput += '</div>'; 
                }
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
    htmlOutput += '</div>';

    return htmlOutput;
}

function cowGenerate12Months(remoteUTCOffset, year, holidayChooser, phpAction) {
    var htmlOutput = '';
    for (var i = 0; i < 12; i++) {
        var generateCalendar = new cowCal(remoteUTCOffset, i, year);
        htmlOutput += generateCalendar.cowMonth(holidayChooser);
    }
    if (holidayChooser = true) {
        jQuery(document).ready(function() {
            generateCalendar.cowHolidayChooser(phpAction);
        });
    }
    return htmlOutput;
}

