var PCTFORMAT = d3.format(".0%");
var COMMAFORMAT = d3.format(",.0f");

var categories = ["yes", "diff", "no"];

var width = 600,
    height = 35,
    margin = {top: 0, right: 40, bottom: 40, left: 0};

var xScale = d3.scaleLinear()
    .domain([0, 1])
    .rangeRound([0, width]);

var colorScaleMore = d3.scaleOrdinal()
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
        year: d.year,
        geo: d.geo,
        numerator: +d.numerator,
        denom: +d.denom,
        value: +d.value,
        unit: d.unit
    };
}, function(error, data) {

    if (error) throw error;

    equityData = data;

    // makeDropdown(data);
    makeBarChart("Ward 7", "Adults with a postsecondary degree", ".baseLocation", "baseBar", width, height);
    makeBarChart("Washington, D.C.", "Adults with a postsecondary degree", ".comparisonLocation", "comparisonBar", width, height);
    makeBarChart("Ward 7|Washington, D.C.", "Adults with a postsecondary degree", ".withEquity", "withEquityBar", width, height);

});

// function updateChart(geo, indicator) {
//     updateBars(PHA, "raceChart");
// }

function getData(geo, indicator, parentClass) {
    if(parentClass === ".withEquity") {
        var base = geo.split("|")[0];
        var compare = geo.split("|")[1];

        var baseData = equityData.filter(function(d) { return d.geo === base && d.indicator === indicator; });
        var compareData = equityData.filter(function(d) { return d.geo === compare && d.indicator === indicator; });

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
            unit: baseData[0].unit
        }];
    }
    else {
        var data = equityData.filter(function(d) { return d.geo === geo && d.indicator === indicator; });
        return [{
            indicator: data[0].indicator,
            geo: data[0].geo,
            yes: data[0].value,
            no: 1 - data[0].value,
            year: data[0].year,
            numerator: data[0].numerator,
            denom: data[0].denom,
            unit: data[0].unit
        }];
    }
}

function makeBarChart(geo, indicator, parentClass, chartID, width, height) {
    var chartData = getData(geo, indicator, parentClass);

    var svg = d3.select("#" + chartID)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawBars(svg, chartData, colorScaleMore);
    labelBars(parentClass, chartData);

    if(parentClass === ".withEquity") {
        populateEquityStatement(chartData);
    }
}

function drawBars(svg, data, colorScale) {
    var slices = svg.selectAll(".serie")
        .data(stack.keys(categories)(data).filter(function(d) {return !isNaN(d[0][1])}))
        .enter()
        .append("g")
        .attr("class", function(d) { return "serie " + d.key; })
        .style("fill", function(d) { return colorScaleMore(d.key); })
        .style("stroke", function(d) { return colorScaleMore(d.key); });

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

function labelBars(parentClass, data) {
    d3.selectAll(parentClass + " g.yes text.barLabel.line1").text(COMMAFORMAT(data[0].numerator));
    d3.selectAll(parentClass + " g.no text.barLabel.line1").text(COMMAFORMAT(data[0].denom));
    d3.selectAll(parentClass + " text.barLabel.line2").text(data[0].unit);

    if(parentClass === ".withEquity") {
        d3.select(parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes + data[0].diff));

        d3.selectAll(parentClass + " g.diff text.barLabel.line1").text(COMMAFORMAT(data[0].numerator * data[0].diff));
        d3.selectAll(parentClass + " g.diff text.barLabel.line2").text("more");
    }
    else {
        d3.select(parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes));
    }
}

function populateEquityStatement(data) {
    var diffNumber = data[0].diff * data[0].denom;

    // handle case where there is no equity gap

    // populate sentence if there is equity gap
    d3.select("#equitySentence span.diffNumber").text(COMMAFORMAT(diffNumber));
    d3.select("#equitySentence span.baseGeography").text(data[0].geo);
    d3.select("#equitySentence span.compareGeography").text(data[0].compareGeo);
}