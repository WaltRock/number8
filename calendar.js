function getValue(element) {
    return document.getElementById(element);
}

function calendar(date, noDays, parent) {

    var $this = this;
    $this.date = new Date(date);
    noDays = parseInt(noDays);
    $this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $this.header = '<div class="cal"> <table id="days"><td>S</td><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td></table>';
    $this.footer = '</div>'
    $this.body = '';

    //Adding function to Date this helps to get the number of the week with sunday as the first day
    Date.prototype.getWeekNumber = function () {
        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        d.setUTCDate(d.getUTCDate() - d.getUTCDay());
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    function addDay(date) {
        date.setDate(date.getDate() + 1);
    }

    function compareDates(d1, d2) {
        return d1.getTime() === d2.getTime();
    }

    function isLastDay(date) {
        return new Date(date.getTime() + 86400000).getDate() === 1;
    }

    function getPostDays(startDate, endDate) {
        if (endDate.getMonth() > startDate.getMonth()) {
            var x = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            return x;
        } else {
            var x = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
            return x
        }
    }

    function addDayToCalendar(calendar, actualMonth, actualYear, weekNumber, startDate) {
        if (!calendar[actualYear][actualMonth]["weeks"][weekNumber]) {
            calendar[actualYear][actualMonth]["weeks"][weekNumber] = {};
            calendar[actualYear][actualMonth]["weeks"][weekNumber]["length"] = 0;
            calendar[actualYear][actualMonth]["weeks"][weekNumber]["dom"] = "<tr>"
        }
        calendar[actualYear][actualMonth]["weeks"][weekNumber]["length"]++;
        calendar[actualYear][actualMonth]["weeks"][weekNumber]["dom"] += $this.getCalendarBody(startDate)
        if (startDate.getDay() === 6) {
            calendar[actualYear][actualMonth]["weeks"][weekNumber]["dom"] += "</tr>";
        }
    }

    function addInvalidDaysToCalendar(calendar, actualMonth, actualYear, weekNumber, startDate, limit, end) {
        for (var i = 0; i < limit; i++) {

            if (!calendar[actualYear][actualMonth]["weeks"][weekNumber]) {
                calendar[actualYear][actualMonth]["weeks"][weekNumber] = {};
                calendar[actualYear][actualMonth]["weeks"][weekNumber]["length"] = 0;
                calendar[actualYear][actualMonth]["weeks"][weekNumber]["dom"] = '<tr>' + $this.getCalendarBody(null);
            } else {
                calendar[actualYear][actualMonth]["weeks"][weekNumber]["length"]++;
                calendar[actualYear][actualMonth]["weeks"][weekNumber]["dom"] += $this.getCalendarBody(null);
            }
        }

        if (end) {
            calendar[actualYear][actualMonth]["weeks"][weekNumber]["dom"] += '</tr>'
        }
    }

    $this.setCalendar = function () {
        var startDate = new Date($this.date);
        var endDate = new Date($this.date);
        endDate.setDate($this.date.getDate() + noDays);
        var calendar = [];
        while (!compareDates(startDate, endDate)) {
            var actualMonth = startDate.getMonth();
            var weekNumber = startDate.getWeekNumber();
            var actualYear = startDate.getFullYear();
            if (!calendar[actualYear]) {
                calendar[actualYear] = [];
            }
            if (!calendar[actualYear][actualMonth]) {
                calendar[actualYear][actualMonth] = {};
                calendar[actualYear][actualMonth]["dom"] = getMonthHeader(startDate);
                calendar[actualYear][actualMonth]["preDays"] = startDate.getDay();
                calendar[actualYear][actualMonth]["postDays"] = getPostDays(startDate, endDate).getDay();
                calendar[actualYear][actualMonth]["endDate"] = getPostDays(startDate, endDate);
                calendar[actualYear][actualMonth]["weeks"] = [];
                calendar[actualYear][actualMonth]["dom"] += getCalendarHeader();

                addInvalidDaysToCalendar(calendar, actualMonth, actualYear, weekNumber, startDate, calendar[actualYear][actualMonth]["preDays"]);
                addDayToCalendar(calendar, actualMonth, actualYear, weekNumber, startDate);
            } else {

                addDayToCalendar(calendar, actualMonth, actualYear, weekNumber, startDate);
                if (startDate.getTime() === calendar[actualYear][actualMonth]["endDate"].getTime()) {

                    var diff = 7 - calendar[actualYear][actualMonth]["weeks"][weekNumber]["length"];

                    addInvalidDaysToCalendar(calendar, actualMonth, actualYear, weekNumber, startDate, diff, true);
                }
            }

            addDay(startDate);

        }

        calendar.forEach(function (year) {
            year.forEach(function (val) {
                $this.body += val.dom;
                val.weeks.forEach(function (valDom, numWeek) {
                    $this.body += valDom.dom;
                })
                $this.body += '</tbody>            </table>        </div>';
            })
        });
        console.log($this.body)

    }

    $this.getCalendarBody = function (dateTmp) {
        var classHtml = "";
        var dayNumber;
        if (!dateTmp) {
            classHtml = 'class="nil"';
            dayNumber = "";
        } else if (dateTmp.getDay() === 0 || dateTmp.getDay() === 6) {
            classHtml = 'class="weekend"';
            dayNumber = dateTmp.getDate();
        } else {
            classHtml = 'class="weekday"';
            dayNumber = dateTmp.getDate();
        }
        return '<td ' + classHtml + '>' + dayNumber + '</td>';
    }
    $this.getCalendarHeader = function () {
        return '<div id="cal-frame"><table class="curr"><tbody>';
    }

    $this.getCalendar = function (dateTmp) {
        $this.setCalendar();
        return $this.header + $this.body + $this.footer;
    };

    $this.getMonthHeader = function (dateTmp) {
        var month = $this.months[dateTmp.getMonth()];
        return '<div class="header"><span class="month-year">' + month + ' </span></div>';
    }


    $this.getMonthBody = function () {
        var month = $this.months[dateTmp.getMonth()];

    }

    parent.innerHTML = $this.getCalendar($this.date);
    console.log(parent);
}