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
                              showSelectionInMenu("#equityIndicatorMenu", ".indicatorSelector", d3.select(this).node().innerText); });

d3.selectAll("#baseGeographyMenu .dcEquityIndicators.menuItem")
    .on("click", function() { d3.selectAll("#baseGeographyMenu .dcEquityIndicators.menuItem").classed("selected", false);
                              d3.select(this).classed("selected", true);
                              showSelectionInMenu("#baseGeographyMenu", ".baseGeographySelector", d3.select(this).node().innerText); });

d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem")
    .on("click", function() { d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem").classed("selected", false);
                              d3.select(this).classed("selected", true);
                              showSelectionInMenu("#comparisonGeographyMenu", ".comparisonGeographySelector", d3.select(this).node().innerText); });


function showSelectionInMenu(menuElementID, selectorBoxClass, selectedItemName) {
    d3.select(selectorBoxClass + " .selectorBox").text(selectedItemName);
    closeMenu(menuElementID);

    var indicator = getIndicatorSelected();
    var baseGeo = getBaseGeography();
    var compareGeo = getComparisonGeography();

    console.log("Indicator:", indicator);
    console.log("Base geo:", baseGeo);
    console.log("Comparison geo:", compareGeo);

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
