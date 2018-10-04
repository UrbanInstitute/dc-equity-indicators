// event listeners to open and close menu modals
d3.select(".indicatorSelector .selectorButton")
    .on("click", function() { showMenu("#equityIndicatorMenu"); });

d3.select("#equityIndicatorMenu .closeButton")
    .on("click", function() { closeMenu("#equityIndicatorMenu"); });

function showMenu(menuElementID) {
    d3.select(menuElementID).classed("closed", false);
}

function closeMenu(menuElementID) {
    d3.select(menuElementID).classed("closed", true);
}


// event listeners to handle selection of indicator or geography
d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem")
    .on("click", function() { showSelectionInMenu(d3.select(this).node().innerText); });


function showSelectionInMenu(selectedItemName) {
    d3.select(".indicatorSelector .selectorBox").text(selectedItemName);
    closeMenu("#equityIndicatorMenu");
    updateEquityBarChart("#equityChart", selectedItemName, "Ward 7", "Washington, D.C.");
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