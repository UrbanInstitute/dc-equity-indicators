// make maps of DC wards and neighborhood clusters in both the base geo and comparison geo menus
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

    var selectorBoxClass = menuElementID === "#baseGeographyMenu" ? ".baseGeographySelector" : ".comparisonGeographySelector";

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
        .on("mouseover", function(d) { var selectedGeoClassname = mapClassName === ".dcWards" ? "ward_" + d.properties.WARD : "cluster_" + parseFloat(d.id);
                                       mouseoverGeography(menuElementID, selectedGeoClassname); })
        .on("mouseout", function() { mouseoutGeography(menuElementID); })
        .on("click", function(d) { selectGeography(menuElementID, selectorBoxClass, mapClassName === ".dcWards" ? "ward_" + d.properties.WARD : "cluster_" + parseFloat(d.id)); });

    // disable Clusters 42, 45 and 46 on the map because these clusters have small population sizes
    (mapClassName === ".dcClusters") && d3.selectAll(".dcClusters .cluster_42,.cluster_45,.cluster_46").classed("disabled", true);
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
    .on("mouseover", function() { d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem").classed("hovered", false);
                                  d3.select(this).classed("hovered", true); })
    .on("click", function() { d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem").classed("selected", false);
                              d3.select(this).classed("selected", true);
                              showSelectionInMenu("#equityIndicatorMenu", ".indicatorSelector"); });

d3.selectAll("#baseGeographyMenu .dcEquityIndicators.menuItem")
    .on("mouseover", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                                  mouseoverGeography("#baseGeographyMenu", selectedGeoClassname); })
    .on("mouseout", function() { mouseoutGeography("#baseGeographyMenu"); })
    .on("click", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                              selectGeography("#baseGeographyMenu", ".baseGeographySelector", selectedGeoClassname); });

d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem")
    .on("mouseover", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                                  mouseoverGeography("#comparisonGeographyMenu", selectedGeoClassname); })
    .on("mouseout", function() { mouseoutGeography("#comparisonGeographyMenu"); })
    .on("click", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                              selectGeography("#comparisonGeographyMenu", ".comparisonGeographySelector", selectedGeoClassname); });

function mouseoutGeography(menuElementID) {
    d3.selectAll(menuElementID + " .dcEquityIndicators.menuItem").classed("hovered", false);
    d3.selectAll(menuElementID + " .map .geography").classed("hovered", false);
}

function mouseoverGeography(menuElementID, selectedGeo) {
    mouseoutGeography(menuElementID);

    // don't allow mouseover state on selected or disabled geography
    if(!d3.select(menuElementID + " .dcEquityIndicators.menuItem." + selectedGeo).classed("selected") && !d3.select(menuElementID + " .dcEquityIndicators.menuItem." + selectedGeo).classed("disabled")) {
        d3.select(menuElementID + " .dcEquityIndicators.menuItem." + selectedGeo).classed("hovered", true);
        d3.select(menuElementID + " .map ." + selectedGeo).classed("hovered", true);
    }
}

function selectGeography(menuElementID, selectorBoxClass, selectedGeo) {
    // don't allow disabled geographies to be selected
    if(!d3.select(menuElementID + " .dcEquityIndicators.menuItem." + selectedGeo).classed("disabled")) {
        mouseoutGeography(menuElementID);
        d3.selectAll(menuElementID + " .dcEquityIndicators.menuItem").classed("selected", false);
        d3.selectAll(menuElementID + " .map .geography").classed("selected", false);

        d3.select(menuElementID + " .dcEquityIndicators.menuItem." + selectedGeo).classed("selected", true);
        d3.select(menuElementID + " .map ." + selectedGeo).classed("selected", true);

        showSelectionInMenu(menuElementID, selectorBoxClass);
    }
}

function showSelectionInMenu(menuElementID, selectorBoxClass) {
    var selectedItemName = d3.select(menuElementID + " .dcEquityIndicators.menuItem.selected").node().innerText;
    d3.select(selectorBoxClass + " .selectorBox").text(selectedItemName);
    closeMenu(menuElementID);

    // reset adjustment every time user makes a new menu selection
    adjustment = 0;

    var indicator = getIndicatorSelected();
    var baseGeo = getBaseGeography();
    var compareGeo = getComparisonGeography();

    console.log("Indicator:", indicator);
    console.log("Base geo:", baseGeo);
    console.log("Comparison geo:", compareGeo);

    // disable link in comparison geography selection modal so that users can't choose to compare a geography against itself
    d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem").classed("disabled", false);
    d3.selectAll("#comparisonGeographyMenu .map .geography").classed("disabled", false);
    d3.selectAll("#comparisonGeographyMenu .map .cluster_42,.cluster_45,.cluster_46").classed("disabled", true)
    var selectedBaseGeoClassname = d3.select("#baseGeographyMenu .dcEquityIndicators.menuItem.selected").attr("class").split(" ")[2];
    d3.select("#comparisonGeographyMenu .dcEquityIndicators.menuItem." + selectedBaseGeoClassname).classed("disabled", true);
    d3.select("#comparisonGeographyMenu .map ." + selectedBaseGeoClassname).classed("disabled", true);

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


// event handlers to listen to if the up/down arrows in the third bar chart are clicked
d3.select("#equityChart .withEquity .adjustTargetBtns .upArrowBtn")
    .on("click", function() { adjustment++; updateEquityBarChart("#equityChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography());});

d3.select("#equityChart .withEquity .adjustTargetBtns .downArrowBtn")
    .on("click", function() { adjustment--; updateEquityBarChart("#equityChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography());});





// event listeners to toggle between using a comparison geography and a custom target
d3.select(".comparisonToggle .switch")
    .on("click", function() { toggleMenu(); });

function toggleMenu() {
    d3.select(".toggleLabel.location").classed("selected", !d3.select(".toggleLabel.location").classed("selected"));
    d3.select(".toggleLabel.target").classed("selected", !d3.select(".toggleLabel.target").classed("selected"));
    adjustment = 0;  // reset adjustment factor on toggle

    if(d3.select(".toggleLabel.location").classed("selected")) {
        d3.select(".sliderButton").classed("off", false);
        d3.select(".comparisonGeographySelector").classed("hidden", false);
        d3.select(".customTargetTextbox").classed("hidden", true);
        d3.select("#equityChart .comparisonLocation").classed("noShow", false);
        customGoal = 0;
        updateEquityBarChart("#equityChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography());  // render bar chart with previous selected comparison geography when user toggles back to location comparison
    }
    else if(d3.select(".toggleLabel.target").classed("selected")) {
        d3.select(".sliderButton").classed("off", true);
        d3.select(".comparisonGeographySelector").classed("hidden", true);
        d3.select(".customTargetTextbox").classed("hidden", false);
        d3.select("#equityChart .comparisonLocation").classed("noShow", true);  // hide comparison location bar
        customGoal = 1;
    }
}

// event listeners to detect user-entered goal
d3.select("#customTarget")
    .on("input", function() { updateEquityBarChart("#equityChart", getIndicatorSelected(), getBaseGeography(), "customTarget"); adjustment = 0; });

// get selection values
function getIndicatorSelected() {
    return d3.select("#equityIndicatorMenu .dcEquityIndicators.menuItem.selected").text();
}

function getBaseGeography() {
    return d3.select("#baseGeographyMenu .dcEquityIndicators.menuItem.selected span.menuItemLink").text();
}

function getComparisonGeography() {
    var geo = d3.select("#comparisonGeographyMenu .dcEquityIndicators.menuItem.selected span.menuItemLink").text();
    if(geo == "DC") return "Washington, D.C.";
    else return geo;
}

function getUserGoal() {
    return +d3.select("#customTarget").node().value;
}