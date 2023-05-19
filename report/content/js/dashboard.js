/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 46.666666666666664, "KoPercent": 53.333333333333336};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23333333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "POST REGISTER BUYER "], "isController": false}, {"data": [0.0, 500, 1500, "GET SELLER PRODUCT"], "isController": false}, {"data": [0.0, 500, 1500, "GET SELLER PRODUCT ID"], "isController": false}, {"data": [0.0, 500, 1500, "PUT BUYER ORDER ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST LOGIN BUYER"], "isController": false}, {"data": [0.0, 500, 1500, "GET BUYER PRODUCT ID"], "isController": false}, {"data": [0.0, 500, 1500, "GET BUYER ORDER ID"], "isController": false}, {"data": [0.0, 500, 1500, "POST SELLER REGISTER"], "isController": false}, {"data": [0.0, 500, 1500, "DELETE SELLER PRODUCT ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST SELLER LOGIN"], "isController": false}, {"data": [0.0, 500, 1500, "POST BUYER ORDER"], "isController": false}, {"data": [0.75, 500, 1500, "GET BUYER ORDER"], "isController": false}, {"data": [0.0, 500, 1500, "POST SELLER PRODUCT 2"], "isController": false}, {"data": [0.75, 500, 1500, "GET BUYER PRODUCT"], "isController": false}, {"data": [0.0, 500, 1500, "POST SELLER PRODUCT"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 16, 53.333333333333336, 788.5666666666666, 1, 2831, 482.0, 2234.400000000001, 2753.45, 2831.0, 2.376049421827974, 1.704537016869951, 1.2022562569301443], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST REGISTER BUYER ", 2, 0, 0.0, 2215.0, 1599, 2831, 2215.0, 2831.0, 2831.0, 2831.0, 0.6983240223463687, 0.4187216305865922, 1.1572811190642458], "isController": false}, {"data": ["GET SELLER PRODUCT", 2, 0, 0.0, 1789.0, 1781, 1797, 1789.0, 1797.0, 1797.0, 1797.0, 1.1129660545353368, 0.29997913188647746, 0.4434474123539232], "isController": false}, {"data": ["GET SELLER PRODUCT ID", 2, 2, 100.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 5.291005291005291, 1.9841269841269842, 2.1649718915343916], "isController": false}, {"data": ["PUT BUYER ORDER ID", 2, 2, 100.0, 443.0, 348, 538, 443.0, 538.0, 538.0, 538.0, 1.2507817385866167, 0.46904315196998125, 0.5643175422138836], "isController": false}, {"data": ["POST LOGIN BUYER", 2, 0, 0.0, 482.0, 475, 489, 482.0, 489.0, 489.0, 489.0, 1.1500862564692351, 0.6379384703852788, 0.5806587837837838], "isController": false}, {"data": ["GET BUYER PRODUCT ID", 2, 2, 100.0, 541.0, 467, 615, 541.0, 615.0, 615.0, 615.0, 0.999000999000999, 0.37462537462537465, 0.4077953296703297], "isController": false}, {"data": ["GET BUYER ORDER ID", 2, 2, 100.0, 884.5, 864, 905, 884.5, 905.0, 905.0, 905.0, 0.9276437847866419, 0.3478664192949907, 0.37685528756957326], "isController": false}, {"data": ["POST SELLER REGISTER", 2, 0, 0.0, 2486.5, 2283, 2690, 2486.5, 2690.0, 2690.0, 2690.0, 0.7396449704142012, 0.4377195821005917, 0.9303346893491123], "isController": false}, {"data": ["DELETE SELLER PRODUCT ID", 2, 2, 100.0, 359.0, 349, 369, 359.0, 369.0, 369.0, 369.0, 5.235602094240838, 1.963350785340314, 2.254785667539267], "isController": false}, {"data": ["POST SELLER LOGIN", 2, 0, 0.0, 422.0, 419, 425, 422.0, 425.0, 425.0, 425.0, 4.705882352941176, 2.610294117647059, 1.6176470588235294], "isController": false}, {"data": ["POST BUYER ORDER", 2, 2, 100.0, 754.0, 622, 886, 754.0, 886.0, 886.0, 886.0, 0.8261049153242462, 0.2573510429574556, 0.3888501652209831], "isController": false}, {"data": ["GET BUYER ORDER", 2, 0, 0.0, 644.5, 391, 898, 644.5, 898.0, 898.0, 898.0, 0.9136592051164916, 0.24625970762905436, 0.3613593535861124], "isController": false}, {"data": ["POST SELLER PRODUCT 2", 2, 2, 100.0, 1.5, 1, 2, 1.5, 2.0, 2.0, 2.0, 57.14285714285714, 142.85714285714283, 0.0], "isController": false}, {"data": ["GET BUYER PRODUCT", 2, 0, 0.0, 439.0, 370, 508, 439.0, 508.0, 508.0, 508.0, 1.1383039271485487, 0.8381651963574275, 0.5191288417757541], "isController": false}, {"data": ["POST SELLER PRODUCT", 2, 2, 100.0, 3.5, 2, 5, 3.5, 5.0, 5.0, 5.0, 250.0, 624.51171875, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 10, 62.5, 33.333333333333336], "isController": false}, {"data": ["500/Internal Server Error", 2, 12.5, 6.666666666666667], "isController": false}, {"data": ["Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\\\KERJA\\\\Belajar\\\\Binar Bootcamp\\\\praktikum\\\\Jmeter\\\\Final Project\\\\teh.png (The system cannot find the path specified)", 2, 12.5, 6.666666666666667], "isController": false}, {"data": ["Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\\\KERJA\\\\Belajar\\\\Binar Bootcamp\\\\praktikum\\\\Jmeter\\\\Final Project\\\\tapir.jpg (The system cannot find the path specified)", 2, 12.5, 6.666666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 16, "400/Bad Request", 10, "500/Internal Server Error", 2, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\\\KERJA\\\\Belajar\\\\Binar Bootcamp\\\\praktikum\\\\Jmeter\\\\Final Project\\\\teh.png (The system cannot find the path specified)", 2, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\\\KERJA\\\\Belajar\\\\Binar Bootcamp\\\\praktikum\\\\Jmeter\\\\Final Project\\\\tapir.jpg (The system cannot find the path specified)", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET SELLER PRODUCT ID", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT BUYER ORDER ID", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET BUYER PRODUCT ID", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET BUYER ORDER ID", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["DELETE SELLER PRODUCT ID", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST BUYER ORDER", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST SELLER PRODUCT 2", 2, 2, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\\\KERJA\\\\Belajar\\\\Binar Bootcamp\\\\praktikum\\\\Jmeter\\\\Final Project\\\\tapir.jpg (The system cannot find the path specified)", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST SELLER PRODUCT", 2, 2, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\\\KERJA\\\\Belajar\\\\Binar Bootcamp\\\\praktikum\\\\Jmeter\\\\Final Project\\\\teh.png (The system cannot find the path specified)", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
