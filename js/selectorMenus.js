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
        .on("click", function(d) { selectGeography(menuElementID, selectorBoxClass, mapClassName === ".dcWards" ? "ward_" + d.properties.WARD : "cluster_" + parseFloat(d.id));
                                   scrollMenuDivToTop();
                                   if(menuElementID === "#baseGeographyMenu") {
                                        updateRaceBarChart(".baseLocation", getBaseGeography());
                                        hideTooltip(".baseGeographySelector .selectorTooltip");
                                        showTooltip(".comparisonToggle .selectorTooltip");
                                        activateElement(".comparisonToggle");
                                        activateElement(".comparisonGeographySelector");
                                    }
                                    else if(menuElementID === "#comparisonGeographyMenu") {
                                          updateRaceBarChart(".comparisonLocation", getComparisonGeography());
                                          hideTooltip(".comparisonToggle .selectorTooltip");
                                    }});

    // disable Clusters 42, 45 and 46 on the map because these clusters have small population sizes
    (mapClassName === ".dcClusters") && d3.selectAll(".dcClusters .cluster_42,.cluster_45,.cluster_46").classed("disabled", true);
}

// event listeners to open and close menu modals
d3.select(".indicatorSelector .selectorItem")
    .on("click", function() { showMenu("#equityIndicatorMenu"); });

d3.select("#equityIndicatorMenu .closeButton")
    .on("click", function() { closeMenu("#equityIndicatorMenu"); });

d3.select(".baseGeographySelector .selectorItem")
    .on("click", function() { showMenu("#baseGeographyMenu"); });

d3.select("#baseGeographyMenu .closeButton")
    .on("click", function() { closeMenu("#baseGeographyMenu"); });

d3.select(".comparisonGeographySelector .selectorItem")
    .on("click", function() { showMenu("#comparisonGeographyMenu"); });

d3.select("#comparisonGeographyMenu .closeButton")
    .on("click", function() { closeMenu("#comparisonGeographyMenu"); });

// close menu modals using escape key
$(document).keyup(function(e) {
    if(e.key === "Escape") {
        d3.selectAll(".selectorMenuModal").classed("closed", true);
    }
})

function showMenu(menuElementID) {
    d3.select(menuElementID).classed("closed", false);
}

function closeMenu(menuElementID) {
    d3.select(menuElementID).classed("closed", true);
}


// event listeners to handle selection of indicator or geography via either list or map
d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem")
    .on("mouseenter", function() { d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem").classed("hovered", false);
                                  d3.select(this).classed("hovered", true); })
    .on("mouseout", function() { d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem").classed("hovered", false); })
    .on("click", function() { d3.selectAll("#equityIndicatorMenu .dcEquityIndicators.menuItem").classed("selected", false);
                              d3.select(this).classed("selected", true);
                              hideTooltip(".indicatorSelector .selectorTooltip");
                              showTooltip(".baseGeographySelector .selectorTooltip");
                              updatePlaceholderText();
                              scrollMenuDivToTop();
                              showSelectionInMenu("#equityIndicatorMenu", ".indicatorSelector");
                              activateElement(".baseGeographySelector"); });

d3.selectAll("#baseGeographyMenu .dcEquityIndicators.menuItem")
    .on("mouseenter", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                                  mouseoverGeography("#baseGeographyMenu", selectedGeoClassname); })
    .on("mouseout", function() { mouseoutGeography("#baseGeographyMenu"); })
    .on("click", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                              selectGeography("#baseGeographyMenu", ".baseGeographySelector", selectedGeoClassname);
                              updateRaceBarChart(".baseLocation", getBaseGeography());
                              hideTooltip(".baseGeographySelector .selectorTooltip");
                              showTooltip(".comparisonToggle .selectorTooltip");
                              activateElement(".comparisonToggle");
                              activateElement(".comparisonGeographySelector");
                              scrollMenuDivToTop(); });

d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem")
    .on("mouseenter", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                                  mouseoverGeography("#comparisonGeographyMenu", selectedGeoClassname); })
    .on("mouseout", function() { mouseoutGeography("#comparisonGeographyMenu"); })
    .on("click", function() { var selectedGeoClassname = d3.select(this).attr("class").split(" ")[2];
                              selectGeography("#comparisonGeographyMenu", ".comparisonGeographySelector", selectedGeoClassname);
                              updateRaceBarChart(".comparisonLocation", getComparisonGeography());
                              hideTooltip(".comparisonToggle .selectorTooltip");
                              scrollMenuDivToTop(); });

function scrollMenuDivToTop() {
    if(screen.width >= 768) {
        var position = $(".toolDropdownSelector").offset().top - 50;
        $("html, body").animate({ scrollTop: position}, 500);
    }
}

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

    if(!d3.select(".baseGeographySelector").classed("inactive")) {
        var indicator = getIndicatorSelected();
        var baseGeo = getBaseGeography();
        var compareGeo = getComparisonGeography();

        console.log("Indicator:", indicator);
        console.log("Base geo:", baseGeo);
        console.log("Comparison geo:", compareGeo);

        d3.selectAll("#baseGeographyMenu .dcEquityIndicators.menuItem").classed("disabled", false);
        d3.selectAll("#baseGeographyMenu .map .geography").classed("disabled", false);
        d3.selectAll("#comparisonGeographyMenu .dcEquityIndicators.menuItem").classed("disabled", false);
        d3.selectAll("#comparisonGeographyMenu .map .geography").classed("disabled", false);

        // disable Clusters 40 and 43 if indicator is prenatal care and disable clusters 41, 43 and 44 if indicator is affordable housing
        // due to small sample sizes
        if(indicator === "Prenatal care") {
            d3.selectAll("#baseGeographyMenu .cluster_40,.cluster_43").classed("disabled", true);
            d3.selectAll("#baseGeographyMenu .map .cluster_40,.cluster_43").classed("disabled", true);
            d3.selectAll("#comparisonGeographyMenu .cluster_40,.cluster_43").classed("disabled", true);
            d3.selectAll("#comparisonGeographyMenu .map .cluster_40,.cluster_43").classed("disabled", true);
        }
        if(indicator === "Affordable home sales") {
            d3.selectAll("#baseGeographyMenu .cluster_40,.cluster_41,.cluster_43,.cluster_44").classed("disabled", true);
            d3.selectAll("#baseGeographyMenu .map .cluster_40,.cluster_41,.cluster_43,.cluster_44").classed("disabled", true);
            d3.selectAll("#comparisonGeographyMenu .cluster_40,.cluster_41,.cluster_43,.cluster_44").classed("disabled", true);
            d3.selectAll("#comparisonGeographyMenu .map .cluster_40,.cluster_41,.cluster_43,.cluster_44").classed("disabled", true);
        }

        // disable link in comparison geography selection modal so that users can't choose to compare a geography against itself
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
        updateEquityBarChart("#equityChart", indicator, baseGeo, compareGeo);
        updateEquityBarChart("#downloadChart", indicator, baseGeo, compareGeo);
    }
}


// event handlers to listen to if the up/down arrows in the third bar chart are clicked
d3.select("#equityChart .withEquity .adjustTargetBtns .upArrowBtn")
    .on("click", function() { d3.select("#customTarget").node().value = getUserGoal() + 1;
                              updateEquityBarChart("#equityChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography());
                              updateEquityBarChart("#downloadChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography()); });

d3.select("#equityChart .withEquity .adjustTargetBtns .downArrowBtn")
    .on("click", function() { d3.select("#customTarget").node().value = getUserGoal() - 1;
                              updateEquityBarChart("#equityChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography());
                              updateEquityBarChart("#downloadChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography());});





// event listeners to toggle between using a comparison geography and a custom target
d3.select(".comparisonToggle .switch")
    .on("click", function() { toggleMenu(); });

function toggleMenu() {
    // hide tooltip
    hideTooltip(".comparisonToggle .selectorTooltip");
    d3.select(".toggleLabel.location").classed("selected", !d3.select(".toggleLabel.location").classed("selected"));
    d3.select(".toggleLabel.target").classed("selected", !d3.select(".toggleLabel.target").classed("selected"));

    if(d3.select(".toggleLabel.location").classed("selected")) {
        d3.select(".sliderButton").classed("off", false);
        d3.select(".adjustTargetBtns").classed("hidden", true);
        d3.select(".comparisonGeographySelector").classed("hidden", false);
        d3.select(".customTargetTextbox").classed("hidden", true);
        d3.select("#equityChart .comparisonLocation").classed("noShow", false);
        d3.select("#downloadChart .comparisonLocation").classed("noShow", false);
        customGoal = 0;
        updateEquityBarChart("#equityChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography());  // render bar chart with previous selected comparison geography when user toggles back to location comparison
        updateEquityBarChart("#downloadChart", getIndicatorSelected(), getBaseGeography(), getComparisonGeography());
    }
    else if(d3.select(".toggleLabel.target").classed("selected")) {
        d3.select(".sliderButton").classed("off", true);
        d3.select(".adjustTargetBtns").classed("hidden", false);
        d3.select(".comparisonGeographySelector").classed("hidden", true);
        d3.select(".customTargetTextbox").classed("hidden", false);
        d3.select("#equityChart .comparisonLocation").classed("noShow", true);  // hide comparison location bar
        d3.select("#downloadChart .comparisonLocation").classed("noShow", true);
        customGoal = 1;
        initializeCustomTargetValue();
    }
}

function updatePlaceholderText() {
    var currentIndicator = getIndicatorSelected();

    if(currentIndicator === "Small-business lending") {
        d3.select("#customTarget").node().placeholder = "Enter a dollar value";
    }
    else if(["Violent crime", "Premature mortality"].indexOf(currentIndicator) > -1) {
        d3.select("#customTarget").node().placeholder = "Enter a number";
    }
    else {
        d3.select("#customTarget").node().placeholder = "Enter a percentage";
    }
}

// set default user-entered goal to be equal to base geo's value
function initializeCustomTargetValue() {
    var NODECIMALFORMAT = d3.format(".0f");  // can't display commas in the input box
    var indicator = getIndicatorSelected();
    var data = equityData.filter(function(d) { return d.geo === getComparisonGeography() && d.indicator === indicator; });
    d3.select("#customTarget").node().value = nonbinaryIndicators.indexOf(indicator) > -1 ? NODECIMALFORMAT(data[0].value) : NODECIMALFORMAT(data[0].value*100);
}


// event listeners to detect user-entered goal
d3.select("#customTarget")
    .on("input", function() { if(d3.select("#customTarget").node().value !== "") {
                                updateEquityBarChart("#equityChart", getIndicatorSelected(), getBaseGeography(), "customTarget");
                                updateEquityBarChart("#downloadChart", getIndicatorSelected(), getBaseGeography(), "customTarget"); }});


// event listeners to handle initial tooltip popups and making the selector menus active
d3.select(".indicatorSelector .selectorTooltip button.closeButton")
    .on("click", function() { hideTooltip(".indicatorSelector .selectorTooltip"); });

d3.select(".baseGeographySelector .selectorTooltip button.closeButton")
    .on("click", function() { hideTooltip(".baseGeographySelector .selectorTooltip"); });

d3.select(".comparisonToggle .selectorTooltip button.closeButton")
    .on("click", function() { hideTooltip(".comparisonToggle .selectorTooltip"); });



// function to make selector menus section stick to top of viewport (since IE doesn't support position: sticky) if browser more than 768px wide
if ($(window).width() >= 768) {
    $(function() {
        var toolDropdownSelectorTop = $(".toolDropdownSelector")[0].getBoundingClientRect().top + $(window).scrollTop(); //get the offset top of the element

        $(window).scroll(function() { //when window is scrolled
            // console.log($(window).scrollTop() - toolDropdownSelectorTop);
            // console.log("Main bottom:", toolDropdownSelectorTop);
            if(($(window).scrollTop() - toolDropdownSelectorTop >= 40)) {
                $('.toolDropdownSelector').addClass("sticky");
                $('.tool').addClass("moreMarginTop");
            }
            else {
                $('.toolDropdownSelector').removeClass("sticky unstick");
                $('.tool').removeClass("moreMarginTop");
            }

            if($(".main")[0].getBoundingClientRect().bottom < 180) {
                $('.toolDropdownSelector').removeClass("sticky");
                $('.toolDropdownSelector').addClass("unstick");
                $('.tool').removeClass("moreMarginTop");
            }
        });
    });
}

function activateElement(classname) {
    d3.select(classname).classed("inactive", false);
}

function hideTooltip(classname) {
    // get rid of tooltip after the user has made selections for the first time
    d3.select(classname).classed("noShow", true);
}

function showTooltip(classname) {
    d3.select(classname).classed("hidden", false);
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
    if(geo == "Washington, DC") return "DC";
    else return geo;
}

function getUserGoal() {
    return +d3.select("#customTarget").node().value;
}