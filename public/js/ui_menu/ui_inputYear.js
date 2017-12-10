// update Heat Map base on input year
$("#input_year")
    .change(function () {
        if (!loadingState) {
            $("#dropdown").val($(this).val());
            refreshData();
        }
    });