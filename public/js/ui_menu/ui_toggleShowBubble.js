// Show or Hide Bubble Map
$(".bubble_map")
    .on("click", function () {
        if ($("input[type='checkbox']").is(":checked")) {
            console.log("Show Bubble Map");
            circles.classed("hidden", false);
        } else {
            console.log("Hide Bubble Map");
            circles.classed("hidden", true);
        }
    });