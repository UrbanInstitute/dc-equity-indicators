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