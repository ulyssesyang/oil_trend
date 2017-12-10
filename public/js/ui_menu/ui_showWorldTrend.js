// World Line Graph
$("#world_trend")
    .on("click", function () {
        $(".overlay").empty();
        var worldGraph = function () {
            loadingStatus(true);
            last_url = `/countries?selection=${data_selection}`;
            $
                .ajax({
                    url: "/countries?selection=" + data_selection,
                    method: "GET",
                    dataType: "json"
                })
                .done(function (data) {
                    renderWorld(data);
                    loadingStatus(false);
                });
        };
        worldGraph();
        $("img#loading").remove();
        $(".overlay").css("display", "inline-block");
        $("#mapcontainer").on("click", function () {
            $(".overlay").empty();
        });
    });