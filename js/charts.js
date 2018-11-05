// (function() {
var PCTFORMAT = d3.format(".0%");
var PCTFORMATONEDECIMAL = d3.format(".1%");
var COMMAFORMAT = d3.format(",.0f");
var DOLLARFORMAT = d3.format("$,.0f");

var nonbinaryIndicators = ["Small-business lending", "Violent crime", "Premature mortality"];
var negativeIndicators = ["Unemployment", "Housing cost burden", "Violent crime", "Premature mortality"];

var categories = ["yes", "diff", "no"];

var exampleChartDimensions = {height: 34, margin: {top: 0, right: 25, bottom: 40, left: 0}};
var toolChartDimensions = {height: 50, margin: {top: 0, right: 85, bottom: 65, left: 50}};

// set chart widths based on screen size
exampleChartDimensions.width = Math.min(getParentDivWidth("exampleEquityChart") - 70, 575);

if(getParentDivWidth("equityChart") >= 1150) {
    toolChartDimensions.width = 870;
}
else if(getParentDivWidth("equityChart") >= 1024 && getParentDivWidth("equityChart") < 1150) {
    toolChartDimensions.width = 770;
}
else if(getParentDivWidth("equityChart") >= 768 && getParentDivWidth("equityChart") < 1024) {
    toolChartDimensions.width = getParentDivWidth("equityChart") * 0.7;
}
else if(getParentDivWidth("equityChart") <= 767) {
    toolChartDimensions.width = getParentDivWidth("equityChart") * 0.95;
}


var xScale = d3.scaleLinear()
    .domain([0, 1]);

var colorScale = d3.scaleOrdinal()
    .domain(["yes", "no", "diff"])
    .range(["#1696d2", "#e3e3e3", "#fdbf11"]);

var colorScaleLess = d3.scaleOrdinal()
    .domain(["yes", "no", "diff"])
    .range(["#1696d2", "#e3e3e3", "#ec008b"]);

var stack = d3.stack();

var customGoal = 0; // to keep track of whether comparing geographies or using user-entered goal

var equityData;

var ieBlob; // for image download on IE


d3.csv("data/equity_data.csv", function(d) {
    return {
        indicator_full_name: d.indicator_full_name,
        indicator: d.indicator,
        year: d.year,
        geo: d.geo,
        numerator: +d.numerator,
        denom: +d.denom,
        value: +d.value,
        blue_bar_label: d.blue_bar_label,
        diff_bar_label: d.diff_bar_label,
        grey_bar_label: d.grey_bar_label,
        summary_sentence: d.summary_sentence,
        reverse_gap_sentence: d.reverse_gap_sentence
    };
}, function(error, data) {

    if (error) throw error;

    equityData = data;

    // render example chart
    makeEquityBarChart("#exampleEquityChart", "Postsecondary education", "Ward 7", "DC", exampleChartDimensions);

    // initialize bottom and image download charts as grey rectangles
    makeEquityBarChart("#equityChart", "Initial", "Initial", "Initial", toolChartDimensions);
    makeEquityBarChart("#downloadChart", "Initial", "Initial", "Initial", toolChartDimensions);
});

function makeEquityBarChart(chartDivID, indicator, baseGeo, compareGeo, dimensions) {
    populateChartTitle(chartDivID, indicator);
    populateBarTitles(chartDivID, baseGeo, compareGeo);
    makeBarChart(chartDivID, ".baseLocation", "baseBar", baseGeo, indicator, dimensions);
    makeBarChart(chartDivID, ".comparisonLocation", "comparisonBar", compareGeo, indicator, dimensions);
    makeBarChart(chartDivID, ".withEquity", "withEquityBar", baseGeo + "|" + compareGeo, indicator, dimensions);
    populateDescriptiveText(chartDivID, indicator);
}

function updateEquityBarChart(chartDivID, indicator, baseGeo, compareGeo) {
    // fade opacity of chart for 1 second while it transitions
    // code from: https://stackoverflow.com/questions/2510115/jquery-can-i-call-delay-between-addclass-and-such
    $("section.tool").addClass("sectionFade").delay(700).queue(function() {
        $(this).removeClass("sectionFade").dequeue();
        convertSvgToPng();  // also, update downloadable chart after bars have finished transitioning
    });

    populateChartTitle(chartDivID, indicator);
    populateBarTitles(chartDivID, baseGeo, compareGeo);
    updateBars(chartDivID, ".baseLocation", baseGeo, indicator);
    (compareGeo !== "customTarget") && updateBars(chartDivID, ".comparisonLocation", compareGeo, indicator);
    updateBars(chartDivID, ".withEquity", baseGeo + "|" + compareGeo, indicator);
    populateDescriptiveText(chartDivID, indicator);
}

function populateChartTitle(chartDivID, indicator) {
    var title = equityData.filter(function(d) { return d.indicator === indicator; })[0].indicator_full_name;
    var year = equityData.filter(function(d) { return d.indicator === indicator; })[0].year;
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

        var compareGeo = "Custom";
        var compareValue = (nonbinaryIndicators.indexOf(indicator) > -1) ? getUserGoal() : getUserGoal()/100;

        var baseData = equityData.filter(function(d) { return d.geo === base && d.indicator === indicator; });
        var compareData = equityData.filter(function(d) { return d.geo === compare && d.indicator === indicator; });

        if(customGoal === 0) {
            compareGeo = compareData[0].geo;
            compareValue = compareData[0].value;
        }

        var data;

        // non-binary indicators that we want more of
        if(indicator === "Small-business lending") {

            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            data = [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareGeo,
                    yes: baseData[0].value,
                    diff: compareValue - baseData[0].value,
                    no: 0,
                    year: baseData[0].year,
                    numerator: "",
                    denom: baseData[0].denom,
                    blue_bar_label: "",
                    grey_bar_label: "",
                    diff_bar_label: baseData[0].diff_bar_label,
                    sentence: baseData[0].summary_sentence
                    // reverse_gap_sentence: baseData[0].reverse_gap_sentence
                }];
        }
        // non-binary indicators that we want less of
        else if(nonbinaryIndicators.indexOf(indicator) > -1 && negativeIndicators.indexOf(indicator) > -1) {

            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            data = [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareGeo,
                    yes: compareValue,
                    diff: baseData[0].value - compareValue,
                    no: 0,
                    year: baseData[0].year,
                    numerator: "",
                    denom: baseData[0].denom,
                    blue_bar_label: "",
                    grey_bar_label: "",
                    diff_bar_label: baseData[0].diff_bar_label,
                    sentence: baseData[0].summary_sentence
                    // reverse_gap_sentence: baseData[0].reverse_gap_sentence
                }];
        }
        // binary indicators that we want less of
        else if(nonbinaryIndicators.indexOf(indicator) === -1 && negativeIndicators.indexOf(indicator) > -1) {

            // for indicators that we want less of, need to assign the length of the blue "yes" bar as the comparison geo's "yes" value
            data = [{
                    indicator: baseData[0].indicator,
                    geo: baseData[0].geo,
                    compareGeo: compareGeo,
                    yes: compareValue,
                    diff: baseData[0].value - compareValue,
                    no: 1 - baseData[0].value,
                    year: baseData[0].year,
                    numerator: baseData[0].numerator,
                    denom: baseData[0].denom,
                    blue_bar_label: baseData[0].blue_bar_label,
                    grey_bar_label: baseData[0].grey_bar_label,
                    diff_bar_label: baseData[0].diff_bar_label,
                    sentence: baseData[0].summary_sentence
                    // reverse_gap_sentence: baseData[0].reverse_gap_sentence
                }];
        }
        // binary indicators that we want more of
        else {

            data = [{
                indicator: baseData[0].indicator,
                geo: baseData[0].geo,
                compareGeo: compareGeo,
                yes: baseData[0].value,
                diff: compareValue - baseData[0].value,
                no: 1 - compareValue,
                year: baseData[0].year,
                numerator: baseData[0].numerator,
                denom: baseData[0].denom,
                blue_bar_label: baseData[0].blue_bar_label,
                grey_bar_label: baseData[0].grey_bar_label,
                diff_bar_label: baseData[0].diff_bar_label,
                sentence: baseData[0].summary_sentence
                // reverse_gap_sentence: baseData[0].reverse_gap_sentence
            }];
        }

        // if there's no equity gap, then set diff = 0 so d3 doesn't complain when trying to draw the bars (which will be hidden anyways)
        if(data[0].diff < 0) {
            data[0].actual_diff = data[0].diff;
            data[0].diff = 0;
            data[0].sentence = baseData[0].reverse_gap_sentence;
            if(nonbinaryIndicators.indexOf(indicator) === -1 && negativeIndicators.indexOf(indicator) > -1) {
                data[0].no = 1 - compareValue;
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
                blue_bar_label: data[0].blue_bar_label,
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

    // labelling for positive non-binary indicators
    if(nonbinaryIndicators.indexOf(indicator) > -1 && negativeIndicators.indexOf(indicator) === -1) {
        d3.selectAll(chartDivID + " " + parentClass + " .barLabel").classed("hidden", true);

        if(parentClass === ".withEquity") {
            // Gap = Focus area denominator * ( Target proportion - Focus proportion )
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(DOLLARFORMAT(data[0].yes + data[0].diff));

            // need to clear the other labels so they don't throw off the collision calculations
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line1").text("");
            d3.selectAll(chartDivID + " " + parentClass + " g.no text.barLabel.line2").text("");

            d3.selectAll(chartDivID + " " + parentClass + " g.diff .barLabel").classed("hidden", false);
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(DOLLARFORMAT(data[0].denom * data[0].diff));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(DOLLARFORMAT(data[0].yes));

            // label blue bars only
            d3.selectAll(chartDivID + " " + parentClass + " .yes .barLabel").classed("hidden", false);
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text(DOLLARFORMAT(data[0].yes));
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text(data[0].blue_bar_label);
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
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].denom * data[0].diff/1000));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(COMMAFORMAT(data[0].yes));

            // label blue bars only
            d3.selectAll(chartDivID + " " + parentClass + " .yes .barLabel").classed("hidden", false);
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text(COMMAFORMAT(data[0].yes));
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text(data[0].blue_bar_label);
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
            indicator === "Unemployment" ? d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMATONEDECIMAL(data[0].yes)) : d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes));

            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line1").text(COMMAFORMAT(data[0].numerator));
            d3.selectAll(chartDivID + " " + parentClass + " g.yes text.barLabel.line2").text(data[0].blue_bar_label);
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].denom * data[0].diff));
            d3.selectAll(chartDivID + " " + parentClass + " g.diff text.barLabel.line2").text(data[0].diff_bar_label);
        }
        else {
            indicator === "Unemployment" ? d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMATONEDECIMAL(data[0].yes)) : d3.select(chartDivID + " " + parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes));
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
    var blueRectBoundingRect = d3.select(chartDivID + " " + parentClass + " .yes rect").node().getBoundingClientRect();
    var yesLabelBoundingRect = d3.select(chartDivID + " " + parentClass + " .yes g.labelTextGrp").node().getBoundingClientRect();
    var noLabelBoundingRect = d3.select(chartDivID + " " + parentClass + " .no g.labelTextGrp").node().getBoundingClientRect();
    var diffLabelBoundingRect = (parentClass === ".withEquity") && d3.select(chartDivID + " " + parentClass + " .diff g.labelTextGrp").node().getBoundingClientRect();

    // console.log(chartDivID, parentClass);
    // console.log("Yes Label with width:", yesLabelBoundingRect.x + yesLabelBoundingRect.width);
    // console.log("No Label:", noLabelBoundingRect.x);
    // console.log(diffLabelBoundingRect);
    // console.log(diffLabelBoundingRect.width + diffLabelBoundingRect.x > noLabelBoundingRect.x);

    // if label for blue and grey bars overlap, adjust the text alignment of the labels
    if(yesLabelBoundingRect.right + 5 > noLabelBoundingRect.left) {
        d3.selectAll(chartDivID + " " + parentClass + " .yes text.barLabel").classed("rightJustified", true);
        d3.selectAll(chartDivID + " " + parentClass + " .no text.barLabel").classed("leftJustified", true);

        // check if labels are still overlapping - if so, move the one for the blue bar down
        var newYesLabelBoundingRect = d3.select(chartDivID + " " + parentClass + " .yes g.labelTextGrp").node().getBoundingClientRect();
        var newNoLabelBoundingRect = d3.select(chartDivID + " " + parentClass + " .no g.labelTextGrp").node().getBoundingClientRect();

        if(newYesLabelBoundingRect.right + 2 > newNoLabelBoundingRect.left) {
            d3.select(chartDivID + " " + parentClass + " .yes line.barLabel")
                // .transition()
                .attr("y2", toolChartDimensions.height + 34);

            d3.select(chartDivID + " " + parentClass + " .yes text.barLabel.line1")
                // .transition()
                .attr("y", toolChartDimensions.height + 49);

            d3.select(chartDivID + " " + parentClass + " .yes text.barLabel.line2")
                // .transition()
                .attr("y", toolChartDimensions.height + 63);
        }
    }
    else {
        d3.selectAll(chartDivID + " " + parentClass + " .yes text.barLabel").classed("rightJustified", false);
        d3.selectAll(chartDivID + " " + parentClass + " .no text.barLabel").classed("leftJustified", false);
    }

    // if blue or yellow/pink label too close to bar baseline, left-justify the label (and move blue one down if needed)
    if(yesLabelBoundingRect.left < blueRectBoundingRect.left) {
        d3.selectAll(chartDivID + " " + parentClass + " .yes text.barLabel").classed("leftJustified", true);
        yesLabelBoundingRect = d3.select(chartDivID + " " + parentClass + " .yes g.labelTextGrp").node().getBoundingClientRect();  // update position of blue bar label
    }

    // if label for yellow/pink bar overlaps either of the grey or blue labels, shift the label down
    if(diffLabelBoundingRect && (((negativeIndicators.indexOf(indicator) === -1) && (yesLabelBoundingRect.right > diffLabelBoundingRect.left)) || ((negativeIndicators.indexOf(indicator) > -1) && (diffLabelBoundingRect.right > yesLabelBoundingRect.left)) || (diffLabelBoundingRect.right > noLabelBoundingRect.left))) {
        // if yellow bar label overlaps the blue label, right-justify the blue label for non-negative indicators
        if(yesLabelBoundingRect.right > diffLabelBoundingRect.left && negativeIndicators.indexOf(indicator) === -1) {
            d3.selectAll(chartDivID + " " + parentClass + " .yes text.barLabel").classed("rightJustified", true);
        }

        // if pink bar label overlaps the blue label, left-justify the blue label for negative indicators
        if(diffLabelBoundingRect.right > yesLabelBoundingRect.left && negativeIndicators.indexOf(indicator) > -1) {
            d3.selectAll(chartDivID + " " + parentClass + " .yes text.barLabel").classed("leftJustified", true);
        }

        // if yellow/pink bar label overlaps the grey label, left-justify the grey label
        if(diffLabelBoundingRect.right > noLabelBoundingRect.left) {
            d3.selectAll(chartDivID + " " + parentClass + " .no text.barLabel").classed("leftJustified", true);
        }

        // if the blue label is left-justified (i.e., is near the bar baseline), move the blue label down beneath the yellow/pink label
        if(d3.select(chartDivID + " " + parentClass + " .yes text.barLabel.line1").classed("leftJustified")) {
            d3.select(chartDivID + " " + parentClass + " .yes line.barLabel")
                // .transition()
                .attr("y2", toolChartDimensions.height + 34);

            d3.select(chartDivID + " " + parentClass + " .yes text.barLabel.line1")
                // .transition()
                .attr("y", toolChartDimensions.height + 49);

            d3.select(chartDivID + " " + parentClass + " .yes text.barLabel.line2")
                // .transition()
                .attr("y", toolChartDimensions.height + 63);
        }
        // otherwise, move the yellow/pink label down
        else {
            d3.select(chartDivID + " " + parentClass + " .diff line.barLabel")
                // .transition()
                .attr("y2", toolChartDimensions.height + 34);

            d3.select(chartDivID + " " + parentClass + " .diff text.barLabel.line1")
                // .transition()
                .attr("y", toolChartDimensions.height + 49);

            d3.select(chartDivID + " " + parentClass + " .diff text.barLabel.line2")
                // .transition()
                .attr("y", toolChartDimensions.height + 63);
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

    // then transition bars
    var slices = d3.selectAll(chartDivID + " " + parentClass + " .serie")
        .data(stack.keys(categories)(data).filter(function(d) { return !isNaN(d[0][1]); }))
        .style("fill", function(d) { return colorScale(d.key); })
        .style("stroke", function(d) { return colorScale(d.key); });

    slices.selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .delay(300)
        .duration(500)
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

    // detect label collision - if labels are overlapping, make the diff label or the label on the left extend lower
    // (only do this for binary indicators since non-binary indicators only have 1 label)
    nonbinaryIndicators.indexOf(indicator) === -1 && adjustLabels(chartDivID, parentClass, indicator);

    if(parentClass === ".withEquity") {
        populateEquityStatement(chartDivID, indicator, data);
    }
}

function populateEquityStatement(chartDivID, indicator, data) {
    var diffNumber = COMMAFORMAT(data[0].diff * data[0].denom);
    if(indicator === "Small-business lending") {
        diffNumber = DOLLARFORMAT(data[0].denom * data[0].diff);
    }
    else if(nonbinaryIndicators.indexOf(indicator) > -1 && negativeIndicators.indexOf(indicator) > -1) {
        diffNumber = COMMAFORMAT(data[0].denom * data[0].diff / 1000);
    }

    // console.log(data);

    if(indicator === "Initial") {
        d3.select(chartDivID + " .equitySentence").text();
    }
    else if(customGoal === 1  && getUserGoal() >= 0) {
        // error handling to catch invalid user-entered goals
        if(nonbinaryIndicators.indexOf(indicator) === -1 && getUserGoal() > 100) {  // user can't enter > 100% for binary indicators
            d3.select(chartDivID + " .equitySentence").text("Invalid entry.");
            d3.select(chartDivID + " .equitySentence").classed("noGap", true);
            d3.select(chartDivID + " .withEquity").classed("noEquityGap", true);
        }
        else if(["Violent crime", "Premature mortality"].indexOf(indicator) > -1 && getUserGoal() > 1000) {  // user can't enter > 1000 b/c these are per 1,000
            d3.select(chartDivID + " .equitySentence").text("Invalid entry.");
            d3.select(chartDivID + " .equitySentence").classed("noGap", true);
            d3.select(chartDivID + " .withEquity").classed("noEquityGap", true);
        }
        else if(data[0].diff <= 0) {
            d3.select(chartDivID + " .equitySentence").text(addAnd(data[0].geo) + " has met or exceeded that goal.");
            d3.select(chartDivID + " .equitySentence").classed("noGap", true);
        }
        else {
            (indicator === "Violent crime") && d3.select(chartDivID + " .equitySentence").html("If this goal is met, <span class='highlight'>" + addAnd(data[0].geo) + " would have " + diffNumber + " fewer violent crimes.</span>");
            (indicator !== "Violent crime") && d3.select(chartDivID + " .equitySentence").html("If this goal is met, <span class='highlight'>" + diffNumber + " " + data[0].sentence + "</span>");
            d3.select(chartDivID + " .equitySentence").classed("noGap", false);
        }
    }
    else if(customGoal === 0) {
        // handle no gap or reverse-gap situation
        if(data[0].diff === 0) {
            if(nonbinaryIndicators.indexOf(indicator) > -1) {
                if(Math.abs(data[0].actual_diff) <= 1) {
                    d3.select(chartDivID + " .equitySentence").text(addAnd(data[0].geo) + " has no equity gap with " + addAnd(data[0].compareGeo) + ".");
                    d3.select(chartDivID + " .equitySentence").classed("noGap", true);
                }
                else if(data[0].actual_diff < -1) {
                    d3.select(chartDivID + " .equitySentence").text(data[0].sentence + " " + addAnd(data[0].compareGeo) + ".");
                    d3.select(chartDivID + " .equitySentence").classed("noGap", true);
                }
            }
            else if(nonbinaryIndicators.indexOf(indicator) === -1) {
                if(Math.abs(data[0].actual_diff) <= 0.005) {
                    d3.select(chartDivID + " .equitySentence").text(addAnd(data[0].geo) + " has no equity gap with " + addAnd(data[0].compareGeo) + ".");
                    d3.select(chartDivID + " .equitySentence").classed("noGap", true);
                }
                else if(data[0].actual_diff < -0.005) {
                    d3.select(chartDivID + " .equitySentence").text(data[0].sentence + " " + addAnd(data[0].compareGeo) + ".");
                    d3.select(chartDivID + " .equitySentence").classed("noGap", true);
                }
            }
        }
        // handle equity gap situation
        else {
            (indicator === "Violent crime") && d3.select(chartDivID + " .equitySentence").html("If we closed this equity gap, <span class='highlight'>" + addAnd(data[0].geo) + " would have " + diffNumber + " fewer violent crimes.</span>");
            (indicator !== "Violent crime") && d3.select(chartDivID + " .equitySentence").html("If we closed this equity gap, <span class='highlight'>" + diffNumber + " " + data[0].sentence + "</span>");
            d3.select(chartDivID + " .equitySentence").classed("noGap", false);
        }
    }
    else {
        d3.select(chartDivID + " .equitySentence").text("Invalid entry.");
        d3.select(chartDivID + " .equitySentence").classed("noGap", true);
        d3.select(chartDivID + " .withEquity").classed("noEquityGap", true);
    }
}

function populateDescriptiveText(chartDivID, indicator) {
    if(chartDivID === "#equityChart") {
        var full_name = equityData.filter(function(d) { return d.indicator === indicator; })[0].indicator_full_name;
        d3.select(".indicatorDescriptiveText").html(indicator_text[full_name]);
    }
}

function getParentDivWidth(elementId) {
    var width = document.getElementById(elementId).clientWidth;
    // console.log(width)
    return width;
}

function addAnd(geo) {
    var geoArray = geo.split(",");
    if(geoArray.length === 1) {
        return geo;
    }
    else if(geoArray.length === 2) {
        return geoArray[0] + " and " + geoArray[1];
    }
    else {
        return geoArray.slice(0, geoArray.length - 1).join(", ") + ", and " + geoArray[geoArray.length - 1];
    }
}

// function to save chart to png using saveSvgAsPng and html2canvas
// sources: https://codepedia.info/convert-html-to-image-in-jquery-div-or-table-to-jpg-png/, https://stackoverflow.com/questions/31656689/how-to-save-img-to-users-local-computer-using-html2canvas
function convertSvgToPng() {
    // first convert each bar svg into a png so we can use html2canvas to capture the entire area
    // (was having issues using html2canvas to convert the svg directly - didn't preserve fonts)
    // (instead, convert svg -> png -> write into saveImageDownload div -> use html2canvas)
    // saveSvgAsPng(d3.select("#equityChart .baseLocation .equityBar svg").node(), 'equity_chart.png', {canvg: canvg, backgroundColor: "#FFFFFF"});
    svgAsPngUri(d3.select("#equityChart .baseLocation .equityBar svg").node(), {canvg: canvg}, function(uri) {
        var baseBarImg = document.getElementById("baseBarPng");
        baseBarImg.src = uri;
    });

    svgAsPngUri(d3.select("#equityChart .comparisonLocation .equityBar svg").node(), {canvg: canvg}, function(uri) {
        var comparisonBarImg = document.getElementById("comparisonBarPng");
        comparisonBarImg.src = uri;
    });

    svgAsPngUri(d3.select("#equityChart .withEquity .equityBar svg").node(), {canvg: canvg}, function(uri) {
        var equityBarImg = document.getElementById("equityBarPng");
        equityBarImg.src = uri;

        // use html2canvas to save turn html into downloadable png after svgs rendered into png
        html2canvas(document.querySelector(".imageDownloadChart")).then(function(canvas) {
            // document.body.appendChild(canvas);
            // if on IE, save canvas to a blob so that it can be downloaded
            // (IE doesn't support download attribute for anchor tags)
            if(canvas.msToBlob) {
                ieBlob = canvas;
            }
            else {
                var imageData = canvas.toDataURL();
                var link = document.getElementById("saveImageLink");
                link.setAttribute("href", imageData);
            }
        });
    });
}

// event handler to trigger file download on IE since doesn't support download attribute on anchor tag
// source: https://stackoverflow.com/questions/37991846/png-file-not-downloading-in-internet-explorer-when-using-html2canvas-js-in-jquer
if(navigator.userAgent.indexOf("MSIE") !== -1 || navigator.userAgent.indexOf("Trident") !== -1) {
    d3.select(".saveImageBtn").on("click", function() {
        window.navigator.msSaveBlob(ieBlob, "equity_chart.png");
    });
}
// })();