/**
 * @function range - setup years for query
 * @param  {number} start - start year
 * @param  {number} end   - end year
 * @return {Array} - array of years
 */
function range(start, end) {
    let temp = [];
    while (start <= end) {
        temp.push(start);
        start++;
    }
    return temp;
}
export const YEARS_SHOW = range(1980, 2014);

/**
 * @param width
 */
export const width = document
    .getElementById("mapcontainer")
    .offsetWidth;
export const height = $(window).height() - $(".navbar.navbar-default").height() * 2;

//offsets plus width/height of transform
export const offsetL = document
    .getElementById("worldmap")
    .offsetLeft + (width / 2.75);
export const offsetT = document
    .getElementById("worldmap")
    .offsetTop + (height / 2);

/**
 * @function getTopo
 * @param  {function} callback - return topo data
 */
export function getTopo(callback) {
    d3
        .json("data/world-topo.json", function (error, world) {
            if (world) {
                let topo = topojson
                    .feature(world, world.objects.countries)
                    .features;
                if (callback && typeof callback === "function") {
                    callback(topo);
                }
            }
        });
}

/**
 * @function getCountriesLatLongfromCSV
 * @param  {type} callback {description}
 */
export function getLatLong(callback) {
    d3
        .csv("data/countries.csv", function (LatLong) {
            if (callback && typeof callback === "function") {
                callback(LatLong);
            }
        });
}