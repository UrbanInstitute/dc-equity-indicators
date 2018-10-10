var PCTFORMAT = d3.format(".0%");
var COMMAFORMAT = d3.format(",.0f");

var nonbinaryIndicators = ["Small-business lending per employee", "Violent crimes per 1,000 population", "Premature deaths per 1,000 population"];
// var positiveIndicators = [];
var negativeIndicators = ["Unemployment rate", "Households with a housing cost burden", "Violent crimes per 1,000 population", "Premature deaths per 1,000 population"];

var categories = ["yes", "diff", "no"];

var exampleChartDimensions = {width: 600, height: 34, margin: {top: 0, right: 25, bottom: 40, left: 10}};
var toolChartDimensions = {width: 760, height: 60, margin: {top: 0, right: 50, bottom: 65, left: 10}};

var xScale = d3.scaleLinear()
    .domain([0, 1]);

var colorScale = d3.scaleOrdinal()
    .domain(["yes", "no", "diff"])
    .range(["#1696d2", "#e3e3e3", "#fdbf11"]);

var colorScaleLess = d3.scaleOrdinal()
    .domain(["yes", "no", "diff"])
    .range(["#1696d2", "#e3e3e3", "#ec008b"]);

var stack = d3.stack();

var adjustment = 0; // to keep track of arrow clicks

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

    // render example chart
    makeEquityBarChart("#exampleEquityChart", "Adults with a postsecondary degree", "Ward 7", "Washington, D.C.", exampleChartDimensions);

    // initialize bottom chart as grey rectangles
    makeEquityBarChart("#equityChart", "Initial", "Initial", "Initial", toolChartDimensions);
});

function makeEquityBarChart(chartDivID, indicator, baseGeo, compareGeo, dimensions) {
    populateChartTitle(chartDivID, indicator);
    populateBarTitles(chartDivID, baseGeo, compareGeo);
    makeBarChart(chartDivID, ".baseLocation", "baseBar", baseGeo, indicator, dimensions);
    makeBarChart(chartDivID, ".comparisonLocation", "comparisonBar", compareGeo, indicator, dimensions);
    makeBarChart(chartDivID, ".withEquity", "withEquityBar", baseGeo + "|" + compareGeo, indicator, dimensions);
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

function makeBarChart(chartDivID, parentClass, chartID, geo, indicator, dimensions) {
    var chartData = getData(parentClass, geo, indicator);

    xScale.range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right]);

    var svg = d3.select(chartDivID + " ." + chartID)
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");

    drawBars(svg, chartData, colorScale, dimensions.height);
    labelBars(chartDivID, parentClass, chartData);

    // detect label collision - if labels are overlapping, make label for diff bar extend lower
    // (only apply this to binary indicators since non-binary ones only have one label)
    nonbinaryIndicators.indexOf(indicator) && adjustLabels(chartDivID, parentClass, indicator);

    if(parentClass === ".withEquity") {
        populateEquityStatement(chartDivID, indicator, chartData);
    }
}

function getData(parentClass, geo, indicator) {
    if(parentClass === ".withEquity") {
        var base = geo.split("|")[0];
        var compare = geo.split("|")[1];

        var baseData = equityData.filter(function(d) { return d.geo === base && d.indicator === indicator; });
        var compareData = equityData.filter(function(d) { return d.geo === compare && d.indicator === indicator; });

        var data;

        // non-binary indicators that we want more of
        if(indicator === "Small-business lending per employee") {
            // error handling - user cannot adjust target to be less than the base geo's value
            if(compareData[0].value + adjustment < baseData[0].value) {
                adjustment = baseData[0].value - compareData[0].value;
            }

            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            data = [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareData[0].geo,
                    yes: baseData[0].value,
                    diff: compareData[0].value - baseData[0].value + adjustment,
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
            // error handling - user cannot adjust target to be less than the comparison geo's value
            if(compareData[0].value + adjustment < 0) {
                adjustment = -compareData[0].value;
            }

            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            data = [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareData[0].geo,
                    yes: compareData[0].value + adjustment,
                    diff: baseData[0].value - (compareData[0].value + adjustment),
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
            // error handling - user cannot adjust target to be less than zero
            // if(compareData[0].value + adjustment/100 < 0) {
            //     adjustment = compareData[0].value/100;
            // }

            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            data = [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareData[0].geo,
                    yes: compareData[0].value,
                    diff: baseData[0].value - compareData[0].value + (adjustment/100),
                    no: 1 - baseData[0].value - (adjustment/100),
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
            data = [{
                indicator: baseData[0].indicator,
                geo: baseData[0].geo,
                compareGeo: compareData[0].geo,
                yes: baseData[0].value,
                diff: compareData[0].value - baseData[0].value + (adjustment/100),
                no: 1 - compareData[0].value - (adjustment/100),
                year: baseData[0].year,
                numerator: baseData[0].numerator,
                denom: baseData[0].denom,
                blue_bar_label: baseData[0].blue_bar_label,
                grey_bar_label: baseData[0].grey_bar_label,
                diff_bar_label: baseData[0].diff_bar_label
            }];
        }

        // if there's no equity gap, then set diff = 0 so d3 doesn't complain when trying to draw the bars (which will be hidden anyways)
        if(data[0].diff < 0) {
            data[0].diff = 0;
            if(nonbinaryIndicators.indexOf(indicator) === -1 && negativeIndicators.indexOf(indicator) > -1) {
                data[0].no = 1 - compareData[0].value;
            }
            else if(nonbinaryIndicators.indexOf(indicator) === -1 && negativeIndicators.indexOf(indicator) === -1) {
                data[0].no = 1 - baseData[0].value;
            }
        }

        return data;
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

function drawBars(svg, data, colorScale, barHeight) {

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
        .attr("height", barHeight)
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
        .attr("y1", barHeight)
        .attr("y2", barHeight + 4);

    // add in placeholder text elements for the labels - these will get filled in with labelBars()
    var labelTextGrp = slices.selectAll(".labelTextGrp")
        .data(function(d) { return d; })
        .enter()
        .append("g")
        .attr("class", "labelTextGrp");

    labelTextGrp.append("text")
        .attr("class", "barLabel line1")
        .attr("x", function(d) { return xScale(d[1]) - 1; })
        .attr("y", barHeight + 19)
        .text("test");

    labelTextGrp.append("text")
        .attr("class", "barLabel line2")
        .attr("x", function(d) { return xScale(d[1]) - 1; })
        .attr("y", barHeight + 33)
        .text("test");
}

function labelBars(chartDivID, parentClass, data) {
    var indicator = data[0].indicator;

    // labelling for non-binary indicators
    if(nonbinaryIndicators.indexOf(indicator) > -1 && negativeIndicators.indexOf(indicator) === -1) {
        d3.selectAll(chartDivID + " " + parentClass + " .barLabel").classed("hidden", true);

        if(parentClass === ".withEquity") {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(COMMAFORMAT(data[0].yes + data[0].diff));

            // need to clear the other labels so they don't throw off the collision calculations
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line1").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line2").text("");

            d3.selectAll(chartDivID + " " + parentClass + " g.diff .barLabel").classed("hidden", false);
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].diff));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(COMMAFORMAT(data[0].yes));
        }
    }
    // labelling for negative non-binary indicators
    else if(nonbinaryIndicators.indexOf(indicator) > -1 && negativeIndicators.indexOf(indicator) > -1) {
        d3.selectAll(chartDivID + " " + parentClass + " .barLabel").classed("hidden", true);

        if(parentClass === ".withEquity") {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(COMMAFORMAT(data[0].yes));

            // need to clear the other labels so they don't throw off the collision calculations
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line1").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line2").text("");

            d3.selectAll(chartDivID + " " + parentClass + " g.diff .barLabel").classed("hidden", false);
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].diff));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(COMMAFORMAT(data[0].yes));
        }
    }
    // labeling for negative binary indicators
    else if(nonbinaryIndicators.indexOf(indicator) === -1 && negativeIndicators.indexOf(indicator) > -1) {
        d3.selectAll(chartDivID + " " + parentClass + " .barLabel").classed("hidden", false);

        d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text(COMMAFORMAT(data[0].numerator));
        d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text(data[0].blue_bar_label);
        d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line1").text(COMMAFORMAT(data[0].denom));
        d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line2").text(data[0].grey_bar_label);

        if(parentClass === ".withEquity") {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes));

            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text(COMMAFORMAT(data[0].numerator));
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text(data[0].blue_bar_label);
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].denom * data[0].diff));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes));
        }
    }
    // labelling for positive binary indicators
    else {
        d3.selectAll(chartDivID + " " + parentClass + " .barLabel").classed("hidden", false);

        d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text(COMMAFORMAT(data[0].numerator));
        d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text(data[0].blue_bar_label);
        d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line1").text(COMMAFORMAT(data[0].denom));
        d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line2").text(data[0].grey_bar_label);

        if(parentClass === ".withEquity") {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes + data[0].diff));

            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].denom * data[0].diff));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes));
        }
    }
}

function adjustLabels(chartDivID, parentClass, indicator) {
    var yesLabelBoundingRect = d3.select(chartDivID + " " + parentClass + " .yes g.labelTextGrp").node().getBoundingClientRect();
    var noLabelBoundingRect = d3.select(chartDivID + " " + parentClass + " .no g.labelTextGrp").node().getBoundingClientRect();
    var diffLabelBoundingRect = (parentClass === ".withEquity") && d3.select(chartDivID + " " + parentClass + " .diff g.labelTextGrp").node().getBoundingClientRect();

    // console.log(chartDivID, parentClass);
    // console.log(yesLabelBoundingRect.x + yesLabelBoundingRect.width);
    // console.log(noLabelBoundingRect.x);
    // console.log(diffLabelBoundingRect);
    // console.log(diffLabelBoundingRect.width + diffLabelBoundingRect.x > noLabelBoundingRect.x);

    // if label for blue and grey bars overlap, adjust the text alignment of the labels
    if(yesLabelBoundingRect.x + yesLabelBoundingRect.width + 5 > noLabelBoundingRect.x) {
        d3.selectAll(chartDivID + " " + parentClass + " .yes text.barLabel").classed("rightJustified", true);
        d3.selectAll(chartDivID + " " + parentClass + " .no text.barLabel").classed("leftJustified", true);
    }
    else {
        d3.selectAll(chartDivID + " " + parentClass + " .yes text.barLabel").classed("rightJustified", false);
        d3.selectAll(chartDivID + " " + parentClass + " .no text.barLabel").classed("leftJustified", false);
    }

    // if label for yellow/pink bar overlaps either of the grey or blue labels, shift the label down
    if(diffLabelBoundingRect && (((negativeIndicators.indexOf(indicator) === -1) && (yesLabelBoundingRect.x + yesLabelBoundingRect.width > diffLabelBoundingRect.x)) || ((negativeIndicators.indexOf(indicator) > -1) && (diffLabelBoundingRect.x + diffLabelBoundingRect.width > yesLabelBoundingRect.x)) || (diffLabelBoundingRect.x + diffLabelBoundingRect.width > noLabelBoundingRect.x))) {
        // if yellow/pink bar label overlaps the blue label, right-justify the blue label for non-negative indicators
        if(yesLabelBoundingRect.x + yesLabelBoundingRect.width > diffLabelBoundingRect.x && negativeIndicators.indexOf(indicator) === -1) {
            d3.selectAll(chartDivID + " " + parentClass + " .yes text.barLabel").classed("rightJustified", true);
        }

        // if yellow/pink bar label overlaps the grey label, left-justify the grey label
        if(diffLabelBoundingRect.x + diffLabelBoundingRect.width > noLabelBoundingRect.x) {
            d3.selectAll(chartDivID + " " + parentClass + " .no text.barLabel").classed("leftJustified", true);
        }

        d3.select(chartDivID + " " + parentClass + " .diff line.barLabel")
            .transition()
            .attr("y2", toolChartDimensions.height + 34);

        d3.select(chartDivID + " " + parentClass + " .diff text.barLabel.line1")
            .transition()
            .attr("y", toolChartDimensions.height + 49);

        d3.select(chartDivID + " " + parentClass + " .diff text.barLabel.line2")
            .transition()
            .attr("y", toolChartDimensions.height + 63);
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

    // then transition bars
    var slices = d3.selectAll(chartDivID + " " + parentClass + " .serie")
        .data(stack.keys(categories)(data).filter(function(d) { return !isNaN(d[0][1]); }))
        .style("fill", function(d) { return colorScale(d.key); })
        .style("stroke", function(d) { return colorScale(d.key); });

    slices.selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); });

    // finally, adjust label positions based on type of indicator:
    // postive indicators will have all labels be at the end of the bar
    // negative binary indicators should have the blue label be positioned where the base geo's value is, the pink label should be at the start of the pink bar,
    //      and the grey label should be at the end
    // negative non-binary indicators only need to have a label for the pink bar at the start of the pink bar so can transition all of the labels
    //      to be at the start of the bars since the others will be hidden anyways
    if(negativeIndicators.indexOf(indicator) > -1 && parentClass === ".withEquity") {
        if(nonbinaryIndicators.indexOf(indicator) > -1) {
            slices.selectAll("line")
                .data(function(d) { return d; })
                // .transition()   collision detection doesn't work well with transitions
                .attr("x1", function(d) { return xScale(d[0]); })
                .attr("x2", function(d) { return xScale(d[0]); });

            slices.selectAll(".barLabel.line1")
                .data(function(d) { return d; })
                // .transition()
                .attr("x", function(d) { return xScale(d[0]); });

            slices.selectAll(".barLabel.line2")
                .data(function(d) { return d; })
                // .transition()
                .attr("x", function(d) { return xScale(d[0]); });
        }
        else {
            slices.selectAll("line")
                .data(function(d) { return d; })
                // .transition()
                .attr("x1", function(d) { if(d[0] === 0 ) { return xScale(d.data.yes + d.data.diff) - 1; }
                                          else if(d[1] === 1) { return xScale(d[1]) - 1; }
                                          else { return xScale(d[0]); } })
                .attr("x2", function(d) { if(d[0] === 0 ) { return xScale(d.data.yes + d.data.diff) - 1; }
                                          else if(d[1] === 1) { return xScale(d[1]) - 1; }
                                          else { return xScale(d[0]); } });

            slices.selectAll(".barLabel.line1")
                .data(function(d) { return d; })
                // .transition()
                .attr("x", function(d) { if(d[0] === 0 ) { return xScale(d.data.yes + d.data.diff) - 1; }
                                          else if(d[1] === 1) { return xScale(d[1]) - 1; }
                                          else { return xScale(d[0]); } });

            slices.selectAll(".barLabel.line2")
                .data(function(d) { return d; })
                // .transition()
                .attr("x", function(d) { if(d[0] === 0 ) { return xScale(d.data.yes + d.data.diff) - 1; }
                                          else if(d[1] === 1) { return xScale(d[1]) - 1; }
                                          else { return xScale(d[0]); } });
        }
    }
    else {
        slices.selectAll("line")
            .data(function(d) { return d; })
            // .transition()
            .attr("x1", function(d) { return xScale(d[1]) - 1; })
            .attr("x2", function(d) { return xScale(d[1]) - 1; });

        slices.selectAll(".barLabel.line1")
            .data(function(d) { return d; })
            // .transition()
            .attr("x", function(d) { return xScale(d[1]) - 1; });

        slices.selectAll(".barLabel.line2")
            .data(function(d) { return d; })
            // .transition()
            .attr("x", function(d) { return xScale(d[1]) - 1; });
            // .on("end", adjustLabels(chartDivID, parentClass) );
    }

    // reset height of labels and text-alignment so it doesn't throw off the collision detection calculations
    slices.selectAll("line")
        .attr("y2", toolChartDimensions.height + 4);

    slices.selectAll(".barLabel.line1")
        .attr("y", toolChartDimensions.height + 19)
        .classed("rightJustified", false)
        .classed("leftJustified", false);

    slices.selectAll(".barLabel.line2")
        .attr("y", toolChartDimensions.height + 33)
        .classed("rightJustified", false)
        .classed("leftJustified", false);

    // if there is no equity gap, hide the third bar chart
    if(parentClass === ".withEquity" && data[0].diff <=0) {
        d3.select(chartDivID + " .withEquity").classed("noEquityGap", true);
    }
    else {
        d3.select(chartDivID + " .withEquity").classed("noEquityGap", false);
    }

    // detect label collision - if labels are overlapping, make label for diff bar extend lower
    // (only do this for binary indicators since non-binary indicators only have 1 label)
    nonbinaryIndicators.indexOf(indicator) === -1 && adjustLabels(chartDivID, parentClass, indicator);

    if(parentClass === ".withEquity") {
        populateEquityStatement(chartDivID, indicator, data);
    }
}

function populateEquityStatement(chartDivID, indicator, data) {
    var diffNumber = data[0].diff * data[0].denom;
    // console.log(data);

    if(indicator === "Initial") {
        d3.select(chartDivID + " .equitySentence").text();
    }
    else if(data[0].diff <= 0) {
        d3.select(chartDivID + " .equitySentence").text(data[0].geo + " has no equity gap with " + data[0].compareGeo);
        d3.select(chartDivID + " .equitySentence").classed("noGap", true);
    }
    else {  // TODO: figure out how to bold first part of this sentence for all equity sentences
        d3.select(chartDivID + " .equitySentence").html("<span class='equitySentenceFirstPart'>" + COMMAFORMAT(diffNumber) + " more adults</span> in " + data[0].geo + " would need a postsecondary degree to close the equity gap with " + data[0].compareGeo);
        d3.select(chartDivID + " .equitySentence").classed("noGap", false);
    }
}

