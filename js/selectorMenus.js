d3.json("data/wards_topo.json", function(error, json) {

    var width = 350,
        height = 350;

    makeMap("#baseGeographyMenu", ".dcWards", width, height, json);
    makeMap("#comparisonGeographyMenu", ".dcWards", width, height, json);
});

d3.json("data/clusters_topo.json", function(error, json) {
    var width = 350,
        height = 350;

    makeMap("#baseGeographyMenu", ".dcClusters", width, height, json);
    makeMap("#comparisonGeographyMenu", ".dcClusters", width, height, json);
})

function makeMap(menuElementID, mapClassName, width, height, data){

    // topojsons are already projected using this projection:
    // var projection = d3.geoConicConformal()
    //     .rotate([77, 0])
    //     .center([0, 37.66])
    //     .parallels([38.3, 39.45]);

    var path = d3.geoPath()
        .projection(null);

    var svg = d3.select(menuElementID + " div" + mapClassName + ".map")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g");

    svg.selectAll("path")
        .data(topojson.feature(data, data.objects.tracts).features)
        .enter()
        .append("path")
        .attr("class", function(d) { return mapClassName === ".dcWards" ? "geography ward_" + d.properties.WARD : "geography cluster_" + parseFloat(d.id); })
        .attr("d", path)
        .on("click", function(d) { selectGeography(menuElementID, mapClassName === ".dcWards" ? "ward_" + d.properties.WARD : "cluster_" + parseFloat(d.id));
                                   showSelectionInMenu(menuElementID, menuElementID === "#baseGeographyMenu" ? ".baseGeographySelector" : ".comparisonGeographySelector"); });
        // .on("mouseover", function(d) { })
        // .on("mouseout", function(d) {});
}

// event listeners to open and close menu modals
d3.select(".indicatorSelector .selectorButton")
    .on("click", function() { showMenu("#equityIndicatorMenu"); });

d3.select("#equityIndicatorMenu .closeButton")
    .on("click", function() { closeMenu("#equityIndicatorMenu"); });

d3.select(".baseGeographySelector .selectorButton")
    .on("click", function() { showMenu("#baseGeographyMenu"); });

d3.select("#baseGeographyMenu .closeButton")
    .on("click", function() { closeMenu("#baseGeographyMenu"); });

d3.select(".comparisonGeographySelector .selectorButton")
    .on("click", function() { showMenu("#comparisonGeographyMenu"); });

d3.select("#comparisonGeographyMenu .closeButton")
    .on("click", function() { closeMenu("#comparisonGeographyMenu"); });

function showMenu(menuElementID) {
    d3.select(menuElementID).classed("closed", false);
}

function closeMenu(menuElementID) {
    d3.select(menuElementID).classed("closed", true);
}


// event listeners to handle selection of indicator or geography
d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem")
    .on("click", function() { d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem").classed("selected", false);
                              d3.select(this).classed("selected", true);
                              showSelectionInMenu("#equityIndicatorMenu", ".indicatorSelector"); });

d3.selectAll("#baseGeographyMenu .dcEquityIndicators.menuItem")
    // .on("mouseover", function() {})
    .on("click", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                              selectGeography("#baseGeographyMenu", selectedGeoClassname);
                              showSelectionInMenu("#baseGeographyMenu", ".baseGeographySelector"); });

d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem")
    .on("click", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                              selectGeography("#comparisonGeographyMenu", selectedGeoClassname);
                              showSelectionInMenu("#comparisonGeographyMenu", ".comparisonGeographySelector"); });

function selectGeography(menuElementID, selectedGeo) {
    d3.selectAll(menuElementID + " .dcEquityIndicators.menuItem").classed("selected", false);
    d3.selectAll(menuElementID + " .map .geography").classed("selected", false);

    d3.select(menuElementID + " .dcEquityIndicators.menuItem." + selectedGeo).classed("selected", true);
    d3.select(menuElementID + " .map ." + selectedGeo).classed("selected", true);
}

function showSelectionInMenu(menuElementID, selectorBoxClass) {
    var selectedItemName = d3.select(menuElementID + " .dcEquityIndicators.menuItem.selected").node().innerText;
    d3.select(selectorBoxClass + " .selectorBox").text(selectedItemName);
    closeMenu(menuElementID);

    var indicator = getIndicatorSelected();
    var baseGeo = getBaseGeography();
    var compareGeo = getComparisonGeography();

    console.log("Indicator:", indicator);
    console.log("Base geo:", baseGeo);
    console.log("Comparison geo:", compareGeo);

    // disable link in comparison geography selection modal so that users can't choose to compare a geography against itself
    d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem").classed("disabled", false);
    var selectedBaseGeoClassname = d3.select("#baseGeographyMenu .dcEquityIndicators.menuItem.selected").attr("class").split(" ")[2];
    d3.select("#comparisonGeographyMenu .dcEquityIndicators.menuItem." + selectedBaseGeoClassname).classed("disabled", true);

    // disable link in base geography selection modal so that users can't choose to compare a geography against itself
    // d3.selectAll("#baseGeographyMenu .dcEquityIndicators.menuItem").classed("disabled", false);
    // var selectedCompareGeoClassname = d3.select("#comparisonGeographyMenu .dcEquityIndicators.menuItem.selected").attr("class").split(" ")[2];
    // d3.select("#baseGeographyMenu .dcEquityIndicators.menuItem." + selectedCompareGeoClassname).classed("disabled", true);

    // if user selects same base geo as the comparison geo, force the user to select a new comparison geo
    // if(baseGeo === compareGeo) {
    //     d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem").classed("selected", false);
    //     d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem").classed("disabled", false);

    //     d3.select(".comparisonGeographySelector .selectorBox").text("Select a location");
    //     updateEquityBarChart("#equityChart", "Initial", baseGeo, "Initial");
    // }

    // only show graph once an indicator and a base geography have been selected
    indicator !== "Select an indicator" && baseGeo !== "Select a location" && d3.select("#equityChart").classed("initialize", false);
    indicator !== "Select an indicator" && baseGeo !== "Select a location" && updateEquityBarChart("#equityChart", indicator, baseGeo, compareGeo);
}


// event listeners to toggle between using a comparison geography and a custom target
d3.select(".comparisonToggle .switch")
    .on("click", function() { toggleMenu(); });

function toggleMenu() {
    d3.select(".toggleLabel.location").classed("selected", !d3.select(".toggleLabel.location").classed("selected"));
    d3.select(".toggleLabel.target").classed("selected", !d3.select(".toggleLabel.target").classed("selected"));

    if(d3.select(".toggleLabel.location").classed("selected")) {
        d3.select(".sliderButton").classed("off", false);
        d3.select(".comparisonGeographySelector").classed("hidden", false);
        d3.select(".customTargetTextbox").classed("hidden", true);
    }
    else if(d3.select(".toggleLabel.target").classed("selected")) {
        d3.select(".sliderButton").classed("off", true);
        d3.select(".comparisonGeographySelector").classed("hidden", true);
        d3.select(".customTargetTextbox").classed("hidden", false);
    }
}


// get selection values
function getIndicatorSelected() {
    return d3.select("#equityIndicatorMenu .dcEquityIndicators.menuItem.selected").text();
}

function getBaseGeography() {
    return d3.select("#baseGeographyMenu .dcEquityIndicators.menuItem.selected span.menuItemLink").text();
}

function getComparisonGeography() {
    var geo = d3.select("#comparisonGeographyMenu .dcEquityIndicators.menuItem.selected span.menuItemLink").text();
    if(geo == "All of Washington, DC") return "Washington, D.C.";
    else return geo;
}
