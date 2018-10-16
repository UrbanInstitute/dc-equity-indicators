var raceChartDimensions = {width: 150, height: 80, margin: {top: 0, right: 40, bottom: 0, left: 130}};

var raceXScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, raceChartDimensions.width]);

var raceYScale = d3.scaleBand()
    .domain(["Other or multiple race", "Asian and Pacific Islander", "Latino", "Black", "White"])
    .range([raceChartDimensions.height, 0])
    .padding(0.1);

var raceData;

d3.csv("data/racial_demo_data.csv", function(d) {
    return {
        race: d.race,
        geo: d.geo,
        n: +d.n,
        total_population: +d.total_population,
        pct_population: +d.pct_population
    };

}, function(error, data) {

    if (error) throw error;

    raceData = data;

    // initialize charts
    makeRaceBarChart(".baseLocation", "Washington, D.C.");
    makeRaceBarChart(".comparisonLocation", "Washington, D.C.");
});

function makeRaceBarChart(parentDivClass, geo) {
    var data = getRaceData(geo);

    var svg = d3.select(parentDivClass + " .demoChart")
        .append("svg")
        .attr("width", raceChartDimensions.width + raceChartDimensions.margin.left + raceChartDimensions.margin.right)
        .attr("height", raceChartDimensions.height + raceChartDimensions.margin.top + raceChartDimensions.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + raceChartDimensions.margin.left + "," + raceChartDimensions.margin.top + ")");

    var raceBars = svg.selectAll(".raceBar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "raceBar")
        .attr("x", 0)
        .attr("y", function(d) { return raceYScale(d.race); })
        .attr("width", function(d) { return raceXScale(d.pct_population); })
        .attr("height", raceYScale.bandwidth());

    var raceLabels = svg.selectAll(".raceLabel")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "raceLabel")
        .attr("x", function(d) { return raceXScale(d.pct_population) + 4; })
        .attr("y", function(d) { return raceYScale(d.race) + raceYScale.bandwidth()/2; })
        .attr("dy", "0.35em")
        .text(function(d) { return PCTFORMAT(d.pct_population); });

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(raceYScale));

    populateTotalPopulation(parentDivClass, data[0].total_population);
};

function getRaceData(geo) {
    return raceData.filter(function(d) { return d.geo === geo; });
}

function populateTotalPopulation(parentDivClass, totalPopulationNumber) {
    d3.select(parentDivClass + " .totalPopulation").text(COMMAFORMAT(totalPopulationNumber));
}

function updateRaceBarChart(parentDivClass, geo) {
    var data = getRaceData(geo);

    d3.selectAll(parentDivClass + " .demoChart .raceBar")
        .data(data)
        .attr("width", function(d) { return raceXScale(d.pct_population); });

    d3.selectAll(parentDivClass + " .demoChart .raceLabel")
        .data(data)
        .attr("x", function(d) { return raceXScale(d.pct_population) + 4; })
        .text(function(d) { return PCTFORMAT(d.pct_population); });

    populateTotalPopulation(parentDivClass, data[0].total_population);
}

// show charts on click
d3.select(".baseLocation .viewDemoInfo")
    .on("click", function() { d3.select(".baseLocation .demoChart").classed("hidden", false); });

d3.select(".comparisonLocation .viewDemoInfo")
    .on("click", function() { d3.select(".comparisonLocation .demoChart").classed("hidden", false); });

// hide charts when clicking on close button
d3.select(".baseLocation .demoChart .closeButton")
    .on("click", function() { d3.select(".baseLocation .demoChart").classed("hidden", true); });

d3.select(".comparisonLocation .demoChart .closeButton")
    .on("click", function() { d3.select(".comparisonLocation .demoChart").classed("hidden", true); });