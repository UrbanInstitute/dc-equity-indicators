var PCTFORMAT = d3.format(".0%");
var COMMAFORMAT = d3.format(",.0f");

var nonbinaryIndicators = ["Small-business lending per employee", "Violent crimes per 1,000 population", "Premature deaths per 1,000 population"];
// var positiveIndicators = [];
var negativeIndicators = ["Unemployment rate", "Households with a housing cost burden", "Violent crimes per 1,000 population", "Premature deaths per 1,000 population"];

var categories = ["yes", "diff", "no"];

var width = 600,
    height = 35,
    margin = {top: 0, right: 40, bottom: 40, left: 0};

var xScale = d3.scaleLinear()
    .domain([0, 1])
    .rangeRound([0, width]);

var colorScale = d3.scaleOrdinal()
    .domain(["yes", "no", "diff"])
    .range(["#1696d2", "#d2d2d2", "#fdbf11"]);

var colorScaleLess = d3.scaleOrdinal()
    .domain(["yes", "no", "diff"])
    .range(["#1696d2", "#d2d2d2", "#ec008b"]);

var stack = d3.stack();

var equityData;


d3.csv("data/equity_data.csv", function(d) {
    return {
        indicator: d.indicator,
        indicator_short: d.indicator,
        year: d.year,
        geo: d.geo,
        numerator: +d.numerator,
        denom: +d.denom,
        value: +d.value,
        blue_bar_label: d.blue_bar_label,
        diff_bar_label: d.diff_bar_label,
        grey_bar_label: d.grey_bar_label
    };
}, function(error, data) {

    if (error) throw error;

    equityData = data;

    makeEquityBarChart("#exampleEquityChart", "Adults with a postsecondary degree", "Ward 7", "Washington, D.C.");
    makeEquityBarChart("#equityChart", "Initial", "Initial", "Initial");
});

function makeEquityBarChart(chartDivID, indicator, baseGeo, compareGeo) {
    populateChartTitle(chartDivID, indicator);
    populateBarTitles(chartDivID, baseGeo, compareGeo);
    makeBarChart(chartDivID, ".baseLocation", "baseBar", baseGeo, indicator, width, height);
    makeBarChart(chartDivID, ".comparisonLocation", "comparisonBar", compareGeo, indicator, width, height);
    makeBarChart(chartDivID, ".withEquity", "withEquityBar", baseGeo + "|" + compareGeo, indicator, width, height);
}

function updateEquityBarChart(chartDivID, indicator, baseGeo, compareGeo) {
    populateChartTitle(chartDivID, indicator);
    populateBarTitles(chartDivID, baseGeo, compareGeo);
    updateBars(chartDivID, ".baseLocation", baseGeo, indicator);
    updateBars(chartDivID, ".comparisonLocation", compareGeo, indicator);
    updateBars(chartDivID, ".withEquity", baseGeo + "|" + compareGeo, indicator);
}

function populateChartTitle(chartDivID, title) {
    var year = equityData.filter(function(d) { return d.indicator === title})[0].year;
    d3.select(chartDivID + " h2.chartTitle").text(title + ", " + year);
}

function populateBarTitles(chartDivID, baseGeo, compareGeo) {
    d3.select(chartDivID + " h4.baseGeographyName").text(baseGeo);
    d3.select(chartDivID + " h4.comparisonGeographyName").text(compareGeo);
    d3.select(chartDivID + " span.baseGeographyName").text(baseGeo);
}

function makeBarChart(chartDivID, parentClass, chartID, geo, indicator, width, height) {
    var chartData = getData(parentClass, geo, indicator);

    var svg = d3.select(chartDivID + " ." + chartID)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawBars(svg, chartData, colorScale);
    labelBars(chartDivID, parentClass, chartData);

    if(parentClass === ".withEquity") {
        populateEquityStatement(chartDivID, chartData);
    }
}

function getData(parentClass, geo, indicator) {
    if(parentClass === ".withEquity") {
        var base = geo.split("|")[0];
        var compare = geo.split("|")[1];

        var baseData = equityData.filter(function(d) { return d.geo === base && d.indicator === indicator; });
        var compareData = equityData.filter(function(d) { return d.geo === compare && d.indicator === indicator; });

        // non-binary indicators that we want more of
        if(indicator === "Small-business lending per employee") {
            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            return [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareData[0].geo,
                    yes: baseData[0].value,
                    diff: compareData[0].value - baseData[0].value,
                    no: 0,
                    year: baseData[0].year,
                    numerator: "",
                    denom: "",
                    blue_bar_label: "",
                    grey_bar_label: "",
                    diff_bar_label: baseData[0].diff_bar_label
                }];
        }
        // non-binary indicators that we want less of
        else if(nonbinaryIndicators.indexOf(indicator) > -1 && negativeIndicators.indexOf(indicator) > -1) {
            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            return [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareData[0].geo,
                    yes: compareData[0].value,
                    diff: baseData[0].value - compareData[0].value,
                    no: 0,
                    year: baseData[0].year,
                    numerator: "",
                    denom: "",
                    blue_bar_label: "",
                    grey_bar_label: "",
                    diff_bar_label: baseData[0].diff_bar_label
                }];
        }
        // binary indicators that we want less of
        else if(nonbinaryIndicators.indexOf(indicator) === -1 && negativeIndicators.indexOf(indicator) > -1) {
            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            return [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareData[0].geo,
                    yes: compareData[0].value,
                    diff: baseData[0].value - compareData[0].value,
                    no: 1 - baseData[0].value,
                    year: baseData[0].year,
                    numerator: baseData[0].numerator,
                    denom: baseData[0].denom,
                    blue_bar_label: baseData[0].blue_bar_label,
                    grey_bar_label: baseData[0].grey_bar_label,
                    diff_bar_label: baseData[0].diff_bar_label
                }];
        }
        // binary indicators that we want more of
        else {
            return [{
                indicator: baseData[0].indicator,
                geo: baseData[0].geo,
                compareGeo: compareData[0].geo,
                yes: baseData[0].value,
                diff: compareData[0].value - baseData[0].value,
                no: 1 - compareData[0].value,
                year: baseData[0].year,
                numerator: baseData[0].numerator,
                denom: baseData[0].denom,
                blue_bar_label: baseData[0].blue_bar_label,
                grey_bar_label: baseData[0].grey_bar_label,
                diff_bar_label: baseData[0].diff_bar_label
            }];
        }
    }
    else {
        var data = equityData.filter(function(d) { return d.geo === geo && d.indicator === indicator; });

        // non-binary indicators
        if(nonbinaryIndicators.indexOf(indicator) > -1) {
            return [{
                indicator: data[0].indicator,
                geo: data[0].geo,
                yes: data[0].value,
                no: 0,
                year: data[0].year,
                numerator: "",
                denom: "",
                blue_bar_label: "",
                grey_bar_label: ""
            }];
        }
        // binary indicators
        else {
            return [{
                indicator: data[0].indicator,
                geo: data[0].geo,
                yes: data[0].value,
                no: 1 - data[0].value,
                year: data[0].year,
                numerator: data[0].numerator,
                denom: data[0].denom,
                blue_bar_label: data[0].blue_bar_label,
                grey_bar_label: data[0].grey_bar_label
            }];
        }
    }
}

function drawBars(svg, data, colorScale) {

    var slices = svg.selectAll(".serie")
        .data(stack.keys(categories)(data).filter(function(d) { return !isNaN(d[0][1]); }))
        .enter()
        .append("g")
        .attr("class", function(d) { return "serie " + d.key; })
        .style("fill", function(d) { return colorScale(d.key); })
        .style("stroke", function(d) { return colorScale(d.key); });

    slices.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("class", "slice")
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("y", 0)
        .attr("height", height)
        .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); })
        .style("stroke-width", 0);

    // add in labels for each segment
    slices.selectAll("line")
        .data(function(d) { return d; })
        .enter()
        .append("line")
        .attr("class", "barLabel")
        .attr("x1", function(d) { return xScale(d[1]) - 1; })
        .attr("x2", function(d) { return xScale(d[1]) - 1; })
        .attr("y1", height)
        .attr("y2", height + 5);

    slices.selectAll(".barLabel.line1")
        .data(function(d) { return d; })
        .enter()
        .append("text")
        .attr("class", "barLabel line1")
        .attr("x", function(d) { return xScale(d[1]) - 1; })
        .attr("y", height + 15)
        .text("test");

    slices.selectAll(".barLabel.line2")
        .data(function(d) { return d; })
        .enter()
        .append("text")
        .attr("class", "barLabel line2")
        .attr("x", function(d) { return xScale(d[1]) - 1; })
        .attr("y", height + 30)
        .text("test");
}

function labelBars(chartDivID, parentClass, data) {
    var indicator = data[0].indicator;

    // labelling for non-binary indicators
    if(nonbinaryIndicators.indexOf(indicator) > -1) {
        d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text("");
        d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text("");
        d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line1").text("");
        d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line2").text("");

        if(parentClass === ".withEquity") {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(COMMAFORMAT(data[0].yes + data[0].diff));

            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].diff));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(COMMAFORMAT(data[0].yes));
        }
    }
    // labelling for binary indicators
    else {
        d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text(COMMAFORMAT(data[0].numerator));
        d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text(data[0].blue_bar_label);
        d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line1").text(COMMAFORMAT(data[0].denom));
        d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line2").text(data[0].grey_bar_label);

        if(parentClass === ".withEquity") {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes + data[0].diff));

            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].numerator * data[0].diff));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes));
        }
    }
}

function updateBars(chartDivID, parentClass, geo, indicator) {
    var data = getData(parentClass, geo, indicator);

    // update scales
    if(negativeIndicators.indexOf(indicator) > -1) {
        colorScale.range(["#1696d2", "#d2d2d2", "#ec008b"]);
    }
    else {
        colorScale.range(["#1696d2", "#d2d2d2", "#fdbf11"]);
    }

    if(nonbinaryIndicators.indexOf(indicator) > -1) {
        xScale.domain([0, d3.max(equityData, function(d) { return d.indicator === indicator && d.value; })]);
    }
    else {
        xScale.domain([0, 1]);
    }

    // first update labels
    labelBars(chartDivID, parentClass, data);

    // then transition bars and label positions
    var slices = d3.selectAll(chartDivID + " " + parentClass + " .serie")
        .data(stack.keys(categories)(data).filter(function(d) { return !isNaN(d[0][1]); }))
        .style("fill", function(d) { return colorScale(d.key); })
        .style("stroke", function(d) { return colorScale(d.key); });

    slices.selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("y", 0)
        .attr("height", height)
        .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); })
        .style("stroke-width", 0);

    slices.selectAll("line")
        .data(function(d) { return d; })
        .transition()
        .attr("class", "barLabel")
        .attr("x1", function(d) { return xScale(d[1]) - 1; })
        .attr("x2", function(d) { return xScale(d[1]) - 1; })
        .attr("y1", height)
        .attr("y2", height + 5);

    slices.selectAll(".barLabel.line1")
        .data(function(d) { return d; })
        .transition()
        .attr("class", "barLabel line1")
        .attr("x", function(d) { return xScale(d[1]) - 1; })
        .attr("y", height + 15);

    slices.selectAll(".barLabel.line2")
        .data(function(d) { return d; })
        .transition()
        .attr("class", "barLabel line2")
        .attr("x", function(d) { return xScale(d[1]) - 1; })
        .attr("y", height + 30);

    populateEquityStatement(chartDivID, data);
}

function populateEquityStatement(chartDivID, data) {
    var diffNumber = data[0].diff * data[0].denom;

    // if() {
    //     d3.select(chartDivID + " .equitySentence").text(data[0].geo + " has no equity gap with " + data[0].compareGeo);
    // }
    // else {
    //     d3.select(chartDivID + " .equitySentence").text(COMMAFORMAT(diffNumber) + " more adults in " + data[0].geo + " would need a postsecondary degree to close the equity gap with " + data[0].compareGeo);
    // }
}