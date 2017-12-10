/**
 * @function ajaxGetFn
 * @param  {string} q_url  - query string
 * @param  {function} callback - callback function returning err and query result
 */
function ajaxGetFn(q_url, callback) {
    $.ajax({
        url: q_url,
        data: {
            format: 'json'
        },
        error: (err) => callback(err, null),
        dataType: 'jsonp',
        success: (data) => callback(null, data),
        type: 'GET'
    });
}

/**
 * @function fetchDataByName
 * @param  {string} country_name   - specific country name
 * @param  {string} data_selection - selected data type
 * @param  {function} callback     - callback function returning err and query result
 */
export function fetchDataByName(country_name, data_selection, callback) {

    let q_url = `/countries/${country_name}?selection=${data_selection}`;
    ajaxGetFn(q_url, function (err, data) {
        if (callback && typeof callback === "function") {
            callback(err, data);
        }
    });
}

/**
 * @function fetchDataByYear
 * @param  {number} country_name   - specific year
 * @param  {string} data_selection - selected data type
 * @param  {function} callback     - callback function returning err and query result
 */
export function fetchDataByYear(year_selection, data_selection, callback) {

    // set default year as 2000
    if (!year_selection) {
        year_selection = 2000;
    }

    let q_url = `/${year_selection}?selection=${data_selection}`;
    ajaxGetFn(q_url, function (err, data) {
        if (callback && typeof callback === "function") {
            callback(err, data);
        }
    });
}