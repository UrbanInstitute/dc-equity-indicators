// event listeners to open and close menu modals
d3.select(".indicatorSelector .selectorButton")
    .on("click", function() { showMenu("#equityIndicatorMenu"); });

d3.select("#equityIndicatorMenu .closeButton")
    .on("click", function() { closeMenu("#equityIndicatorMenu"); });

d3.select(".baseGeographySelector .selectorButton")
    .on("click", function() { showMenu("#baseGeographyMenu"); });

d3.select("#baseGeographyMenu .closeButton")
    .on("click", function() { closeMenu("#baseGeographyMenu"); });


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

function showSelectionInMenu(menuElementID, selectorBoxClass, selectedItemName) {
    d3.select(selectorBoxClass + " .selectorBox").text(selectedItemName);
    closeMenu(menuElementID);

    var indicator = getIndicatorSelected();
    var baseGeo = getBaseGeography();
    // only show graph if an indicator and a base geography have been selected
    indicator !== "Select an indicator" && baseGeo!== "Select a location" && d3.select("#equityChart").classed("initialize", false);
    baseGeo !== "Select a location" && updateEquityBarChart("#equityChart", indicator, baseGeo, "Washington, D.C.");
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
