// Play History Data
$(function () {
    //prevent submit search form
    $(".navbar-form")
        .submit(function () {
            return false;
        });
});

$("#history_revew_bnt").on("click", function () {
    // recursive to call all year by adding i
    var iterate = function (i, next, callback) {
        if (i++ < arrayYears.length) {
            console.log(data_selection + ": " + arrayYears[i]);
            $("#dropdown :selected").text(arrayYears[i]);
            $("#input_year").val(arrayYears[i]);
            refreshData(function (error) {
                if (error) {
                    callback(error);
                } else {
                    // set timer to delay
                    setTimeout(function () {
                        next(i, next, callback);
                    }, 500);
                }
            });
        } else {
            callback();
        }
    };
    //after recursive all years, will return to year 2000
    iterate(0, iterate, function () {
        year_selection = 2000;
        $("#dropdown :selected").text(year_selection);
        $("#input_year").val(year_selection);
        $("#data_title").text(data_selection + ": " + year_selection);
        refreshData();
    });
});