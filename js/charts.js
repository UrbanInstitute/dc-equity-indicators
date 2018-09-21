var PCTFORMAT = d3.format(".0%");
var COMMAFORMAT = d3.format(",.0f");

var categories = ["yes", "no"];

var width = 600,
    height = 50,
    margin = {top: 0, right: 20, bottom: 40, left: 0};

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
    // makeBarChart("Ward 7", "Adults with a postsecondary degree", "baseBar", width, height);

});

// function updateChart(geo, indicator) {
//     updateBars(PHA, "raceChart");
// }

function getData(geo, indicator) {
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

function makeBarChart(geo, indicator, parentClass, chartID, width, height) {
    var chartData = getData(geo, indicator);

    var svg = d3.select("#" + chartID)
        .append("svg")
        // .attr("id", svgID)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawBars(svg, chartData, colorScaleMore);
    labelBars(parentClass, chartData);
}

function drawBars(svg, data, colorScale) {
    var slices = svg.selectAll(".serie")
        .data(stack.keys(categories)(data))
        .enter()
        .append("g")
        .attr("class", "serie")
        .attr("fill", function(d) { return colorScaleMore(d.key); });

    slices.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("class", "slice")
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("y", 0)
        .attr("height", height)
        .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); });
}

function labelBars(parentClass, data) {
    d3.select(parentClass + " div.equityNumber").text(PCTFORMAT(data[0].yes));
}