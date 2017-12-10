////////////////Data type selection///////////////////////////
$(".dropdown-menu li")
    .on("click", function (argument) {
        data_selection = $(this).text();
        $(".data-selection-label").text(data_selection);
        refreshData();
    });