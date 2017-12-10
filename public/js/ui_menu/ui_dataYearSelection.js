//Initialize Dropdown list
var selObj = $("#dropdown");
for (var i = 0; i < arrayYears.length; ++i) {
    addOption(selObj, arrayYears[i], arrayYears[i]);
}

function addOption(selectbox, text, value) {
    selectbox.append($("<option/>", {
        value: value,
        text: text
    }));
}

//Use Search to get year
$("#year_search_bnt")
    .on("click", function () {
        $("#dropdown").val($("#input_year").val());
        refreshData();
    });

// Redraw Map Whenver Select Year
$("select").on("change", refreshData);