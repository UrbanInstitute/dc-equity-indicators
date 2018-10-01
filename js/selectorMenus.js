// event listeners to open and close menu modals
d3.select(".indicatorSelector .selectorButton")
    .on("click", function() { showMenu("equityIndicatorMenu"); });

d3.select("#equityIndicatorMenu .closeButton")
    .on("click", function() { closeMenu("equityIndicatorMenu"); });

function showMenu(menuElementID) {
    d3.select("#" + menuElementID).classed("closed", false);
}

function closeMenu(menuElementID) {
    d3.select("#" + menuElementID).classed("closed", true);
}


// event listeners to handle selection of indicator or geography
d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem")
    .on("click", function() { console.log(d3.select(this).node().innerText); });