// Set timer for redraw heat map
function throttle() {
    var throttleTimer;
    window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function () {
        redraw();
    }, 200);
}

d3
    .select(window)
    .on("resize", throttle);

/// Redraw Topo map
function redraw() {
    d3
        .select(".map")
        .remove();
    setup(width, height);
    draw(topo);
}