			// Browser detection to add css class
			function BrowserDetection() {
				//Check if browser is IE or not
				if (navigator.userAgent.search("MSIE") >= 0) {
					$("#ub-container").addClass("ie");
				}
				//Check if browser is IE 11
				else if (!!navigator.userAgent.match(/Trident\/7\./)) {
					$("#ub-container").addClass("ie11");
				}
				//Check if browser is Chrome or not
				else if (navigator.userAgent.search("Chrome") >= 0) {
					$("#ub-container").addClass("chrome");
				}
				//Check if browser is Firefox or not
				else if (navigator.userAgent.search("Firefox") >= 0) {
					$("#ub-container").addClass("firefox");
				}
				//Check if browser is Safari or not
				else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
					$("#ub-container").addClass("safari");
				}
				//Check if browser is Opera or not
				else if (navigator.userAgent.search("Opera") >= 0) {
					$("#ub-container").addClass("opera");
				}
				else {
					$("#ub-container").addClass("other");
				}
			}
			//Width and height
			var w = 750;
			var h = 470;
			var center = [w / 2, h/ 2];
			var wchart = 350;
			var hchart = 35;
			var active = d3.select(null);

			//Define map projection
			var projection = d3.geo.albersUsa()
								   .translate([w/2, h/2])
								   .scale([1000]);

			//Define path generator
			var path = d3.geo.path()
							 .projection(projection);

			var zoom = d3.behavior.zoom()
				.scaleExtent([1, 8])
				.on("zoom", zoomed);

			//Define colors								
	//		var blueColor = d3.scale.threshold().range(["rgb(228,243,249)","rgb(207,232,243)","rgb(162,212,236)","rgb(115,191,226)","rgb(70,171,219)","rgb(22,150,210)","rgb(18,113,158)","rgb(10,76,106)","rgb(6,38,53)"]);
			var greenColor = d3.scale.threshold().range(["rgb(241,247,240)","rgb(220,237,217)","rgb(188,222,180)","rgb(152,207,144)","rgb(120,194,109)","rgb(85,183,72)","rgb(64,137,65)","rgb(44,92,45)","rgb(26,46,25)"]);

	//		var blueCharts = d3.scale.quantize().range(["rgb(6,38,53)","rgb(10,76,106)","rgb(18,113,158)","rgb(22,150,210)","rgb(115,191,226)","rgb(207,232,243)"]);
	//		var blueCharts4 = d3.scale.quantize().range(["rgb(6,38,53)","rgb(18,113,158)","rgb(115,191,226)","rgb(207,232,243)"]);
	//		var blueCharts2 = d3.scale.quantize().range(["rgb(6,38,53)","rgb(70,171,219)"]);
			var greenCharts = d3.scale.quantize().range(["rgb(26,46,25)","rgb(44,92,45)","rgb(64,137,65)","rgb(85,183,72)","rgb(152,207,144)","rgb(188,222,180)"]);
			var greenCharts4 = d3.scale.quantize().range(["rgb(26,46,25)","rgb(64,137,65)","rgb(152,207,144)","rgb(188,222,180)"]);
			var greenCharts2 = d3.scale.quantize().range(["rgb(26,46,25)","rgb(85,183,72)"]);
			//Set input domain for color scale
	//		blueCharts.domain([0,5]);
	//		blueCharts4.domain([0,3]);
	//		blueCharts2.domain([0,1]);
			greenCharts.domain([0,5]);
			greenCharts4.domain([0,3]);
			greenCharts2.domain([0,1]);

			// loading data
			var tooltipArea = d3.select("#ub-tooltip");
			var tooltipQuestion = d3.select("#ub-tooltip-question");
			var tooltipQuestion01 = 'The shares of children grouped by whether they are living in households that are not burdened by housing and utility costs, somewhat burdened, or severely burdened. Households “not burdened by housing and utility costs” spend less than 30 percent of their income on selected housing and utility costs; households “somewhat burdened by housing and utility costs” spend 30 percent or more, but less than 50 percent, of their income on selected housing and utility costs; and households “severely burdened by housing and utility costs” spend 50 percent or more of their income on selected housing and utility costs.';			
			var tooltipQuestion02 = 'The shares of children in parent-reported racial and ethnic groups. “White” consists of non-Hispanics whose parents identify them as white or Caucasian alone; “Hispanic” includes all children whose parents identify them as Hispanic, Spanish, or Latino, regardless of race; “African American” consists of non-Hispanics whose parents identify them as black or African American alone; “Asian” consists of non-Hispanics whose parents identify them as Asian or Pacific Islander alone; “Native American” consists of non-Hispanics whose parents identify them as American Indian or Alaska Native alone; and “other or multiracial” consists of non-Hispanics whose parents identify them as “other” race or more than one race, as well as any of the preceding groups that are not displayed separately because of small sample sizes.';			
			var tooltipQuestion03 = 'The shares of children who are US and non-US citizens.';
			var tooltipQuestion04 = 'The shares of children in income groups based on family income over the past 12 months. “Poor” children live in families with incomes below the federal poverty level (FPL); “low-income but not poor” children live in families with incomes greater than or equal to 100 percent but less than 200 percent of FPL; and “not low-income” children live in families with incomes at or above 200 percent of FPL.';
			var tooltipQuestion05 = 'The shares of children grouped by the educational attainment of their parents living in the household. Children in the “all parents have a high school education or less” group have parents who have all either earned high school diplomas or equivalents (i.e., a GED) or received less education. Children in the “at least one parent has education beyond high school; none have bachelor’s degrees” group have at least one parent who has some education beyond earning a high school diploma or equivalent but no parent who has a bachelor’s degree. Children in the “at least one parent has a bachelor’s degree or more” group have at least one parent who has completed at least a bachelor’s degree.';
			var tooltipQuestion06 = 'The shares of children who have all parents working full time; all parents working, with at least one working less than full time; and at least one parent not working. Working full time means having worked 1,800 or more hours in the past 12 months.';
			var tooltipQuestion07 = 'The shares of children who have all immigrant parents, one immigrant and one native-born parent, and all native-born parents. Native-born parents were born in the United States, Puerto Rico, or other US territories or were born abroad to US-citizen parents.';
			var tooltipQuestion08 = 'The shares of children who have all English-proficient parents, one English-proficient parent and one limited-English-proficient parent, and all limited-English-proficient parents. English-proficient parents report that they speak English at home or that they speak another language at home but also speak English very well.';
			var tooltipQuestion09 = 'The shares of children who have one or two parents living with them.';
			var tooltipQuestion10 = 'The shares of children grouped by the language their parent or parents speak at home. In a two-parent household where the mother and father have different primary languages, this reflects the mother’s primary language.';
			var tooltipQuestion11 = 'Children in the “all parents have a high school education or less” group have parents who have all either earned high school diplomas or equivalents (i.e., a GED) or received less education. Children in the “at least one parent has education beyond high school” group have at least one parent who has some education beyond a high school diploma or equivalent.';
			var tooltipQuestion12 = '“Low-income” children live in families whose income in the past 12 months was below 200 percent of the federal poverty level (FPL). “Not low-income” children live in families whose income in the past 12 months was at or above 200 percent of FPL.';
			var tooltipQuestion13 = 'Children with “all native-born parents” have parents who were born in the United States, Puerto Rico, or other US territories, or were born abroad to US-citizen parents. Children with “at least one immigrant parent” have at least one parent who was born outside the United States, Puerto Rico, and other US territories to a non-US citizen, including parents who became naturalized citizens after the child’s birth, legal permanent residents (green card holders), temporary workers (H1B visa holders), and undocumented residents.';
			var globalNoData = "Insufficient data";
			var areaCurrentGlobal;
			var chosenShortGlobal;
			var theWord;
			var Cat_States_on=true;
			var Cat_Middle_on=false;
			var Cat_CBSA_on=false;
			var Cat01_on=true;
			var Cat02_on=false;
			var Cat03_on=false;
			var Cat04_on=false;
			var Cat05_on=false;
			var Cat06_on=false;
			var Cat07_on=false;

			
			var dataset;
			var dataset_S;
			var dataset_states=[];
			var dataset_stateshort_S=[];
			var dataset_cbsa=[];
			var dataset_stateshort=[];
			var dataset_fips=[];
			var dataset_fips_S=[];
			var dataset_cat01=[];
			var dataset_cat01_S=[];
			var dataset_cat02=[];
			var dataset_cat02_S=[];
			var dataset_cat02_pct=[];
			var dataset_cat02_pct_S=[];
			var dataset_cat03=[];
			var dataset_cat03_S=[];
			var dataset_cat03_pct=[];
			var dataset_cat03_pct_S=[];
			var dataset_cat04=[];
			var dataset_cat04_S=[];
			var dataset_cat04_pct=[];
			var dataset_cat04_pct_S=[];
			var dataset_cat05=[];
			var dataset_cat05_S=[];
			var dataset_cat05_pct=[];
			var dataset_cat05_pct_S=[];
			var dataset_cat06=[];
			var dataset_cat06_S=[];
			var dataset_cat06_pct=[];
			var dataset_cat06_pct_S=[];
			var dataset_cat07=[];
			var dataset_cat07_S=[];
			var dataset_cat07_pct=[];
			var dataset_cat07_pct_S=[];
			
			var dataset_chart_01=[];
			var dataset_chart_01_S=[];
			var dataset_chart_02=[];
			var dataset_chart_02_S=[];
			var dataset_chart_03=[];
			var dataset_chart_03_S=[];
			var dataset_chart_04=[];
			var dataset_chart_04_S=[];
			var dataset_chart_05=[];
			var dataset_chart_05_S=[];
			var dataset_chart_06=[];
			var dataset_chart_06_S=[];
			var dataset_chart_07=[];
			var dataset_chart_07_S=[];
			var dataset_chart_08=[];
			var dataset_chart_08_S=[];
			var dataset_chart_09=[];
			var dataset_chart_09_S=[];
			var dataset_chart_10=[];
			var dataset_chart_10_S=[];

			var lastK=1;
			var active;
			var centerCounty;
			var currentZoomArea;
			
			//Create SVG element
			var svg = d3.select(".ub-graphic-container")
				.append("svg")
				.attr("id","ub-usa-map")
			//	.attr("width", w)
			//	.attr("height", h)
				.attr("viewBox","0 0 "+w+" "+h)
				.attr("preserveAspectRatio","xMinYMin meet")
				.classed("ub-content-responsive", true)
				.on("click", stopped, true);

			svg.append("rect")
				.attr("id", "ub-background")
				.attr("fill","rgb(255,255,255)")
				.attr("width", w)
				.attr("height", h)
				.on("click", reset);

			var g = svg.append("g");
			svg
				.call(zoom) // delete this line to disable free zooming
				.call(zoom.event);
			
			// Call to action buttons
			d3.select(".ub-cat-01").on("click", function() {
				$('.ub-data-container .ub-data-container-wrap p').text("All children");
				Cat01_on=true;
				Cat02_on=false;Cat03_on=false;Cat04_on=false;Cat05_on=false;Cat06_on=false;Cat07_on=false;
				if (Cat_States_on){
					funcCat01_S();
					funcCat01_color();
					if (areaCurrentGlobal) {
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}
				if (Cat_CBSA_on){
					funcCat01();
					if (areaCurrentGlobal) {
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
				}
			});
			d3.select(".ub-cat-02").on("click", function() {
				$('.ub-data-container .ub-data-container-wrap p').text("All parents have a high school education or less");
				Cat02_on=true;
				Cat01_on=false;Cat03_on=false;Cat04_on=false;Cat05_on=false;Cat06_on=false;Cat07_on=false;
				if (Cat_States_on){
					funcCat02_S();
					funcCat02_color();
					if (areaCurrentGlobal) {
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}
				if (Cat_CBSA_on){
					funcCat02();
					if (areaCurrentGlobal) {
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
				}
			});
			d3.select(".ub-cat-03").on("click", function() {
				$('.ub-data-container .ub-data-container-wrap p').text("At least one parent has education beyond high school");
				Cat03_on=true;
				Cat01_on=false;Cat02_on=false;Cat04_on=false;Cat05_on=false;Cat06_on=false;Cat07_on=false;
				if (Cat_States_on){
					funcCat03_S();
					funcCat03_color();
					if (areaCurrentGlobal) {
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}
				if (Cat_CBSA_on){
					funcCat03();
					if (areaCurrentGlobal) {
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
				}
			});
			d3.select(".ub-cat-04").on("click", function() {
				$('.ub-data-container .ub-data-container-wrap p').text("Low-income");
				Cat04_on=true;
				Cat01_on=false;Cat02_on=false;Cat03_on=false;Cat05_on=false;Cat06_on=false;Cat07_on=false;
				if (Cat_States_on){
					funcCat04_S();
					funcCat04_color();
					if (areaCurrentGlobal) {
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}
				if (Cat_CBSA_on){
					funcCat04();
					if (areaCurrentGlobal) {
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
				}
			});
			d3.select(".ub-cat-05").on("click", function() {
				$('.ub-data-container .ub-data-container-wrap p').text("Not low-income");
				Cat05_on=true;
				Cat01_on=false;Cat02_on=false;Cat03_on=false;Cat04_on=false;Cat06_on=false;Cat07_on=false;
				if (Cat_States_on){
					funcCat05_S();
					funcCat05_color();
					if (areaCurrentGlobal) {
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}
				if (Cat_CBSA_on){
					funcCat05();
					if (areaCurrentGlobal) {
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
				}
			});
			d3.select(".ub-cat-06").on("click", function() {
				$('.ub-data-container .ub-data-container-wrap p').text("All native-born parents");
				Cat06_on=true;
				Cat01_on=false;Cat02_on=false;Cat03_on=false;Cat04_on=false;Cat05_on=false;Cat07_on=false;
				if (Cat_States_on){
					funcCat06_S();
					funcCat06_color();
					if (areaCurrentGlobal) {
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}
				if (Cat_CBSA_on){
					funcCat06();
					if (areaCurrentGlobal) {
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
				}
			});
			d3.select(".ub-cat-07").on("click", function() {
				$('.ub-data-container .ub-data-container-wrap p').text("At least one immigrant parent");
				Cat07_on=true;
				Cat01_on=false;Cat02_on=false;Cat03_on=false;Cat04_on=false;Cat05_on=false;Cat06_on=false;
				if (Cat_States_on){
					funcCat07_S();
					funcCat07_color();
					if (areaCurrentGlobal) {
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}
				if (Cat_CBSA_on){
					funcCat07();
					if (areaCurrentGlobal) {
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
				}
			});
			
			
			d3.select("#ub-cbsa-menu .ub-cbsa-list .ub-select-none").on("click", function(){
				$('#ub-states-national').remove();
				$(".ub-data h3 .ub-data-place").text('the United States');
				Cat_States_on=true;
				Cat_Middle_on=false;
				Cat_CBSA_on=false;
				MapStates();
				if(Cat01_on){
					funcCat01_S();
				}else if(Cat02_on){
					funcCat02_S();
				}else if(Cat03_on){
					funcCat03_S();
				}else if(Cat04_on){
					funcCat04_S();
				}else if(Cat05_on){
					funcCat05_S();
				}else if(Cat06_on){
					funcCat06_S();
				}else if(Cat07_on){
					funcCat07_S();
				}else {
				}
				d3.select("#ub-state-menu p").html('All states<span class="ub-initial"></span>');
				d3.select("#ub-cbsa-menu p").html('None selected<span class="ub-initial"></span>');
				d3.select("#ub-cbsa-menu .ub-cbsa-list").classed("ub-opened-long",false);
				var restPathHTMLLine = $("#ub-states-rest path");
				restPathHTMLLine.css("stroke","#FFFFFF");
				restPathHTMLLine.css("stroke-width","1px");
				reset();
			});

			
			d3.select("#ub-state-menu .ub-state-list .ub-select-all").on("click", function(){
				$('#ub-states-national').remove();
				$(".ub-data h3 .ub-data-place").text('the United States');
				Cat_States_on=true;
				Cat_Middle_on=false;
				Cat_CBSA_on=false;
				MapStates();
				if(Cat01_on){
					funcCat01_S();
				}else if(Cat02_on){
					funcCat02_S();
				}else if(Cat03_on){
					funcCat03_S();
				}else if(Cat04_on){
					funcCat04_S();
				}else if(Cat05_on){
					funcCat05_S();
				}else if(Cat06_on){
					funcCat06_S();
				}else if(Cat07_on){
					funcCat07_S();
				}else {
				}
				d3.select("#ub-state-menu p").html('All states<span class="ub-initial"></span>');
				d3.select("#ub-cbsa-menu p").html('None selected<span class="ub-initial"></span>');
				d3.select("#ub-cbsa-menu .ub-cbsa-list").classed("ub-opened-long",false);
				var restPathHTMLLine = $("#ub-states-rest path");
				restPathHTMLLine.css("stroke","#FFFFFF");
				restPathHTMLLine.css("stroke-width","1px");
				reset();
			});

			d3.select("#ub-cbsa-menu .ub-cbsa-list .ub-select-all").on("click", function(){
				Cat_States_on=false;
				Cat_Middle_on=true;
				Cat_CBSA_on=true;
				areaCurrentGlobal=100;
				$(".ub-data h3 .ub-data-place").text('the United States');
				$('.ub-charts-container h3').html('<span class="ub-cat-number">11,625,000</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">the United States</span>');
				MapCBSAnoList();
				if(Cat01_on){
					funcCat01();
				}else if(Cat02_on){
					funcCat02();
				}else if(Cat03_on){
					funcCat03();
				}else if(Cat04_on){
					funcCat04();
				}else if(Cat05_on){
					funcCat05();
				}else if(Cat06_on){
					funcCat06();
				}else if(Cat07_on){
					funcCat07();
				}else {
				}
			    hoverState();
				$('.ub-cbsa-list li').each(function(){
					$(this).removeClass("ub-cbsa-select");
				});
				d3.select("#ub-state-menu p").html('<span class="ub-initial">Choose</span>');
				d3.select("#ub-cbsa-menu p").html('All metropolitan and micropolitan areas<span class="ub-initial"></span>');
				var restPathHTMLLine = $("#ub-states-rest path");
				var restPathHTMLFill = $("#ub-states path");
				restPathHTMLLine.css("stroke","#FFFFFF");
				restPathHTMLLine.css("stroke-width","1px");
				restPathHTMLFill.css("fill","#ececec");
				reset();
			});		
			
			d3.csv("data/map_cbsa_data_v2.csv", function(data) {
				dataset=data;
				data.map(function(d) {
					dataset_cbsa.push(d.areaname);
					dataset_stateshort.push(d.areaname2);
					dataset_fips.push(d.areaFIPS);
					
					dataset_cat01.push(parseFloat(d.allchildren0to2));
					dataset_cat02.push(parseFloat(d.pareducHSless));
					dataset_cat02_pct.push(parseFloat(d.pareducHSless_pct*100));
					dataset_cat03.push(parseFloat(d.parpostsec));
					dataset_cat03_pct.push(parseFloat(d.parpostsec_pct*100));
					dataset_cat04.push(parseFloat(d.lowincome));
					dataset_cat04_pct.push(parseFloat(d.lowincome_pct*100));
					dataset_cat05.push(parseFloat(d.notlowincome));
					dataset_cat05_pct.push(parseFloat(d.notlowincome_pct*100));
					dataset_cat06.push(parseFloat(d.allnativebornparents));
					dataset_cat06_pct.push(parseFloat(d.allnativebornparents_pct*100));
					dataset_cat07.push(parseFloat(d.atleast1immigparent));
					dataset_cat07_pct.push(parseFloat(d.atleast1immigparent_pct*100));
				});

				d3.json("data/us_map.json", function(error, us) {
					if (error) throw error;
					jsonmap=us;

					//Merge the ag. data and GeoJSON
					//Loop through once for each ag. data value
					var dataLon_R = data.length;
					for (var i = 0; i < dataLon_R; i++) {
				
						//Grab cbsa or state id (fips)
						var dataFips_R = data[i].areaFIPS;
						
						//Grab data value, and convert from string to float
						var areaName_R = data[i].areaname;
						var stateShort_R = data[i].areaname2;
						var cat01_R = data[i].allchildren0to2;
						var cat02_R = parseFloat(data[i].pareducHSless);
						var cat02_R_pct = parseFloat(data[i].pareducHSless_pct);
						var cat03_R = data[i].parpostsec;
						var cat03_R_pct = data[i].parpostsec_pct;
						var cat04_R = data[i].lowincome;
						var cat04_R_pct = data[i].lowincome_pct;
						var cat05_R = data[i].notlowincome;
						var cat05_R_pct = data[i].notlowincome_pct;
						var cat06_R = data[i].allnativebornparents;
						var cat06_R_pct = data[i].allnativebornparents_pct;
						var cat07_R = data[i].atleast1immigparent;
						var cat07_R_pct = data[i].atleast1immigparent_pct;

						var propData_R = [dataFips_R, areaName_R, cat01_R, cat02_R, cat03_R, cat04_R, cat05_R, cat06_R, cat07_R, cat02_R_pct, cat03_R_pct, cat04_R_pct, cat05_R_pct, cat06_R_pct, cat07_R_pct, stateShort_R];
						//Find the corresponding state inside the GeoJSON
						var stateGeometries = us.objects.states.geometries.length;
						for (var j = 0; j < stateGeometries; j++) {
						
							var jsonFips_R = us.objects.states.geometries[j].id;
				
							if (dataFips_R == jsonFips_R) {						
								//Copy the data value into the JSON								
								us.objects.states.geometries[j].properties = propData_R;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}					
					
					//Load in State areas for residual CBSA GeoJSON data
					g.append("g")
						  	.attr("id", "ub-states")
							.selectAll("path")
							.data(topojson.feature(us, us.objects.states).features)
							.enter()
							.append("path")
							.classed("ub-state-fill",true)
							.attr("d", path)
						//	.attr("id", function(d) { return d.id; })
							.attr("id", function(d) { if (d.id==72 || d.id==78) {return d.id+1000000;}else{return d.id;}})
							.attr("data-areaname", function(d) {
								var stateRest_R=d.properties[1];if(stateRest_R){return stateRest_R;}else{return "";}
							})
						//	.attr("data-areanameshort", function(d) {
						//		var area2_R=d.properties[15];if(area2_R){return area2_R;}else{return "";}
						//	})
							.attr("data-allchildren", function(d) {
								var dataAllChildren_R=d.properties[2];if (dataAllChildren_R){
									if (!isNaN(dataAllChildren_R)){
										return d3.format(",.r")(dataAllChildren_R);
									}else{
										return globalNoData;
									}
									}else{
										return globalNoData;
									}
							})
							.attr("data-enrolled", function(d) {
								var dataEnrolled_R=d.properties[3];if (dataEnrolled_R){
									if (!isNaN(dataEnrolled_R)){
										if (dataEnrolled_R!="0"){
											return d3.format(",.r")(dataEnrolled_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-pareduchsless_pct", function(d) {
								var dataEnrolled_R_pct=d.properties[9];if (dataEnrolled_R_pct){
									if (!isNaN(dataEnrolled_R_pct)){
										if (dataEnrolled_R_pct!="0"){
											return d3.format(".1%")(dataEnrolled_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notenrolled", function(d) {
								var dataNotEnrolled_R=d.properties[4];if (dataNotEnrolled_R){
									if (!isNaN(dataNotEnrolled_R)){
										if (dataNotEnrolled_R!="0"){
											return d3.format(",.r")(dataNotEnrolled_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-parpostsec_pct", function(d) {
								var dataNotEnrolled_R_pct=d.properties[10];if (dataNotEnrolled_R_pct){
									if (!isNaN(dataNotEnrolled_R_pct)){
										if (dataNotEnrolled_R_pct!="0"){
											return d3.format(".1%")(dataNotEnrolled_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-lowincome", function(d) {
								var dataLowIncome_R=d.properties[5];if (dataLowIncome_R){
									if (!isNaN(dataLowIncome_R)){
										if (dataLowIncome_R!="0"){
											return d3.format(",.r")(dataLowIncome_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-lowincome_pct", function(d) {
								var dataLowIncome_R_pct=d.properties[11];if (dataLowIncome_R_pct){
									if (!isNaN(dataLowIncome_R_pct)){
										if (dataLowIncome_R_pct!="0"){
											return d3.format(".1%")(dataLowIncome_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notlowincome", function(d) {
								var dataNotLowIncome_R=d.properties[6];if (dataNotLowIncome_R){
									if (!isNaN(dataNotLowIncome_R)){
										if (dataNotLowIncome_R!="0"){
											return d3.format(",.r")(dataNotLowIncome_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notlowincome_pct", function(d) {
								var dataNotLowIncome_R_pct=d.properties[12];if (dataNotLowIncome_R_pct){
									if (!isNaN(dataNotLowIncome_R_pct)){
										if (dataNotLowIncome_R_pct!="0"){
											return d3.format(".1%")(dataNotLowIncome_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-native", function(d) {
								var dataNative_R=d.properties[7];if (dataNative_R){
									if (!isNaN(dataNative_R)){
										if (dataNative_R!="0"){
											return d3.format(",.r")(dataNative_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-native_pct", function(d) {
								var dataNative_R_pct=d.properties[13];if (dataNative_R_pct){
									if (!isNaN(dataNative_R_pct)){
										if (dataNative_R_pct!="0"){
											return d3.format(".1%")(dataNative_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notnative", function(d) {
								var dataNotNative_R=d.properties[8];if (dataNotNative_R){
									if (!isNaN(dataNotNative_R)){
										if (dataNotNative_R!="0"){
											return d3.format(",.r")(dataNotNative_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notnative_pct", function(d) {
								var dataNotNative_R_pct=d.properties[14];if (dataNotNative_R_pct){
									if (!isNaN(dataNotNative_R_pct)){
										if (dataNotNative_R_pct!="0"){
											return d3.format(".1%")(dataNotNative_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.style("fill", function(d) {return "#ececec";})
							.on("click", clicked);

					
			//		active = d3.select("path[id='20']").classed("active", true);
					active = d3.select("path[id='20']");
				
					
				});
				
				
				//Load in CBSA GeoJSON data
				d3.json("data/cbsa_map.json", function(error, json) {
					jsonmap=json;



					//Merge the ag. data and GeoJSON
					//Loop through once for each ag. data value
					var dataLon = data.length;
					for (var i = 0; i < dataLon; i++) {
				
						//Grab cbsa or state id (fips)
						var dataFips = data[i].areaFIPS;
						
						//Grab data value, and convert from string to float
						var areaName = data[i].areaname;
						var stateShort = data[i].areaname2;
						var cat01 = data[i].allchildren0to2;
				//		var cat02 = parseFloat(data[i].pareducHSless);
						var cat02 = data[i].pareducHSless;
				//		var cat02_pct = parseFloat(data[i].pareducHSless_pct);
						var cat02_pct = data[i].pareducHSless_pct;
						var cat03 = data[i].parpostsec;
						var cat03_pct = data[i].parpostsec_pct;
						var cat04 = data[i].lowincome;
						var cat04_pct = data[i].lowincome_pct;
						var cat05 = data[i].notlowincome;
						var cat05_pct = data[i].notlowincome_pct;
						var cat06 = data[i].allnativebornparents;
						var cat06_pct = data[i].allnativebornparents_pct;
						var cat07 = data[i].atleast1immigparent;
						var cat07_pct = data[i].atleast1immigparent_pct;

						var propData = [dataFips, areaName, stateShort, cat01, cat02, cat03, cat04, cat05, cat06, cat07, cat02_pct, cat03_pct, cat04_pct, cat05_pct, cat06_pct, cat07_pct];
						//Find the corresponding state inside the GeoJSON
						var cbsaGeometries = json.objects.cb_2014_us_cbsa_500k.geometries.length;
						for (var j = 0; j < cbsaGeometries; j++) {
						
							var jsonFips = json.objects.cb_2014_us_cbsa_500k.geometries[j].properties.CBSAFP;
				
							if (dataFips == jsonFips) {						
								//Copy the data value into the JSON								
								json.objects.cb_2014_us_cbsa_500k.geometries[j].properties = propData;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}

					//Bind data and create one path per GeoJSON feature
					g.append("g")
	      				.attr("id", "ub-cbsa")
						.selectAll("path")
					    .data(topojson.feature(json, json.objects.cb_2014_us_cbsa_500k).features)
					    .enter()
					    .append("path")
						.classed("ub-cbsa",true)
					    .attr("d", path)
					    .attr("data-id", function(d) { return d.properties.CBSAFP; })
					    .attr("data-name", function(d) { return d.properties.NAME; })
						.attr("id", function(d) {
							var ide=d.properties[0];return ide;
						})
						.attr("data-areaname", function(d) {
							var area1=d.properties[1];var area2=d.properties[2];if(area2){return area1+", "+area2;}else if(!area2){return area1;}else{return "";}
						})
						.attr("data-allchildren", function(d) {
							var dataAllChildren=d.properties[3];if (dataAllChildren){
								if (!isNaN(dataAllChildren)){
									return d3.format(",.r")(dataAllChildren);
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-enrolled", function(d) {
							var dataEnrolled=d.properties[4];if (dataEnrolled){
								if (!isNaN(dataEnrolled)){
									if (dataEnrolled!="0"){
										return d3.format(",.r")(dataEnrolled);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-pareduchsless_pct", function(d) {
							var datapareducHSless_pct=d.properties[10];if (datapareducHSless_pct){
								if (!isNaN(datapareducHSless_pct)){
									if (datapareducHSless_pct!="0"){
										return d3.format(".1%")(datapareducHSless_pct);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-notenrolled", function(d) {
							var dataNotEnrolled=d.properties[5];if (dataNotEnrolled){
								if (!isNaN(dataNotEnrolled)){
									if (dataNotEnrolled!="0"){
										return d3.format(",.r")(dataNotEnrolled);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-parpostsec_pct", function(d) {
							var dataparpostsec_pct=d.properties[11];if (dataparpostsec_pct){
								if (!isNaN(dataparpostsec_pct)){
									if (dataparpostsec_pct!="0"){
										return d3.format(".1%")(dataparpostsec_pct);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-lowincome", function(d) {
							var dataLowIncome=d.properties[6];if (dataLowIncome){
								if (!isNaN(dataLowIncome)){
									if (dataLowIncome!="0"){
										return d3.format(",.r")(dataLowIncome);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-lowincome_pct", function(d) {
							var dataLowIncome_pct=d.properties[12];if (dataLowIncome_pct){
								if (!isNaN(dataLowIncome_pct)){
									if (dataLowIncome_pct!="0"){
										return d3.format(".1%")(dataLowIncome_pct);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-notlowincome", function(d) {
							var dataNotLowIncome=d.properties[7];if (dataNotLowIncome){
								if (!isNaN(dataNotLowIncome)){
									if (dataNotLowIncome!="0"){
										return d3.format(",.r")(dataNotLowIncome);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-notlowincome_pct", function(d) {
							var dataNotLowIncome_pct=d.properties[13];if (dataNotLowIncome_pct){
								if (!isNaN(dataNotLowIncome_pct)){
									if (dataNotLowIncome_pct!="0"){
										return d3.format(".1%")(dataNotLowIncome_pct);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-native", function(d) {
							var dataNative=d.properties[8];if (dataNative){
								if (!isNaN(dataNative)){
									if (dataNative!="0"){
										return d3.format(",.r")(dataNative);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-native_pct", function(d) {
							var dataNative_pct=d.properties[14];if (dataNative_pct){
								if (!isNaN(dataNative_pct)){
									if (dataNative_pct!="0"){
										return d3.format(".1%")(dataNative_pct);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-notnative", function(d) {
							var dataNotNative=d.properties[9];if (dataNotNative){
								if (!isNaN(dataNotNative)){
									if (dataNotNative!="0"){
										return d3.format(",.r")(dataNotNative);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
						.attr("data-notnative_pct", function(d) {
							var dataNotNative_pct=d.properties[15];if (dataNotNative_pct){
								if (!isNaN(dataNotNative_pct)){
									if (dataNotNative_pct!="0"){
										return d3.format(".1%")(dataNotNative_pct);
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							}else{
								return globalNoData;
							}
						})
					    .style("fill", function(d) {
							return "#73bfe2";
					    })
					    .style("stroke", function(d) {
							return "#FFFFFF";
					    })
						.on("click", clicked);
				});


				

				d3.json("data/us_map.json", function(error, us) {
					if (error) throw error;
					jsonmap=us;

					//Merge the ag. data and GeoJSON
					//Loop through once for each ag. data value
					var dataLon_R = data.length;
					for (var i = 0; i < dataLon_R; i++) {
				
						//Grab cbsa or state id (fips)
						var dataFips_R = data[i].areaFIPS;
						
						//Grab data value, and convert from string to float
						var areaName_R = data[i].areaname;
						var stateShort_R = data[i].areaname2;
						var cat01_R = data[i].allchildren0to2;
						var cat02_R = parseFloat(data[i].pareducHSless);
						var cat02_R_pct = parseFloat(data[i].pareducHSless_pct);
						var cat03_R = data[i].parpostsec;
						var cat03_R_pct = data[i].parpostsec_pct;
						var cat04_R = data[i].lowincome;
						var cat04_R_pct = data[i].lowincome_pct;
						var cat05_R = data[i].notlowincome;
						var cat05_R_pct = data[i].notlowincome_pct;
						var cat06_R = data[i].allnativebornparents;
						var cat06_R_pct = data[i].allnativebornparents_pct;
						var cat07_R = data[i].atleast1immigparent;
						var cat07_R_pct = data[i].atleast1immigparent_pct;

						var propData_R = [dataFips_R, areaName_R, cat01_R, cat02_R, cat03_R, cat04_R, cat05_R, cat06_R, cat07_R, cat02_R_pct, cat03_R_pct, cat04_R_pct, cat05_R_pct, cat06_R_pct, cat07_R_pct, stateShort_R];
						//Find the corresponding state inside the GeoJSON
						var stateRestGeometries = us.objects.states.geometries.length;
						for (var j = 0; j < stateRestGeometries; j++) {
						
							var jsonFips_R = us.objects.states.geometries[j].id;
				
							if (dataFips_R == jsonFips_R) {						
								//Copy the data value into the JSON								
								us.objects.states.geometries[j].properties = propData_R;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}
				
					g.append("g")
						  	.attr("id", "ub-states-rest")
							.selectAll("path")
							.data(topojson.feature(us, us.objects.states).features)
							.enter()
							.append("path")
							.classed("ub-state-rest",true)
							.attr("d", path)
							.attr("id", function(d) { if (d.id==72 || d.id==78) {return d.id+1000056;}else{return 56+d.id;}})
							.attr("data-areaname", function(d) {
								var stateRest_R=d.properties[1];if(stateRest_R){return stateRest_R;}else{return "";}
							})
							.attr("data-allchildren", function(d) {
								var dataAllChildren_R=d.properties[2];if (dataAllChildren_R){
									if (!isNaN(dataAllChildren_R)){
										return d3.format(",.r")(dataAllChildren_R);
									}else{
										return globalNoData;
									}
									}else{
										return globalNoData;
									}
							})
							.attr("data-enrolled", function(d) {
								var dataEnrolled_R=d.properties[3];if (dataEnrolled_R){
									if (!isNaN(dataEnrolled_R)){
										if (dataEnrolled_R!="0"){
											return d3.format(",.r")(dataEnrolled_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-pareduchsless_pct", function(d) {
								var dataEnrolled_R_pct=d.properties[9];if (dataEnrolled_R_pct){
									if (!isNaN(dataEnrolled_R_pct)){
										if (dataEnrolled_R_pct!="0"){
											return d3.format(".1%")(dataEnrolled_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notenrolled", function(d) {
								var dataNotEnrolled_R=d.properties[4];if (dataNotEnrolled_R){
									if (!isNaN(dataNotEnrolled_R)){
										if (dataNotEnrolled_R!="0"){
											return d3.format(",.r")(dataNotEnrolled_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-parpostsec_pct", function(d) {
								var dataNotEnrolled_R_pct=d.properties[10];if (dataNotEnrolled_R_pct){
									if (!isNaN(dataNotEnrolled_R_pct)){
										if (dataNotEnrolled_R_pct!="0"){
											return d3.format(".1%")(dataNotEnrolled_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-lowincome", function(d) {
								var dataLowIncome_R=d.properties[5];if (dataLowIncome_R){
									if (!isNaN(dataLowIncome_R)){
										if (dataLowIncome_R!="0"){
											return d3.format(",.r")(dataLowIncome_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-lowincome_pct", function(d) {
								var dataLowIncome_R_pct=d.properties[11];if (dataLowIncome_R_pct){
									if (!isNaN(dataLowIncome_R_pct)){
										if (dataLowIncome_R_pct!="0"){
											return d3.format(".1%")(dataLowIncome_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notlowincome", function(d) {
								var dataNotLowIncome_R=d.properties[6];if (dataNotLowIncome_R){
									if (!isNaN(dataNotLowIncome_R)){
										if (dataNotLowIncome_R!="0"){
											return d3.format(",.r")(dataNotLowIncome_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notlowincome_pct", function(d) {
								var dataNotLowIncome_R_pct=d.properties[12];if (dataNotLowIncome_R_pct){
									if (!isNaN(dataNotLowIncome_R_pct)){
										if (dataNotLowIncome_R_pct!="0"){
											return d3.format(".1%")(dataNotLowIncome_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-native", function(d) {
								var dataNative_R=d.properties[7];if (dataNative_R){
									if (!isNaN(dataNative_R)){
										if (dataNative_R!="0"){
											return d3.format(",.r")(dataNative_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-native_pct", function(d) {
								var dataNative_R_pct=d.properties[13];if (dataNative_R_pct){
									if (!isNaN(dataNative_R_pct)){
										if (dataNative_R_pct!="0"){
											return d3.format(".1%")(dataNative_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notnative", function(d) {
								var dataNotNative_R=d.properties[8];if (dataNotNative_R){
									if (!isNaN(dataNotNative_R)){
										if (dataNotNative_R!="0"){
											return d3.format(",.r")(dataNotNative_R);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notnative_pct", function(d) {
								var dataNotNative_R_pct=d.properties[14];if (dataNotNative_R_pct){
									if (!isNaN(dataNotNative_R_pct)){
										if (dataNotNative_R_pct!="0"){
											return d3.format(".1%")(dataNotNative_R_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							});
				});


			});
			
			
setTimeout(function(){
	MapStates();
},2000);
setTimeout(function(){
	$('#ub-loading-overlay').fadeOut(800);
},2100);
hoverQuestion();
			
function MapCBSA(){
	var statesBase = $('#ub-states');
	var statesMap = $('#ub-states-national');
	$(statesMap).css("opacity","0");
	setTimeout(function(){
		$('#ub-usa-map > g').prepend(statesBase);
	},400);
	setTimeout(function(){
		$('#ub-usa-map > g').prepend(statesMap);
	},800);
	hoverState();
	if (Cat_CBSA_on){
		chart_01();
		chart_02();
		chart_03();
		chart_04();
		chart_05();
		chart_06();
		chart_07();
		chart_08();
		chart_09();
		chart_10();

		if(Cat01_on){
			funcCat01();
		}else if(Cat02_on){
			funcCat02();
		}else if(Cat03_on){
			funcCat03();
		}else if(Cat04_on){
			funcCat04();
		}else if(Cat05_on){
			funcCat05();
		}else if(Cat06_on){
			funcCat06();
		}else if(Cat07_on){
			funcCat07();
		}else {
		}

		$('.ub-cbsa-list li.ub-sorted').each(function(){
			$(this).removeClass("ub-cbsa-select");
		});
		ListCBSA();
	}
};	// End of function MapCBSA()

function MapCBSAnoList(){
	var statesMap = $('#ub-states-national');
	$(statesMap).css("opacity","0");
	setTimeout(function(){
		$('#ub-usa-map > g').prepend(statesMap);
	},800);
	hoverState();
	if (Cat_CBSA_on){
		chart_01();
		chart_02();
		chart_03();
		chart_04();
		chart_05();
		chart_06();
		chart_07();
		chart_08();
		chart_09();
		chart_10();

		if(Cat01_on){
			funcCat01();
		}else if(Cat02_on){
			funcCat02();
		}else if(Cat03_on){
			funcCat03();
		}else if(Cat04_on){
			funcCat04();
		}else if(Cat05_on){
			funcCat05();
		}else if(Cat06_on){
			funcCat06();
		}else if(Cat07_on){
			funcCat07();
		}else {
		}
		$('.ub-cbsa-list li.ub-sorted').each(function(){
			$(this).removeClass("ub-cbsa-select");
		});
	}
};	// End of function MapCBSAnoList()


function MapStates(){
// if (Cat_States_on){
			$(".ub-data h3").html('<span class="ub-data-name">All children from birth to age 2</span> in <span class="ub-data-place">the United States</span>');
			$('.ub-charts-container h3').html('<span class="ub-cat-number">11,625,000</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">the United States</span>');
			areaCurrentGlobal=100;
			chart_01_S();
			chart_02_S();
			chart_03_S();
			chart_04_S();
			chart_05_S();
			chart_06_S();
			chart_07_S();
			chart_08_S();
			chart_09_S();
			chart_10_S();
			// Read data
			d3.csv("data/map_states_data_v2.csv", function(data) {
				dataset_S=data;
				data.map(function(d) {
					dataset_states.push(d.areaname);
					dataset_stateshort_S.push(d.areashort);
					dataset_fips_S.push(d.areaFIPS);
					
					dataset_cat01_S.push(parseFloat(d.allchildren0to2));
					dataset_cat02_S.push(parseFloat(d.pareducHSless));
					dataset_cat02_pct_S.push(parseFloat(d.pareducHSless_pct*100));
					dataset_cat03_S.push(parseFloat(d.parpostsec));
					dataset_cat03_pct_S.push(parseFloat(d.parpostsec_pct*100));
					dataset_cat04_S.push(parseFloat(d.lowincome));
					dataset_cat04_pct_S.push(parseFloat(d.lowincome_pct*100));
					dataset_cat05_S.push(parseFloat(d.notlowincome));
					dataset_cat05_pct_S.push(parseFloat(d.notlowincome_pct*100));
					dataset_cat06_S.push(parseFloat(d.allnativebornparents));
					dataset_cat06_pct_S.push(parseFloat(d.allnativebornparents_pct*100));
					dataset_cat07_S.push(parseFloat(d.atleast1immigparent));
					dataset_cat07_pct_S.push(parseFloat(d.atleast1immigparent_pct*100));
				});			

				d3.json("data/us_map.json", function(error, usbase) {
					if (error) throw error;
					jsonmap=usbase;				
					
					//Merge the ag. data and GeoJSON
					//Loop through once for each ag. data value
					var dataLon_S = data.length;
					for (var i = 0; i < dataLon_S; i++) {
				
						//Grab cbsa or state id (fips)
						var dataFips_S = data[i].areaFIPS;
						
						//Grab data value, and convert from string to float
						var areaName_S = data[i].areaname;
						var areaNameShort_S = data[i].areashort;
						var cat01_S = data[i].allchildren0to2;
						var cat02_S = parseFloat(data[i].pareducHSless);
						var cat02_S_pct = parseFloat(data[i].pareducHSless_pct);
						var cat03_S = data[i].parpostsec;
						var cat03_S_pct = data[i].parpostsec_pct;
						var cat04_S = data[i].lowincome;
						var cat04_S_pct = data[i].lowincome_pct;
						var cat05_S = data[i].notlowincome;
						var cat05_S_pct = data[i].notlowincome_pct;
						var cat06_S = data[i].allnativebornparents;
						var cat06_S_pct = data[i].allnativebornparents_pct;
						var cat07_S = data[i].atleast1immigparent;
						var cat07_S_pct = data[i].atleast1immigparent_pct;

						var propData_S = [dataFips_S, areaName_S, cat01_S, cat02_S, cat03_S, cat04_S, cat05_S, cat06_S, cat07_S, cat02_S_pct, cat03_S_pct, cat04_S_pct, cat05_S_pct, cat06_S_pct, cat07_S_pct, areaNameShort_S];
						//Find the corresponding state inside the GeoJSON
						var stateBaseGeometries = usbase.objects.states.geometries.length;
						for (var j = 0; j < stateBaseGeometries; j++) {
						
							var jsonFips_S = usbase.objects.states.geometries[j].id;
				
							if (dataFips_S == jsonFips_S) {						
								//Copy the data value into the JSON								
								usbase.objects.states.geometries[j].properties = propData_S;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}					
					
					//Load in State areas for residual CBSA GeoJSON data
					g.append("g")
						  	.attr("id", "ub-states-national")
							.selectAll("path")
							.data(topojson.feature(usbase, usbase.objects.states).features)
							.enter()
							.append("path")
							.classed("ub-state-fill",true)
							.attr("d", path)
						//	.attr("id", function(d) { return 112+d.id; })
							.attr("id", function(d) { if (d.id==72 || d.id==78) {return d.id+1000112;}else{return 112+d.id;}})
							.attr("data-areaname", function(d) {
								var stateName_S=d.properties[1];if(stateName_S){return stateName_S;}else{return "";}
							})
							.attr("data-areanameshort", function(d) {
								var stateShortName_S=d.properties[15];if(stateShortName_S){return stateShortName_S;}else{return "";}
							})

							.attr("data-allchildren", function(d) {
								var dataAllChildren_S=d.properties[2];if (dataAllChildren_S){
									if (!isNaN(dataAllChildren_S)){
										return d3.format(",.r")(dataAllChildren_S);
									}else{
										return globalNoData;
									}
									}else{
										return globalNoData;
									}
							})
							.attr("data-enrolled", function(d) {
								var dataEnrolled_S=d.properties[3];if (dataEnrolled_S){
									if (!isNaN(dataEnrolled_S)){
										if (dataEnrolled_S!="0"){
											return d3.format(",.r")(dataEnrolled_S);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-pareduchsless_pct", function(d) {
								var dataEnrolled_S_pct=d.properties[9];if (dataEnrolled_S_pct){
									if (!isNaN(dataEnrolled_S_pct)){
										if (dataEnrolled_S_pct!="0"){
											return d3.format(".1%")(dataEnrolled_S_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notenrolled", function(d) {
								var dataNotEnrolled_S=d.properties[4];if (dataNotEnrolled_S){
									if (!isNaN(dataNotEnrolled_S)){
										if (dataNotEnrolled_S!="0"){
											return d3.format(",.r")(dataNotEnrolled_S);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-parpostsec_pct", function(d) {
								var dataNotEnrolled_S_pct=d.properties[10];if (dataNotEnrolled_S_pct){
									if (!isNaN(dataNotEnrolled_S_pct)){
										if (dataNotEnrolled_S_pct!="0"){
											return d3.format(".1%")(dataNotEnrolled_S_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-lowincome", function(d) {
								var dataLowIncome_S=d.properties[5];if (dataLowIncome_S){
									if (!isNaN(dataLowIncome_S)){
										if (dataLowIncome_S!="0"){
											return d3.format(",.r")(dataLowIncome_S);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-lowincome_pct", function(d) {
								var dataLowIncome_S_pct=d.properties[11];if (dataLowIncome_S_pct){
									if (!isNaN(dataLowIncome_S_pct)){
										if (dataLowIncome_S_pct!="0"){
											return d3.format(".1%")(dataLowIncome_S_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notlowincome", function(d) {
								var dataNotLowIncome_S=d.properties[6];if (dataNotLowIncome_S){
									if (!isNaN(dataNotLowIncome_S)){
										if (dataNotLowIncome_S!="0"){
											return d3.format(",.r")(dataNotLowIncome_S);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notlowincome_pct", function(d) {
								var dataNotLowIncome_S_pct=d.properties[12];if (dataNotLowIncome_S_pct){
									if (!isNaN(dataNotLowIncome_S_pct)){
										if (dataNotLowIncome_S_pct!="0"){
											return d3.format(".1%")(dataNotLowIncome_S_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-native", function(d) {
								var dataNative_S=d.properties[7];if (dataNative_S){
									if (!isNaN(dataNative_S)){
										if (dataNative_S!="0"){
											return d3.format(",.r")(dataNative_S);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-native_pct", function(d) {
								var dataNative_S_pct=d.properties[13];if (dataNative_S_pct){
									if (!isNaN(dataNative_S_pct)){
										if (dataNative_S_pct!="0"){
											return d3.format(".1%")(dataNative_S_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notnative", function(d) {
								var dataNotNative_S=d.properties[8];if (dataNotNative_S){
									if (!isNaN(dataNotNative_S)){
										if (dataNotNative_S!="0"){
											return d3.format(",.r")(dataNotNative_S);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
							.attr("data-notnative_pct", function(d) {
								var dataNotNative_S_pct=d.properties[14];if (dataNotNative_S_pct){
									if (!isNaN(dataNotNative_S_pct)){
										if (dataNotNative_S_pct!="0") {
											return d3.format(".1%")(dataNotNative_S_pct);
										}else{
											return globalNoData;
										}
									}else{
										return globalNoData;
									}
								}else{
									return globalNoData;
								}
							})
					    	.style("fill", function(d) {
					 		//	var fillCBSA = d.properties[2];if (fillCBSA) {return color(fillCBSA);} else {return "#73bfe2";}
								return "#73bfe2";
					    	})
					    	.style("stroke", function(d) {
					 		//	var lineCBSA = d.properties[2];if (lineCBSA) {return color2(lineCBSA);} else {return "#0a4c6a";}
								return "#ffffff";
					    	})
							.on("click", clicked_S);
					

					areaCurrentGlobal=100;
					if(Cat01_on){
						funcCat01_S();
					}else if(Cat02_on){
						funcCat02_S();
					}else if(Cat03_on){
						funcCat03_S();
					}else if(Cat04_on){
						funcCat04_S();
					}else if(Cat05_on){
						funcCat05_S();
					}else if(Cat06_on){
						funcCat06_S();
					}else if(Cat07_on){
						funcCat07_S();
					}else {
					}
				    hoverState_S();
					
					active = d3.select("path[id='20']");


					// STATES MENU
					$('.ub-state-list .ub-state-select').remove();
					var selectState = d3.select('.ub-state-list');				
					selectState.selectAll("option")
						.data(topojson.feature(usbase, usbase.objects.states).features)
						.enter()
						.append("li")
						.classed("ub-state-select", "true")
						.text(function(d) { var valueStateS=d.properties[1];if(valueStateS){return valueStateS; }})
						.attr("value", function(d) { var valueFipsS=d.properties[0];if(valueFipsS){return 112+parseInt(valueFipsS); }else{return 1000000;}})
						.attr("data-statefips", function(d) { var valueStateShortS=d.properties[15];if(valueStateShortS){return valueStateShortS;}})
						.on("click",selected_S);					
				});

				
			});
			
// }
};	// End of function MapStates()
			
function ListCBSA(){
			var selectCBSA = d3.select('.ub-cbsa-list');
//if (Cat_States_on){
			// Read data
			d3.csv("data/map_cbsa_data_v2.csv", function(data) {
				dataset=data;
				data.map(function(d) {
					dataset_cbsa.push(d.areaname);
					dataset_stateshort.push(d.areaname2);
					dataset_fips.push(d.areaFIPS);
					
					dataset_cat01.push(parseFloat(d.allchildren0to2));
					dataset_cat02.push(parseFloat(d.pareducHSless));
					dataset_cat02_pct.push(parseFloat(d.pareducHSless_pct*100));
					dataset_cat03.push(parseFloat(d.parpostsec));
					dataset_cat03_pct.push(parseFloat(d.parpostsec_pct*100));
					dataset_cat04.push(parseFloat(d.lowincome));
					dataset_cat04_pct.push(parseFloat(d.lowincome_pct*100));
					dataset_cat05.push(parseFloat(d.notlowincome));
					dataset_cat05_pct.push(parseFloat(d.notlowincome_pct*100));
					dataset_cat06.push(parseFloat(d.allnativebornparents));
					dataset_cat06_pct.push(parseFloat(d.allnativebornparents_pct*100));
					dataset_cat07.push(parseFloat(d.atleast1immigparent));
					dataset_cat07_pct.push(parseFloat(d.atleast1immigparent_pct*100));
				});
				


				// CBSA MENU
				d3.json("data/cbsa_map.json", function(error, json) {
					jsonmap=json;

					//Merge the ag. data and GeoJSON
					//Loop through once for each ag. data value
					var dataLon_L = data.length;
					for (var i = 0; i < dataLon_L; i++) {
				
						//Grab cbsa or state id (fips)
						var dataFips = data[i].areaFIPS;
						
						//Grab data value, and convert from string to float
						var areaName = data[i].areaname;
						var stateShort = data[i].areaname2;
						var cat01 = data[i].allchildren0to2;
				//		var cat02 = parseFloat(data[i].pareducHSless);
						var cat02 = data[i].pareducHSless;
				//		var cat02_pct = parseFloat(data[i].pareducHSless_pct);
						var cat02_pct = data[i].pareducHSless_pct;
						var cat03 = data[i].parpostsec;
						var cat03_pct = data[i].parpostsec_pct;
						var cat04 = data[i].lowincome;
						var cat04_pct = data[i].lowincome_pct;
						var cat05 = data[i].notlowincome;
						var cat05_pct = data[i].notlowincome_pct;
						var cat06 = data[i].allnativebornparents;
						var cat06_pct = data[i].allnativebornparents_pct;
						var cat07 = data[i].atleast1immigparent;
						var cat07_pct = data[i].atleast1immigparent_pct;

						var propData = [dataFips, areaName, stateShort, cat01, cat02, cat03, cat04, cat05, cat06, cat07, cat02_pct, cat03_pct, cat04_pct, cat05_pct, cat06_pct, cat07_pct];
						//Find the corresponding state inside the GeoJSON
						var cbsaListGeometries = json.objects.cb_2014_us_cbsa_500k.geometries.length;
						for (var j = 0; j < cbsaListGeometries; j++) {
						
							var jsonFips = json.objects.cb_2014_us_cbsa_500k.geometries[j].properties.CBSAFP;
				
							if (dataFips == jsonFips) {						
								//Copy the data value into the JSON								
								json.objects.cb_2014_us_cbsa_500k.geometries[j].properties = propData;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}
					
					// CBSA MENU CREATION OF LI
					var CBSAMenu = selectCBSA.selectAll("option")
						.data(topojson.feature(json, json.objects.cb_2014_us_cbsa_500k).features)
						.enter()
						.append("li")
						.text(function(d) { var valueCbsa=d.properties[1];var valueState=d.properties[2];if(valueCbsa){return valueCbsa+", "+valueState; }})
						.attr("value", function(d) { var valueFips=d.properties[0];if(valueFips){return valueFips; }})
						.attr("data-cbsastatefips", function(d) { var valueState=d.properties[2];if(valueState){return valueState.replace(/ /g, ''); }})
						.classed("ub-cbsa-select", function(d){
							var valueFips=d.properties[0];
							var valueState=d.properties[2];
							if(valueFips && (valueState.replace(/ /g, '').indexOf(chosenShortGlobal)!==-1)){return "true"}
						})
						.classed("ub-sorted", "true");
					
						CBSAMenu.on("click",selected);	
				});				
				
				setTimeout(function(){
					$('.ub-cbsa-list li.ub-sorted').sort(myCompare).appendTo($('.ub-cbsa-list'));
				},500);

				
				// REST OF... MENU
				setTimeout(function(){
				d3.json("data/us_map.json", function(error, us) {
					if (error) throw error;
					jsonmap=us;

					//Merge the ag. data and GeoJSON
					//Loop through once for each ag. data value
					var dataLon_R = data.length;
					for (var i = 0; i < dataLon_R; i++) {
				
						//Grab cbsa or state id (fips)
						var dataFips_R = data[i].areaFIPS;
						
						//Grab data value, and convert from string to float
						var areaName_R = data[i].areaname;
						var stateShort_R = data[i].areaname2;
						var cat01_R = data[i].allchildren0to2;
						var cat02_R = parseFloat(data[i].pareducHSless);
						var cat02_R_pct = parseFloat(data[i].pareducHSless_pct);
						var cat03_R = data[i].parpostsec;
						var cat03_R_pct = data[i].parpostsec_pct;
						var cat04_R = data[i].lowincome;
						var cat04_R_pct = data[i].lowincome_pct;
						var cat05_R = data[i].notlowincome;
						var cat05_R_pct = data[i].notlowincome_pct;
						var cat06_R = data[i].allnativebornparents;
						var cat06_R_pct = data[i].allnativebornparents_pct;
						var cat07_R = data[i].atleast1immigparent;
						var cat07_R_pct = data[i].atleast1immigparent_pct;

						var propData_R = [dataFips_R, areaName_R, cat01_R, cat02_R, cat03_R, cat04_R, cat05_R, cat06_R, cat07_R, cat02_R_pct, cat03_R_pct, cat04_R_pct, cat05_R_pct, cat06_R_pct, cat07_R_pct, stateShort_R];
						//Find the corresponding state inside the GeoJSON
						var stateRestListGeometries = us.objects.states.geometries.length;
						for (var j = 0; j < stateRestListGeometries; j++) {
						
							var jsonFips_R = us.objects.states.geometries[j].id;
				
							if (dataFips_R == jsonFips_R) {						
								//Copy the data value into the JSON								
								us.objects.states.geometries[j].properties = propData_R;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}

					// REST OF... MENU CREATION OF LI
					$('.ub-cbsa-list li.ub-state-rest').each(function(){
						$(this).remove();
					});
														
					var CBSARestMenu = selectCBSA.selectAll("option")
					.data(topojson.feature(us, us.objects.states).features)
					.enter()
					.append("li")
					.classed("ub-state-rest","true")
					.text(function(d) { var valueState_R=d.properties[1];if(valueState_R){return valueState_R; }})
					.attr("value", function(d) { var valueFips_R=d.properties[0];if(valueFips_R){return 56+parseInt(valueFips_R); }})
					.attr("data-cbsastatefips", function(d) { var valueStateShort_R=d.properties[15];if(valueStateShort_R){return valueStateShort_R.replace(/ /g, ''); }})
					.classed("ub-cbsa-select", function(d){
						var valueFips_R=d.properties[0];
						var valueStateShort_R=d.properties[15];
						if(valueFips_R && (valueStateShort_R.replace(/ /g, '').indexOf(chosenShortGlobal)!==-1)){return "true"}
					});
							
					CBSARestMenu.on("click",selected_R);
					
				});
				},550);
				d3.select("#ub-cbsa-menu .ub-cbsa-list").classed("ub-opened-long","true");
				d3.select("#ub-cbsa-menu2 .ub-cbsa-list").classed("ub-opened-long","true");				
			});
// }
};	// End of function ListCBSA()

			
			function round(value, precision) {
				var multiplier = Math.pow(10, precision || 0);
				return Math.round(value * multiplier) / multiplier;
			};			
			
			function hoverQuestion(){
				var lateral = $(window).width();
				d3.selectAll(".ub-tooltip-question")
				    .on("mousemove", function () {
						if (lateral-d3.event.pageX>lateral/2){
        					return tooltipQuestion
            					.style("top", (d3.event.pageY) + "px")
            					.style("left", (d3.event.pageX + 20) + "px");
						} else if (lateral-d3.event.pageX<lateral/2){
        					return tooltipQuestion
            					.style("top", (d3.event.pageY) + "px")
            					.style("left", (d3.event.pageX - 210) + "px");
						} else {
        					return tooltipQuestion
            					.style("top", (d3.event.pageY + 20) + "px")
            					.style("left", (d3.event.pageX - 115) + "px");
						}
    				});	
				$(".ub-tooltip-question").each(function(){
					var questionNumber=$(this).attr("data-question");
					$(this).on(
						{mouseenter:function(){
							if (questionNumber=='01') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion01+"</p>");
							}
							if (questionNumber=='02') {
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion02+"</p>");
								$("#ub-tooltip-question").addClass("ub-long");
							}
							if (questionNumber=='03') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion03+"</p>");
							}
							if (questionNumber=='04') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion04+"</p>");
							}
							if (questionNumber=='05') {
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion05+"</p>");
								$("#ub-tooltip-question").addClass("ub-long");
							}
							if (questionNumber=='06') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion06+"</p>");
							}
							if (questionNumber=='07') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion07+"</p>");
							}
							if (questionNumber=='08') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion08+"</p>");
							}
							if (questionNumber=='09') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion09+"</p>");
							}
							if (questionNumber=='10') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion10+"</p>");
							}
							if (questionNumber=='11') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion11+"</p>");
							}
							if (questionNumber=='12') {
								$("#ub-tooltip-question").removeClass("ub-long");
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion12+"</p>");
							}
							if (questionNumber=='13') {
								$("#ub-tooltip-question p").html("<p>"+tooltipQuestion13+"</p>");
								$("#ub-tooltip-question").addClass("ub-long");
							}
							$("#ub-tooltip-question").removeClass("hidden");
						},mouseleave:function(){
							$("#ub-tooltip-question").addClass("hidden");
							$("#ub-tooltip-question").html("<p>&nbsp;</p>");
						}
					});
					if ($(this).hasClass("hidden")){
					//	$(this).on('touchstart',function(){
					//		$("#ub-tooltip-question").removeClass("hidden");
					//	});						
					} else {
						$("body > *").on('click',function(){
							$("#ub-tooltip-question").addClass("hidden");
							$("#ub-tooltip-question").html("<p>&nbsp;</p>");
						});
					}
				});
			};
			
			function hoverState(){
				var lateral = $(window).width();
				d3.select("#ub-cbsa")
					.selectAll("path")
				    .on("mousemove", function () {
						if (lateral-d3.event.pageX<lateral/4) {
        					return tooltipArea
            					.style("top", (d3.event.pageY + 20) + "px")
            					.style("left", (d3.event.pageX - 200) + "px");
						} else if (lateral-d3.event.pageX<lateral/1.33333) {
        					return tooltipArea
								.style("top", (d3.event.pageY + 24) + "px")
            					.style("left", (d3.event.pageX -120) + "px");
						} else {
        					return tooltipArea
								.style("top", (d3.event.pageY + 20) + "px")
            					.style("left", (d3.event.pageX) + "px");
						}
    				});
				$("#ub-usa-map path.ub-cbsa").each(function() {
                    var areasupername=$(this).attr("data-name");
					var areaname=$(this).attr("data-areaname");
					if (!areaname){
						areaname=areasupername;
					}
					var allChildren=$(this).attr("data-allchildren");
					var enrr1='';
					if ($(this).attr("data-pareduchsless_pct")!=globalNoData){enrr1=round(parseFloat($(this).attr("data-pareduchsless_pct")),0)+'%';}else{enrr1=$(this).attr("data-pareduchsless_pct");};
					var enrr2='';
					if ($(this).attr("data-parpostsec_pct")!=globalNoData){enrr2=round(parseFloat($(this).attr("data-parpostsec_pct")),0)+'%';}else{enrr2=$(this).attr("data-parpostsec_pct");};
					var lowinc1='';
					if ($(this).attr("data-lowincome_pct")!=globalNoData){lowinc1=round(parseFloat($(this).attr("data-lowincome_pct")),0)+'%';}else{lowinc1=$(this).attr("data-lowincome_pct");};
					var lowinc2='';
					if ($(this).attr("data-notlowincome_pct")!=globalNoData){lowinc2=round(parseFloat($(this).attr("data-notlowincome_pct")),0)+'%';}else{lowinc2=$(this).attr("data-notlowincome_pct");};
					var native1='';
					if ($(this).attr("data-native_pct")!=globalNoData){native1=round(parseFloat($(this).attr("data-native_pct")),0)+'%';}else{native1=$(this).attr("data-native_pct");};
					var native2='';
					if ($(this).attr("data-notnative_pct")!=globalNoData){native2=round(parseFloat($(this).attr("data-notnative_pct")),0)+'%';}else{native2=$(this).attr("data-notnative_pct");};

					$(this).on(
						{mouseenter:function(){
							//Update the tooltip position and value
							$(".ub-tooltip-place").text(areaname);
							if(Cat01_on) {
								$(".ub-tooltip-cat").text("All children from birth to age 2");
								$(".ub-tooltip-number").text(allChildren);
							} else if(Cat02_on) {
								$(".ub-tooltip-cat").text("Children from birth to age 2 for whom all parents have a high school education or less");
								$(".ub-tooltip-number").text(enrr1);
							} else if(Cat03_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 for whom at least one parent has education beyond high school");
								$(".ub-tooltip-number").text(enrr2);
							} else if(Cat04_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 in low-income families");
								$(".ub-tooltip-number").text(lowinc1);
							} else if(Cat05_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 in higher-income families");
								$(".ub-tooltip-number").text(lowinc2);
							} else if(Cat06_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 with all native-born parents");
								$(".ub-tooltip-number").text(native1);
							} else if(Cat07_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 with at least one immigrant parent");
								$(".ub-tooltip-number").text(native2);
							} else {}
			   
							//Show the tooltip
							$("#ub-tooltip").removeClass("hidden");
						},mouseleave:function(){
							$("#ub-tooltip").addClass("hidden");
						}
					});
                });

				d3.select("#ub-states")
					.selectAll("path")
				    .on("mousemove", function () {
						if (lateral-d3.event.pageX<lateral/4) {
        					return tooltipArea
            					.style("top", (d3.event.pageY + 20) + "px")
            					.style("left", (d3.event.pageX - 200) + "px");
						} else if (lateral-d3.event.pageX<lateral/1.33333) {
        					return tooltipArea
								.style("top", (d3.event.pageY + 24) + "px")
            					.style("left", (d3.event.pageX -120) + "px");
						} else {
        					return tooltipArea
								.style("top", (d3.event.pageY + 20) + "px")
            					.style("left", (d3.event.pageX) + "px");
						}
    				});
				$("#ub-usa-map path.ub-state-fill").each(function() {
					var areaname_R=$(this).attr("data-areaname");
					var allChildren_R=$(this).attr("data-allchildren");
					var enrr1_R='';
					if ($(this).attr("data-pareduchsless_pct")!=globalNoData){enrr1_R=round(parseFloat($(this).attr("data-pareduchsless_pct")),0)+'%';}else{enrr1_R=$(this).attr("data-pareduchsless_pct");};
					var enrr2_R='';
					if ($(this).attr("data-parpostsec_pct")!=globalNoData){enrr2_R=round(parseFloat($(this).attr("data-parpostsec_pct")),0)+'%';}else{enrr2_R=$(this).attr("data-parpostsec_pct");};
					var lowinc1_R='';
					if ($(this).attr("data-lowincome_pct")!=globalNoData){lowinc1_R=round(parseFloat($(this).attr("data-lowincome_pct")),0)+'%';}else{lowinc1_R=$(this).attr("data-lowincome_pct");};
					var lowinc2_R='';
					if ($(this).attr("data-notlowincome_pct")!=globalNoData){lowinc2_R=round(parseFloat($(this).attr("data-notlowincome_pct")),0)+'%';}else{lowinc2_R=$(this).attr("data-notlowincome_pct");};
					var native1_R='';
					if ($(this).attr("data-native_pct")!=globalNoData){native1_R=round(parseFloat($(this).attr("data-native_pct")),0)+'%';}else{native1_R=$(this).attr("data-native_pct");};
					var native2_R='';
					if ($(this).attr("data-notnative_pct")!=globalNoData){native2_R=round(parseFloat($(this).attr("data-notnative_pct")),0)+'%';}else{native2_R=$(this).attr("data-notnative_pct");};

					$(this).on(
						{mouseenter:function(){
							//Update the tooltip position and value
							$(".ub-tooltip-place").text(areaname_R);
							if(Cat01_on) {
								$(".ub-tooltip-cat").text("All children from birth to age 2");
								$(".ub-tooltip-number").text(allChildren_R);
							} else if(Cat02_on) {
								$(".ub-tooltip-cat").text("Children from birth to age 2 for whom all parents have a high school education or less");
								$(".ub-tooltip-number").text(enrr1_R);
							} else if(Cat03_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 for whom at least one parent has education beyond high school");
								$(".ub-tooltip-number").text(enrr2_R);
							} else if(Cat04_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 in low-income families");
								$(".ub-tooltip-number").text(lowinc1_R);
							} else if(Cat05_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 in higher-income families");
								$(".ub-tooltip-number").text(lowinc2_R);
							} else if(Cat06_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 with all native-born parents");
								$(".ub-tooltip-number").text(native1_R);
							} else if(Cat07_on){
								$(".ub-tooltip-cat").text("Children from birth to age 2 with at least one immigrant parent");
								$(".ub-tooltip-number").text(native2_R);
							} else {}
							
							//Show the tooltip
							$("#ub-tooltip").removeClass("hidden");
						},mouseleave:function(){
							$("#ub-tooltip").addClass("hidden");
						}
					});
                });
			};
			
			
			function hoverState_S(){
				var lateral = $(window).width();
				d3.select("#ub-states-national")
					.selectAll("path")
				    .on("mousemove", function () {
						if (lateral-d3.event.pageX<lateral/4) {
        					return tooltipArea
            					.style("top", (d3.event.pageY + 20) + "px")
            					.style("left", (d3.event.pageX - 200) + "px");
						} else if (lateral-d3.event.pageX<lateral/1.33333) {
        					return tooltipArea
								.style("top", (d3.event.pageY + 24) + "px")
            					.style("left", (d3.event.pageX -120) + "px");
						} else {
        					return tooltipArea
								.style("top", (d3.event.pageY + 20) + "px")
            					.style("left", (d3.event.pageX) + "px");
						}
    				});
				$("#ub-usa-map #ub-states-national path.ub-state-fill").each(function() {
					var areaname_S=$(this).attr("data-areaname");
					var allChildren_S=$(this).attr("data-allchildren");
					var enrr1_S='';
					if ($(this).attr("data-pareduchsless_pct")!=globalNoData){enrr1_S=round(parseFloat($(this).attr("data-pareduchsless_pct")),0)+'%';}else{enrr1_S=$(this).attr("data-pareduchsless_pct");};
					var enrr2_S='';
					if ($(this).attr("data-parpostsec_pct")!=globalNoData){enrr2_S=round(parseFloat($(this).attr("data-parpostsec_pct")),0)+'%';}else{enrr2_S=$(this).attr("data-parpostsec_pct");};
					var lowinc1_S='';
					if ($(this).attr("data-lowincome_pct")!=globalNoData){lowinc1_S=round(parseFloat($(this).attr("data-lowincome_pct")),0)+'%';}else{lowinc1_S=$(this).attr("data-lowincome_pct");};
					var lowinc2_S='';
					if ($(this).attr("data-notlowincome_pct")!=globalNoData){lowinc2_S=round(parseFloat($(this).attr("data-notlowincome_pct")),0)+'%';}else{lowinc2_S=$(this).attr("data-notlowincome_pct");};
					var native1_S='';
					if ($(this).attr("data-native_pct")!=globalNoData){native1_S=round(parseFloat($(this).attr("data-native_pct")),0)+'%';}else{native1_S=$(this).attr("data-native_pct");};
					var native2_S='';
					if ($(this).attr("data-notnative_pct")!=globalNoData){native2_S=round(parseFloat($(this).attr("data-notnative_pct")),0)+'%';}else{native2_S=$(this).attr("data-notnative_pct");};

					$(this).on(
						{mouseenter:function(){
							//Update the tooltip position and value
								$(".ub-tooltip-place").text(areaname_S);
								if(Cat01_on) {
									$(".ub-tooltip-cat").text("All children from birth to age 2");
									$(".ub-tooltip-number").text(allChildren_S);
								} else if(Cat02_on) {
									$(".ub-tooltip-cat").text("Children from birth to age 2 for whom all parents have a high school education or less");
									$(".ub-tooltip-number").text(enrr1_S);
								} else if(Cat03_on){
									$(".ub-tooltip-cat").text("Children from birth to age 2 for whom at least one parent has education beyond high school");
									$(".ub-tooltip-number").text(enrr2_S);
								} else if(Cat04_on){
									$(".ub-tooltip-cat").text("Children from birth to age 2 in low-income families");
									$(".ub-tooltip-number").text(lowinc1_S);
								} else if(Cat05_on){
									$(".ub-tooltip-cat").text("Children from birth to age 2 in higher-income families");
									$(".ub-tooltip-number").text(lowinc2_S);
								} else if(Cat06_on){
									$(".ub-tooltip-cat").text("Children from birth to age 2 with all native-born parents");
									$(".ub-tooltip-number").text(native1_S);
								} else if(Cat07_on){
									$(".ub-tooltip-cat").text("Children from birth to age 2 with at least one immigrant parent");
									$(".ub-tooltip-number").text(native2_S);
								} else {}
							
							//Show the tooltip
							$("#ub-tooltip").removeClass("hidden");
						},mouseleave:function(){
							$("#ub-tooltip").addClass("hidden");
						}
					});
                });
			};


			function funcCat01(){
				$(".ub-data h3 span.ub-data-name").text("All children from birth to age 2");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">11,625,000</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">11,625,000</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">the United States</span>');
				}else{
					var currAll = $("path[id='"+areaCurrentGlobal+"']").attr('data-allchildren');
					$('.ub-charts-container h3 .ub-cat-number').text(currAll);
					if (currAll==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 in ");
					}
				}
				greenColor.domain([0, 100, 200, 300, 400, 500, 600, 700, 800]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("In thousands");
				$(".ub-scale-0 span").text("0");
				$(".ub-scale-1 span").text("100").css("margin","32px 0 0 12px");
				$(".ub-scale-2 span").text("200").css("margin","32px 0 0 12px");
				$(".ub-scale-3 span").text("300").css("margin","32px 0 0 12px");
				$(".ub-scale-4 span").text("400").css("margin","32px 0 0 12px");
				$(".ub-scale-5 span").text("500").css("margin","32px 0 0 12px");
				$(".ub-scale-6 span").text("600").css("margin","32px 0 0 12px");
				$(".ub-scale-7 span").text("700").css("margin","32px 0 0 12px");
				$(".ub-scale-8 span").text("800");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-01").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[3];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA/1000),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[3];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[3];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
			function funcCat01_color(){
				greenColor.domain([0, 100, 200, 300, 400, 500, 600, 700, 800]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("In thousands");
				$(".ub-scale-0 span").text("0");
				if (Cat_States_on){
					$(".ub-scale-1 span").text("200").css("margin","32px 0 0 12px");
					$(".ub-scale-2 span").text("400").css("margin","32px 0 0 12px");
					$(".ub-scale-3 span").text("600").css("margin","32px 0 0 12px");
					$(".ub-scale-4 span").text("800").css("margin","32px 0 0 12px");
					$(".ub-scale-5 span").text("1,000").css("margin","32px 0 0 14px");
					$(".ub-scale-6 span").text("1,200").css("margin","32px 0 0 14px");
					$(".ub-scale-7 span").text("1,400").css("margin","32px 0 0 14px");
					$(".ub-scale-8 span").text("1,600");
				}
				if (Cat_Middle_on){
					$(".ub-scale-1 span").text("100").css("margin","32px 0 0 12px");
					$(".ub-scale-2 span").text("200").css("margin","32px 0 0 12px");
					$(".ub-scale-3 span").text("300").css("margin","32px 0 0 12px");
					$(".ub-scale-4 span").text("400").css("margin","32px 0 0 12px");
					$(".ub-scale-5 span").text("500").css("margin","32px 0 0 12px");
					$(".ub-scale-6 span").text("600").css("margin","32px 0 0 12px");
					$(".ub-scale-7 span").text("700").css("margin","32px 0 0 12px");
					$(".ub-scale-8 span").text("800");					
				}
				if (Cat_Middle_on){
					$('.ub-map-scale ul.ub-grey-scale').css("display","block");
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				}else{
					$('.ub-map-scale ul.ub-grey-scale').css("display","none");
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				}
				$(".ub-cat").removeClass("active");
				$(".ub-cat-01").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[3];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA/1000),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[3];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[3];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat02(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 for whom all parents have a high school education or less");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">3,418,000</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">3,418,000</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">the United States</span>');
				}else{
					var currEnrrolled = $("path[id='"+areaCurrentGlobal+"']").attr('data-enrolled');
					$('.ub-charts-container h3 .ub-cat-number').text(currEnrrolled);
					if (currEnrrolled==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 for whom all parents have a high school education or less in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 for whom all parents have a high school education or less in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-02").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
			function funcCat02_color(){
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				if (Cat_Middle_on){
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				}else{
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				}
				$(".ub-cat").removeClass("active");
				$(".ub-cat-02").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat03(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 for whom at least one parent has education beyond high school");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">8,159,000</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">8,159,000</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">the United States</span>');
				}else{
					var currNotEnrrolled = $("path[id='"+areaCurrentGlobal+"']").attr('data-notenrolled');
					$('.ub-charts-container h3 .ub-cat-number').text(currNotEnrrolled);
					if (currNotEnrrolled==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 for whom at least one parent has education beyond high school in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 for whom at least one parent has education beyond high school in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-03").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
			function funcCat03_color(){
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				if (Cat_Middle_on){
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				}else{
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				}
				$(".ub-cat").removeClass("active");
				$(".ub-cat-03").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat04(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 in low-income families");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">5,116,000</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">5,116,000</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">the United States</span>');
				}else{
					var currLowIncome = $("path[id='"+areaCurrentGlobal+"']").attr('data-lowincome');
					$('.ub-charts-container h3 .ub-cat-number').text(currLowIncome);
					if (currLowIncome==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 in low-income families in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 in low-income families in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-04").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
			function funcCat04_color(){
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				if (Cat_Middle_on){
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				}else{
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				}
				$(".ub-cat").removeClass("active");
				$(".ub-cat-04").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat05(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 in higher-income families");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">6,398,000</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">6,398,000</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">the United States</span>');
				}else{
					var currNotLowIncome = $("path[id='"+areaCurrentGlobal+"']").attr('data-notlowincome');
					$('.ub-charts-container h3 .ub-cat-number').text(currNotLowIncome);
					if (currNotLowIncome==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 in higher-income families in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 in higher-income families in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-05").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
			function funcCat05_color(){
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				if (Cat_Middle_on){
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				}else{
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				}
				$(".ub-cat").removeClass("active");
				$(".ub-cat-05").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat06(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 with all native-born parents");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">8,587,000</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">8,587,000</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">the United States</span>');
				}else{
					var currNative = $("path[id='"+areaCurrentGlobal+"']").attr('data-native');
					$('.ub-charts-container h3 .ub-cat-number').text(currNative);
					if (currNative==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 with all native-born parents in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 with all native-born parents in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-06").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
			function funcCat06_color(){
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				if (Cat_Middle_on){
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				}else{
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				}
				$(".ub-cat").removeClass("active");
				$(".ub-cat-06").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
	
			function funcCat07(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 with at least one immigrant parent");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">2,842,000</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">2,842,000</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">the United States</span>');
				}else{
					var currNotNative = $("path[id='"+areaCurrentGlobal+"']").attr('data-notnative');
					$('.ub-charts-container h3 .ub-cat-number').text(currNotNative);
					if (currNotNative==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 with at least one immigrant parent in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 with at least one immigrant parent in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-07").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[15];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[15];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[15];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
			function funcCat07_color(){
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				if (Cat_Middle_on){
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","block");
				}else{
					$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				}
				$(".ub-cat").removeClass("active");
				$(".ub-cat-07").addClass("active");
				var Colors=d3.selectAll("#ub-cbsa path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[15];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[15];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[15];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat01_S(){
				$(".ub-data h3 span.ub-data-name").text("All children from birth to age 2");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">11,625,000</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">11,625,000</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">the United States</span>');
				}else{
					areaCurrentGlobal112=112+areaCurrentGlobal;
					var currAll = $("path[id='"+areaCurrentGlobal112+"']").attr('data-allchildren');
					$('.ub-charts-container h3 .ub-cat-number').text(currAll);
					if (currAll==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 in ");
					}
				}
				greenColor.domain([0, 200, 400, 600, 800, 1000, 1200, 1400, 1600]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("In thousands");
				$(".ub-scale-0 span").text("0");
				$(".ub-scale-1 span").text("200").css("margin","32px 0 0 12px");
				$(".ub-scale-2 span").text("400").css("margin","32px 0 0 12px");
				$(".ub-scale-3 span").text("600").css("margin","32px 0 0 12px");
				$(".ub-scale-4 span").text("800").css("margin","32px 0 0 12px");
				$(".ub-scale-5 span").text("1,000").css("margin","32px 0 0 14px");
				$(".ub-scale-6 span").text("1,200").css("margin","32px 0 0 14px");
				$(".ub-scale-7 span").text("1,400").css("margin","32px 0 0 14px");
				$(".ub-scale-8 span").text("1,600");
				$('.ub-map-scale ul.ub-grey-scale').css("display","none");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-01").addClass("active");
				var Colors=d3.selectAll("#ub-states-national path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[2];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA/1000),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[2];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[2];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat02_S(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 for whom all parents have a high school education or less");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">3,418,000</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">3,418,000</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">the United States</span>');
				}else{
					areaCurrentGlobal112=112+areaCurrentGlobal;
					var currEnrrolled = $("path[id='"+areaCurrentGlobal112+"']").attr('data-enrolled');
					$('.ub-charts-container h3 .ub-cat-number').text(currEnrrolled);
					if (currEnrrolled==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 for whom all parents have a high school education or less in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 for whom all parents have a high school education or less in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-02").addClass("active");
				var Colors=d3.selectAll("#ub-states-national path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[9];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[9];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[9];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat03_S(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 for whom at least one parent has education beyond high school");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">8,159,000</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">8,159,000</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">the United States</span>');
				}else{
					areaCurrentGlobal112=112+areaCurrentGlobal;
					var currNotEnrrolled = $("path[id='"+areaCurrentGlobal112+"']").attr('data-notenrolled');
					$('.ub-charts-container h3 .ub-cat-number').text(currNotEnrrolled);
					if (currNotEnrrolled==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 for whom at least one parent has education beyond high school in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 for whom at least one parent has education beyond high school in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-03").addClass("active");
				var Colors=d3.selectAll("#ub-states-national path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[10];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat04_S(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 in low-income families");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">5,116,000</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">5,116,000</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">the United States</span>');
				}else{
					areaCurrentGlobal112=112+areaCurrentGlobal;
					var currLowIncome = $("path[id='"+areaCurrentGlobal112+"']").attr('data-lowincome');
					$('.ub-charts-container h3 .ub-cat-number').text(currLowIncome);
					if (currLowIncome==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 in low-income families in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 in low-income families in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-04").addClass("active");
				var Colors=d3.selectAll("#ub-states-national path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[11];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat05_S(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 in higher-income families");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">6,398,000</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">6,398,000</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">the United States</span>');
				}else{
					areaCurrentGlobal112=112+areaCurrentGlobal;
					var currNotLowIncome = $("path[id='"+areaCurrentGlobal112+"']").attr('data-notlowincome');
					$('.ub-charts-container h3 .ub-cat-number').text(currNotLowIncome);
					if (currNotLowIncome==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 in higher-income families in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 in higher-income families in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-05").addClass("active");
				var Colors=d3.selectAll("#ub-states-national path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[12];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};

			function funcCat06_S(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 with all native-born parents");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">8,587,000</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">8,587,000</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">the United States</span>');
				}else{
					areaCurrentGlobal112=112+areaCurrentGlobal;
					var currNative = $("path[id='"+areaCurrentGlobal112+"']").attr('data-native');
					$('.ub-charts-container h3 .ub-cat-number').text(currNative);
					if (currNative==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 with all native-born parents in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 with all native-born parents in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-06").addClass("active");
				var Colors=d3.selectAll("#ub-states-national path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[13];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					})
			};
			
			function funcCat07_S(){
				$(".ub-data h3 span.ub-data-name").text("Children from birth to age 2 with at least one immigrant parent");
				if (!areaCurrentGlobal) {
					$('.ub-charts-container h3').html('<span class="ub-cat-number">2,842,000</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">the United States</span>');
				}else if (areaCurrentGlobal && areaCurrentGlobal==100){
					$('.ub-charts-container h3').html('<span class="ub-cat-number">2,842,000</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">the United States</span>');
				}else{
					areaCurrentGlobal112=112+areaCurrentGlobal;
					var currNotNative = $("path[id='"+areaCurrentGlobal112+"']").attr('data-notnative');
					$('.ub-charts-container h3 .ub-cat-number').text(currNotNative);
					if (currNotNative==globalNoData) {
						$('.ub-charts-container h3 .ub-cat-category').text(" for children from birth to age 2 with at least one immigrant parent in ");
					}else{
						$('.ub-charts-container h3 .ub-cat-category').text(" children from birth to age 2 with at least one immigrant parent in ");
					}
				}
				greenColor.domain([0, 12, 25, 37, 50, 62, 75, 87, 100]);
				$(".ub-map-scale").css("display","block");
				$(".ub-map-scale p").html("&nbsp;");
				$(".ub-scale-0 span").text("0%");
				$(".ub-scale-1 span").text("12%").css("margin","32px 0 0 15px");
				$(".ub-scale-2 span").text("25%").css("margin","32px 0 0 15px");
				$(".ub-scale-3 span").text("37%").css("margin","32px 0 0 15px");
				$(".ub-scale-4 span").text("50%").css("margin","32px 0 0 15px");
				$(".ub-scale-5 span").text("62%").css("margin","32px 0 0 15px");
				$(".ub-scale-6 span").text("75%").css("margin","32px 0 0 15px");
				$(".ub-scale-7 span").text("87%").css("margin","32px 0 0 15px");
				$(".ub-scale-8 span").text("100%");
				$('.ub-map-scale ul.ub-grey-scale').css("display","block");
				$('.ub-map-scale ul.ub-grey-scale li.ub-grey-scale-2').css("display","none");
				$(".ub-cat").removeClass("active");
				$(".ub-cat-07").addClass("active");
				var Colors=d3.selectAll("#ub-states-national path").classed("ub-yellow-hover",true)
					.style("fill", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
							if (fillCBSA!=0) {
								return greenColor(round(parseFloat(fillCBSA*100),0));
							}else{
								return "#696969";
							}
						} else {
							return "transparent";
						}
					})
					.style("pointer-events", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
						} else {
							return "none";
						}
					})
					.style("stroke", function(d) {
						var fillCBSA = d.properties[14];
						if (fillCBSA) {
							return "#FFFFFF";
						} else {
							return "transparent";
						}
					});
			};
			

			function chart_01() {				
				d3.csv("data/chart01_cbsa_data_v3.csv", function(data) {
					chart01=data;
					dataset_chart_01=[];
					var lindex=0;
					var chart01li='';
					var dataChart01 = data.length;
					for (var i = 0; i < dataChart01; i++) {
						var chart01_areaid = data[i].areaFIPS;
						if (chart01_areaid==areaCurrentGlobal){
							chart01_labels=data[i].Subcategory;
							chart01_cat1=data[i].allchildren0to2;
							if (parseFloat(chart01_cat1*100)<1){chart01_cat1_print='<1%';}else if (parseFloat(chart01_cat1*100)>99 && parseFloat(chart01_cat1*100)<100){chart01_cat1_print='>99%';}else{chart01_cat1_print=d3.format(".0%")(chart01_cat1);}
							chart01_cat2=data[i].pareducHSless;
							if (parseFloat(chart01_cat2*100)<1){chart01_cat2_print='<1%';}else if (parseFloat(chart01_cat2*100)>99 && parseFloat(chart01_cat2*100)<100){chart01_cat2_print='>99%';}else{chart01_cat2_print=d3.format(".0%")(chart01_cat2);}
							chart01_cat3=data[i].parpostsec;
							if (parseFloat(chart01_cat3*100)<1){chart01_cat3_print='<1%';}else if (parseFloat(chart01_cat3*100)>99 && parseFloat(chart01_cat3*100)<100){chart01_cat3_print='>99%';}else{chart01_cat3_print=d3.format(".0%")(chart01_cat3);}
							chart01_cat4=data[i].lowincome;
							if (parseFloat(chart01_cat4*100)<1){chart01_cat4_print='<1%';}else if (parseFloat(chart01_cat4*100)>99 && parseFloat(chart01_cat4*100)<100){chart01_cat4_print='>99%';}else{chart01_cat4_print=d3.format(".0%")(chart01_cat4);}
							chart01_cat5=data[i].notlowincome;
							if (parseFloat(chart01_cat5*100)<1){chart01_cat5_print='<1%';}else if (parseFloat(chart01_cat5*100)>99 && parseFloat(chart01_cat5*100)<100){chart01_cat5_print='>99%';}else{chart01_cat5_print=d3.format(".0%")(chart01_cat5);}
							chart01_cat6=data[i].allnativebornparents;
							if (parseFloat(chart01_cat6*100)<1){chart01_cat6_print='<1%';}else if (parseFloat(chart01_cat6*100)>99 && parseFloat(chart01_cat6*100)<100){chart01_cat6_print='>99%';}else{chart01_cat6_print=d3.format(".0%")(chart01_cat6);}
							chart01_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart01_cat7*100)<1){chart01_cat7_print='<1%';}else if (parseFloat(chart01_cat7*100)>99 && parseFloat(chart01_cat7*100)<100){chart01_cat7_print='>99%';}else{chart01_cat7_print=d3.format(".0%")(chart01_cat7);}
							if(Cat01_on){
								if (chart01_cat1!=0){
									lindex+=1;
									chart01li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels+'</span><span class="ub-chart-number">'+chart01_cat1_print+'</span></li>';
									dataset_chart_01.push(parseFloat(d3.format(".1f")(chart01_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart01_cat2!=0){
									lindex+=1;
									chart01li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels+'</span><span class="ub-chart-number">'+chart01_cat2_print+'</span></li>';
									dataset_chart_01.push(parseFloat(d3.format(".1f")(chart01_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart01_cat3!=0){
									lindex+=1;
									chart01li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels+'</span><span class="ub-chart-number">'+chart01_cat3_print+'</span></li>';
									dataset_chart_01.push(parseFloat(d3.format(".1f")(chart01_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart01_cat4!=0){
									lindex+=1;
									chart01li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels+'</span><span class="ub-chart-number">'+chart01_cat4_print+'</span></li>';
									dataset_chart_01.push(parseFloat(d3.format(".1f")(chart01_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart01_cat5!=0){
									lindex+=1;
									chart01li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels+'</span><span class="ub-chart-number">'+chart01_cat5_print+'</span></li>';
									dataset_chart_01.push(parseFloat(d3.format(".1f")(chart01_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart01_cat6!=0){
									lindex+=1;
									chart01li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels+'</span><span class="ub-chart-number">'+chart01_cat6_print+'</span></li>';
									dataset_chart_01.push(parseFloat(d3.format(".1f")(chart01_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart01_cat7!=0){
									lindex+=1;
									chart01li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels+'</span><span class="ub-chart-number">'+chart01_cat7_print+'</span></li>';
									dataset_chart_01.push(parseFloat(d3.format(".1f")(chart01_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart01li!=''){
						$('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-data').html(chart01li);
						var chart01bars = d3.select('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart01bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_01)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart01bars = d3.select('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart01bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};
			
			function chart_02() {
				d3.csv("data/chart02_cbsa_data_v2.csv", function(data) {					
					chart02=data;
					dataset_chart_02=[0,0,0,0,0,0];
					var lindex=0;
					var chart02li='';
					var dataChart02 = data.length;
					for (var i = 0; i < dataChart02; i++) {
						var chart02_areaid = data[i].areaFIPS;
						if (chart02_areaid==areaCurrentGlobal){
							chart02_labels=data[i].Subcategory;
							chart02_cat1=data[i].allchildren0to2;
							if (parseFloat(chart02_cat1*100)<1){chart02_cat1_print='<1%';}else if (parseFloat(chart02_cat1*100)>99 && parseFloat(chart02_cat1*100)<100){chart02_cat1_print='>99%';}else{chart02_cat1_print=d3.format(".0%")(chart02_cat1);}
							chart02_cat2=data[i].pareducHSless;
							if (parseFloat(chart02_cat2*100)<1){chart02_cat2_print='<1%';}else if (parseFloat(chart02_cat2*100)>99 && parseFloat(chart02_cat2*100)<100){chart02_cat2_print='>99%';}else{chart02_cat2_print=d3.format(".0%")(chart02_cat2);}
							chart02_cat3=data[i].parpostsec;
							if (parseFloat(chart02_cat3*100)<1){chart02_cat3_print='<1%';}else if (parseFloat(chart02_cat3*100)>99 && parseFloat(chart02_cat3*100)<100){chart02_cat3_print='>99%';}else{chart02_cat3_print=d3.format(".0%")(chart02_cat3);}
							chart02_cat4=data[i].lowincome;
							if (parseFloat(chart02_cat4*100)<1){chart02_cat4_print='<1%';}else if (parseFloat(chart02_cat4*100)>99 && parseFloat(chart02_cat4*100)<100){chart02_cat4_print='>99%';}else{chart02_cat4_print=d3.format(".0%")(chart02_cat4);}
							chart02_cat5=data[i].notlowincome;
							if (parseFloat(chart02_cat5*100)<1){chart02_cat5_print='<1%';}else if (parseFloat(chart02_cat5*100)>99 && parseFloat(chart02_cat5*100)<100){chart02_cat5_print='>99%';}else{chart02_cat5_print=d3.format(".0%")(chart02_cat5);}
							chart02_cat6=data[i].allnativebornparents;
							if (parseFloat(chart02_cat6*100)<1){chart02_cat6_print='<1%';}else if (parseFloat(chart02_cat6*100)>99 && parseFloat(chart02_cat6*100)<100){chart02_cat6_print='>99%';}else{chart02_cat6_print=d3.format(".0%")(chart02_cat6);}
							chart02_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart02_cat7*100)<1){chart02_cat7_print='<1%';}else if (parseFloat(chart02_cat7*100)>99 && parseFloat(chart02_cat7*100)<100){chart02_cat7_print='>99%';}else{chart02_cat7_print=d3.format(".0%")(chart02_cat7);}
							if(Cat01_on){
								if (chart02_cat1!=0){
									lindex+=1;
									lindex2=chart02_labels.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels+'</span><span class="ub-chart-number">'+chart02_cat1_print+'</span></li>';
									dataset_chart_02.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart02_cat2!=0){
									lindex+=1;
									lindex2=chart02_labels.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels+'</span><span class="ub-chart-number">'+chart02_cat2_print+'</span></li>';
									dataset_chart_02.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart02_cat3!=0){
									lindex+=1;
									lindex2=chart02_labels.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels+'</span><span class="ub-chart-number">'+chart02_cat3_print+'</span></li>';
									dataset_chart_02.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart02_cat4!=0){
									lindex+=1;
									lindex2=chart02_labels.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels+'</span><span class="ub-chart-number">'+chart02_cat4_print+'</span></li>';
									dataset_chart_02.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart02_cat5!=0){
									lindex+=1;
									lindex2=chart02_labels.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels+'</span><span class="ub-chart-number">'+chart02_cat5_print+'</span></li>';
									dataset_chart_02.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart02_cat6!=0){
									lindex+=1;
									lindex2=chart02_labels.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels+'</span><span class="ub-chart-number">'+chart02_cat6_print+'</span></li>';
									dataset_chart_02.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart02_cat7!=0){
									lindex+=1;
									lindex2=chart02_labels.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels+'</span><span class="ub-chart-number">'+chart02_cat7_print+'</span></li>';
									dataset_chart_02.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart02li!=''){
						var chart02li_sorted = $(chart02li).sort(myCompare);
						$('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-data').html(chart02li_sorted);
						$('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-data li .ub-chart-label').each(function(){
							var liLong=$(this).text();
							var liShort=liLong.substring(3);
							$(this).text(liShort);
						});
						var chart02bars = d3.select('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart02bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_02)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart02bars = d3.select('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart02bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_03() {
				d3.csv("data/chart03_cbsa_data_v3.csv", function(data) {					
					chart03=data;
					dataset_chart_03=[];
					var lindex=0;
					var chart03li='';
					var dataChart03 = data.length;
					for (var i = 0; i < dataChart03; i++) {
						var chart03_areaid = data[i].areaFIPS;
						if (chart03_areaid==areaCurrentGlobal){
							chart03_labels=data[i].Subcategory;
							chart03_cat1=data[i].allchildren0to2;
							if (parseFloat(chart03_cat1*100)<1){chart03_cat1_print='<1%';}else if (parseFloat(chart03_cat1*100)>99 && parseFloat(chart03_cat1*100)<100){chart03_cat1_print='>99%';}else{chart03_cat1_print=d3.format(".0%")(chart03_cat1);}
							chart03_cat2=data[i].pareducHSless;
							if (parseFloat(chart03_cat2*100)<1){chart03_cat2_print='<1%';}else if (parseFloat(chart03_cat2*100)>99 && parseFloat(chart03_cat2*100)<100){chart03_cat2_print='>99%';}else{chart03_cat2_print=d3.format(".0%")(chart03_cat2);}
							chart03_cat3=data[i].parpostsec;
							if (parseFloat(chart03_cat3*100)<1){chart03_cat3_print='<1%';}else if (parseFloat(chart03_cat3*100)>99 && parseFloat(chart03_cat3*100)<100){chart03_cat3_print='>99%';}else{chart03_cat3_print=d3.format(".0%")(chart03_cat3);}
							chart03_cat4=data[i].lowincome;
							if (parseFloat(chart03_cat4*100)<1){chart03_cat4_print='<1%';}else if (parseFloat(chart03_cat4*100)>99 && parseFloat(chart03_cat4*100)<100){chart03_cat4_print='>99%';}else{chart03_cat4_print=d3.format(".0%")(chart03_cat4);}
							chart03_cat5=data[i].notlowincome;
							if (parseFloat(chart03_cat5*100)<1){chart03_cat5_print='<1%';}else if (parseFloat(chart03_cat5*100)>99 && parseFloat(chart03_cat5*100)<100){chart03_cat5_print='>99%';}else{chart03_cat5_print=d3.format(".0%")(chart03_cat5);}
							chart03_cat6=data[i].allnativebornparents;
							if (parseFloat(chart03_cat6*100)<1){chart03_cat6_print='<1%';}else if (parseFloat(chart03_cat6*100)>99 && parseFloat(chart03_cat6*100)<100){chart03_cat6_print='>99%';}else{chart03_cat6_print=d3.format(".0%")(chart03_cat6);}
							chart03_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart03_cat7*100)<1){chart03_cat7_print='<1%';}else if (parseFloat(chart03_cat7*100)>99 && parseFloat(chart03_cat7*100)<100){chart03_cat7_print='>99%';}else{chart03_cat7_print=d3.format(".0%")(chart03_cat7);}
							if(Cat01_on){
								if (chart03_cat1!=0){
									lindex+=1;
									chart03li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels+'</span><span class="ub-chart-number">'+chart03_cat1_print+'</span></li>';
									dataset_chart_03.push(parseFloat(d3.format(".1f")(chart03_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart03_cat2!=0){
									lindex+=1;
									chart03li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels+'</span><span class="ub-chart-number">'+chart03_cat2_print+'</span></li>';
									dataset_chart_03.push(parseFloat(d3.format(".1f")(chart03_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart03_cat3!=0){
									lindex+=1;
									chart03li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels+'</span><span class="ub-chart-number">'+chart03_cat3_print+'</span></li>';
									dataset_chart_03.push(parseFloat(d3.format(".1f")(chart03_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart03_cat4!=0){
									lindex+=1;
									chart03li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels+'</span><span class="ub-chart-number">'+chart03_cat4_print+'</span></li>';
									dataset_chart_03.push(parseFloat(d3.format(".1f")(chart03_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart03_cat5!=0){
									lindex+=1;
									chart03li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels+'</span><span class="ub-chart-number">'+chart03_cat5_print+'</span></li>';
									dataset_chart_03.push(parseFloat(d3.format(".1f")(chart03_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart03_cat6!=0){
									lindex+=1;
									chart03li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels+'</span><span class="ub-chart-number">'+chart03_cat6_print+'</span></li>';
									dataset_chart_03.push(parseFloat(d3.format(".1f")(chart03_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart03_cat7!=0){
									lindex+=1;
									chart03li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels+'</span><span class="ub-chart-number">'+chart03_cat7_print+'</span></li>';
									dataset_chart_03.push(parseFloat(d3.format(".1f")(chart03_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart03li!=''){
						$('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-data').html(chart03li);
						var chart03bars = d3.select('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart03bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_03)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts2(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart03bars = d3.select('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart03bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_04() {
				d3.csv("data/chart04_cbsa_data_v3.csv", function(data) {					
					chart04=data;
					dataset_chart_04=[];
					var lindex=0;
					var chart04li='';
					var dataChart04 = data.length;
					for (var i = 0; i < dataChart04; i++) {
						var chart04_areaid = data[i].areaFIPS;
						if (chart04_areaid==areaCurrentGlobal){
							chart04_labels=data[i].Subcategory;
							chart04_cat1=data[i].allchildren0to2;
							if (parseFloat(chart04_cat1*100)<1){chart04_cat1_print='<1%';}else if (parseFloat(chart04_cat1*100)>99 && parseFloat(chart04_cat1*100)<100){chart04_cat1_print='>99%';}else{chart04_cat1_print=d3.format(".0%")(chart04_cat1);}
							chart04_cat2=data[i].pareducHSless;
							if (parseFloat(chart04_cat2*100)<1){chart04_cat2_print='<1%';}else if (parseFloat(chart04_cat2*100)>99 && parseFloat(chart04_cat2*100)<100){chart04_cat2_print='>99%';}else{chart04_cat2_print=d3.format(".0%")(chart04_cat2);}
							chart04_cat3=data[i].parpostsec;
							if (parseFloat(chart04_cat3*100)<1){chart04_cat3_print='<1%';}else if (parseFloat(chart04_cat3*100)>99 && parseFloat(chart04_cat3*100)<100){chart04_cat3_print='>99%';}else{chart04_cat3_print=d3.format(".0%")(chart04_cat3);}
							chart04_cat4=data[i].lowincome;
							if (parseFloat(chart04_cat4*100)<1){chart04_cat4_print='<1%';}else if (parseFloat(chart04_cat4*100)>99 && parseFloat(chart04_cat4*100)<100){chart04_cat4_print='>99%';}else{chart04_cat4_print=d3.format(".0%")(chart04_cat4);}
							chart04_cat5=data[i].notlowincome;
							if (parseFloat(chart04_cat5*100)<1){chart04_cat5_print='<1%';}else if (parseFloat(chart04_cat5*100)>99 && parseFloat(chart04_cat5*100)<100){chart04_cat5_print='>99%';}else{chart04_cat5_print=d3.format(".0%")(chart04_cat5);}
							chart04_cat6=data[i].allnativebornparents;
							if (parseFloat(chart04_cat6*100)<1){chart04_cat6_print='<1%';}else if (parseFloat(chart04_cat6*100)>99 && parseFloat(chart04_cat6*100)<100){chart04_cat6_print='>99%';}else{chart04_cat6_print=d3.format(".0%")(chart04_cat6);}
							chart04_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart04_cat7*100)<1){chart04_cat7_print='<1%';}else if (parseFloat(chart04_cat7*100)>99 && parseFloat(chart04_cat7*100)<100){chart04_cat7_print='>99%';}else{chart04_cat7_print=d3.format(".0%")(chart04_cat7);}
							if(Cat01_on){
								if (chart04_cat1!=0){
									lindex+=1;
									chart04li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels+'</span><span class="ub-chart-number">'+chart04_cat1_print+'</span></li>';
									dataset_chart_04.push(parseFloat(d3.format(".1f")(chart04_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart04_cat2!=0){
									lindex+=1;
									chart04li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels+'</span><span class="ub-chart-number">'+chart04_cat2_print+'</span></li>';
									dataset_chart_04.push(parseFloat(d3.format(".1f")(chart04_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart04_cat3!=0){
									lindex+=1;
									chart04li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels+'</span><span class="ub-chart-number">'+chart04_cat3_print+'</span></li>';
									dataset_chart_04.push(parseFloat(d3.format(".1f")(chart04_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart04_cat4!=0){
									lindex+=1;
									chart04li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels+'</span><span class="ub-chart-number">'+chart04_cat4_print+'</span></li>';
									dataset_chart_04.push(parseFloat(d3.format(".1f")(chart04_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart04_cat5!=0){
									lindex+=1;
									chart04li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels+'</span><span class="ub-chart-number">'+chart04_cat5_print+'</span></li>';
									dataset_chart_04.push(parseFloat(d3.format(".1f")(chart04_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart04_cat6!=0){
									lindex+=1;
									chart04li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels+'</span><span class="ub-chart-number">'+chart04_cat6_print+'</span></li>';
									dataset_chart_04.push(parseFloat(d3.format(".1f")(chart04_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart04_cat7!=0){
									lindex+=1;
									chart04li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels+'</span><span class="ub-chart-number">'+chart04_cat7_print+'</span></li>';
									dataset_chart_04.push(parseFloat(d3.format(".1f")(chart04_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart04li!=''){
						$('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-data').html(chart04li);
						var chart04bars = d3.select('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart04bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_04)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart04bars = d3.select('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart04bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_05() {
				d3.csv("data/chart05_cbsa_data_v3.csv", function(data) {					
					chart05=data;
					dataset_chart_05=[];
					var lindex=0;
					var chart05li='';
					var dataChart05 = data.length;
					for (var i = 0; i < dataChart05; i++) {
						var chart05_areaid = data[i].areaFIPS;
						if (chart05_areaid==areaCurrentGlobal){
							chart05_labels=data[i].Subcategory;
							chart05_cat1=data[i].allchildren0to2;
							if (parseFloat(chart05_cat1*100)<1){chart05_cat1_print='<1%';}else if (parseFloat(chart05_cat1*100)>99 && parseFloat(chart05_cat1*100)<100){chart05_cat1_print='>99%';}else{chart05_cat1_print=d3.format(".0%")(chart05_cat1);}
							chart05_cat2=data[i].pareducHSless;
							if (parseFloat(chart05_cat2*100)<1){chart05_cat2_print='<1%';}else if (parseFloat(chart05_cat2*100)>99 && parseFloat(chart05_cat2*100)<100){chart05_cat2_print='>99%';}else{chart05_cat2_print=d3.format(".0%")(chart05_cat2);}
							chart05_cat3=data[i].parpostsec;
							if (parseFloat(chart05_cat3*100)<1){chart05_cat3_print='<1%';}else if (parseFloat(chart05_cat3*100)>99 && parseFloat(chart05_cat3*100)<100){chart05_cat3_print='>99%';}else{chart05_cat3_print=d3.format(".0%")(chart05_cat3);}
							chart05_cat4=data[i].lowincome;
							if (parseFloat(chart05_cat4*100)<1){chart05_cat4_print='<1%';}else if (parseFloat(chart05_cat4*100)>99 && parseFloat(chart05_cat4*100)<100){chart05_cat4_print='>99%';}else{chart05_cat4_print=d3.format(".0%")(chart05_cat4);}
							chart05_cat5=data[i].notlowincome;
							if (parseFloat(chart05_cat5*100)<1){chart05_cat5_print='<1%';}else if (parseFloat(chart05_cat5*100)>99 && parseFloat(chart05_cat5*100)<100){chart05_cat5_print='>99%';}else{chart05_cat5_print=d3.format(".0%")(chart05_cat5);}
							chart05_cat6=data[i].allnativebornparents;
							if (parseFloat(chart05_cat6*100)<1){chart05_cat6_print='<1%';}else if (parseFloat(chart05_cat6*100)>99 && parseFloat(chart05_cat6*100)<100){chart05_cat6_print='>99%';}else{chart05_cat6_print=d3.format(".0%")(chart05_cat6);}
							chart05_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart05_cat7*100)<1){chart05_cat7_print='<1%';}else if (parseFloat(chart05_cat7*100)>99 && parseFloat(chart05_cat7*100)<100){chart05_cat7_print='>99%';}else{chart05_cat7_print=d3.format(".0%")(chart05_cat7);}
							if(Cat01_on){
								if (chart05_cat1!=0){
									lindex+=1;
									chart05li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels+'</span><span class="ub-chart-number">'+chart05_cat1_print+'</span></li>';
									dataset_chart_05.push(parseFloat(d3.format(".1f")(chart05_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart05_cat2!=0){
									lindex+=1;
									chart05li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels+'</span><span class="ub-chart-number">'+chart05_cat2_print+'</span></li>';
									dataset_chart_05.push(parseFloat(d3.format(".1f")(chart05_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart05_cat3!=0){
									lindex+=1;
									chart05li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels+'</span><span class="ub-chart-number">'+chart05_cat3_print+'</span></li>';
									dataset_chart_05.push(parseFloat(d3.format(".1f")(chart05_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart05_cat4!=0){
									lindex+=1;
									chart05li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels+'</span><span class="ub-chart-number">'+chart05_cat4_print+'</span></li>';
									dataset_chart_05.push(parseFloat(d3.format(".1f")(chart05_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart05_cat5!=0){
									lindex+=1;
									chart05li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels+'</span><span class="ub-chart-number">'+chart05_cat5_print+'</span></li>';
									dataset_chart_05.push(parseFloat(d3.format(".1f")(chart05_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart05_cat6!=0){
									lindex+=1;
									chart05li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels+'</span><span class="ub-chart-number">'+chart05_cat6_print+'</span></li>';
									dataset_chart_05.push(parseFloat(d3.format(".1f")(chart05_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart05_cat7!=0){
									lindex+=1;
									chart05li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels+'</span><span class="ub-chart-number">'+chart05_cat7_print+'</span></li>';
									dataset_chart_05.push(parseFloat(d3.format(".1f")(chart05_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart05li!=''){
						$('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-data').html(chart05li);
						var chart05bars = d3.select('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart05bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_05)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart05bars = d3.select('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart05bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};
			
			function chart_06() {
				d3.csv("data/chart06_cbsa_data_v3.csv", function(data) {					
					chart06=data;
					dataset_chart_06=[];
					var lindex=0;
					var chart06li='';
					var dataChart06 = data.length;
					for (var i = 0; i < dataChart06; i++) {
						var chart06_areaid = data[i].areaFIPS;
						if (chart06_areaid==areaCurrentGlobal){
							chart06_labels=data[i].Subcategory;
							chart06_cat1=data[i].allchildren0to2;
							if (parseFloat(chart06_cat1*100)<1){chart06_cat1_print='<1%';}else if (parseFloat(chart06_cat1*100)>99 && parseFloat(chart06_cat1*100)<100){chart06_cat1_print='>99%';}else{chart06_cat1_print=d3.format(".0%")(chart06_cat1);}
							chart06_cat2=data[i].pareducHSless;
							if (parseFloat(chart06_cat2*100)<1){chart06_cat2_print='<1%';}else if (parseFloat(chart06_cat2*100)>99 && parseFloat(chart06_cat2*100)<100){chart06_cat2_print='>99%';}else{chart06_cat2_print=d3.format(".0%")(chart06_cat2);}
							chart06_cat3=data[i].parpostsec;
							if (parseFloat(chart06_cat3*100)<1){chart06_cat3_print='<1%';}else if (parseFloat(chart06_cat3*100)>99 && parseFloat(chart06_cat3*100)<100){chart06_cat3_print='>99%';}else{chart06_cat3_print=d3.format(".0%")(chart06_cat3);}
							chart06_cat4=data[i].lowincome;
							if (parseFloat(chart06_cat4*100)<1){chart06_cat4_print='<1%';}else if (parseFloat(chart06_cat4*100)>99 && parseFloat(chart06_cat4*100)<100){chart06_cat4_print='>99%';}else{chart06_cat4_print=d3.format(".0%")(chart06_cat4);}
							chart06_cat5=data[i].notlowincome;
							if (parseFloat(chart06_cat5*100)<1){chart06_cat5_print='<1%';}else if (parseFloat(chart06_cat5*100)>99 && parseFloat(chart06_cat5*100)<100){chart06_cat5_print='>99%';}else{chart06_cat5_print=d3.format(".0%")(chart06_cat5);}
							chart06_cat6=data[i].allnativebornparents;
							if (parseFloat(chart06_cat6*100)<1){chart06_cat6_print='<1%';}else if (parseFloat(chart06_cat6*100)>99 && parseFloat(chart06_cat6*100)<100){chart06_cat6_print='>99%';}else{chart06_cat6_print=d3.format(".0%")(chart06_cat6);}
							chart06_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart06_cat7*100)<1){chart06_cat7_print='<1%';}else if (parseFloat(chart06_cat7*100)>99 && parseFloat(chart06_cat67*100)<100){chart06_cat7_print='>99%';}else{chart06_cat7_print=d3.format(".0%")(chart06_cat7);}
							if(Cat01_on){
								if (chart06_cat1!=0){
									lindex+=1;
									chart06li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels+'</span><span class="ub-chart-number">'+chart06_cat1_print+'</span></li>';
									dataset_chart_06.push(parseFloat(d3.format(".1f")(chart06_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart06_cat2!=0){
									lindex+=1;
									chart06li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels+'</span><span class="ub-chart-number">'+chart06_cat2_print+'</span></li>';
									dataset_chart_06.push(parseFloat(d3.format(".1f")(chart06_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart06_cat3!=0){
									lindex+=1;
									chart06li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels+'</span><span class="ub-chart-number">'+chart06_cat3_print+'</span></li>';
									dataset_chart_06.push(parseFloat(d3.format(".1f")(chart06_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart06_cat4!=0){
									lindex+=1;
									chart06li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels+'</span><span class="ub-chart-number">'+chart06_cat4_print+'</span></li>';
									dataset_chart_06.push(parseFloat(d3.format(".1f")(chart06_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart06_cat5!=0){
									lindex+=1;
									chart06li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels+'</span><span class="ub-chart-number">'+chart06_cat5_print+'</span></li>';
									dataset_chart_06.push(parseFloat(d3.format(".1f")(chart06_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart06_cat6!=0){
									lindex+=1;
									chart06li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels+'</span><span class="ub-chart-number">'+chart06_cat6_print+'</span></li>';
									dataset_chart_06.push(parseFloat(d3.format(".1f")(chart06_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart06_cat7!=0){
									lindex+=1;
									chart06li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels+'</span><span class="ub-chart-number">'+chart06_cat7_print+'</span></li>';
									dataset_chart_06.push(parseFloat(d3.format(".1f")(chart06_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart06li!=''){
						$('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-data').html(chart06li);
						var chart06bars = d3.select('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart06bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_06)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart06bars = d3.select('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart06bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};
			
			function chart_07() {
				d3.csv("data/chart07_cbsa_data_v2.csv", function(data) {					
					chart07=data;
					dataset_chart_07=[];
					var lindex=0;
					var chart07li='';
					var dataChart07 = data.length;
					for (var i = 0; i < dataChart07; i++) {
						var chart07_areaid = data[i].areaFIPS;
						if (chart07_areaid==areaCurrentGlobal){
							chart07_labels=data[i].Subcategory;
							chart07_cat1=data[i].allchildren0to2;
							if (parseFloat(chart07_cat1*100)<1){chart07_cat1_print='<1%';}else if (parseFloat(chart07_cat1*100)>99 && parseFloat(chart07_cat1*100)<100){chart07_cat1_print='>99%';}else{chart07_cat1_print=d3.format(".0%")(chart07_cat1);}
							chart07_cat2=data[i].pareducHSless;
							if (parseFloat(chart07_cat2*100)<1){chart07_cat2_print='<1%';}else if (parseFloat(chart07_cat2*100)>99 && parseFloat(chart07_cat2*100)<100){chart07_cat2_print='>99%';}else{chart07_cat2_print=d3.format(".0%")(chart07_cat2);}
							chart07_cat3=data[i].parpostsec;
							if (parseFloat(chart07_cat3*100)<1){chart07_cat3_print='<1%';}else if (parseFloat(chart07_cat3*100)>99 && parseFloat(chart07_cat3*100)<100){chart07_cat3_print='>99%';}else{chart07_cat3_print=d3.format(".0%")(chart07_cat3);}
							chart07_cat4=data[i].lowincome;
							if (parseFloat(chart07_cat4*100)<1){chart07_cat4_print='<1%';}else if (parseFloat(chart07_cat4*100)>99 && parseFloat(chart07_cat4*100)<100){chart07_cat4_print='>99%';}else{chart07_cat4_print=d3.format(".0%")(chart07_cat4);}
							chart07_cat5=data[i].notlowincome;
							if (parseFloat(chart07_cat5*100)<1){chart07_cat5_print='<1%';}else if (parseFloat(chart07_cat5*100)>99 && parseFloat(chart07_cat5*100)<100){chart07_cat5_print='>99%';}else{chart07_cat5_print=d3.format(".0%")(chart07_cat5);}
							chart07_cat6=data[i].allnativebornparents;
							if (parseFloat(chart07_cat6*100)<1){chart07_cat6_print='<1%';}else if (parseFloat(chart07_cat6*100)>99 && parseFloat(chart07_cat6*100)<100){chart07_cat6_print='>99%';}else{chart07_cat6_print=d3.format(".0%")(chart07_cat6);}
							chart07_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart07_cat7*100)<1){chart07_cat7_print='<1%';}else if (parseFloat(chart07_cat7*100)>99 && parseFloat(chart07_cat7*100)<100){chart07_cat7_print='>99%';}else{chart07_cat7_print=d3.format(".0%")(chart07_cat7);}
							if(Cat01_on){
								if (chart07_cat1!=0){
									lindex+=1;
									chart07li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels+'</span><span class="ub-chart-number">'+chart07_cat1_print+'</span></li>';
									dataset_chart_07.push(parseFloat(d3.format(".1f")(chart07_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart07_cat2!=0){
									lindex+=1;
									chart07li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels+'</span><span class="ub-chart-number">'+chart07_cat2_print+'</span></li>';
									dataset_chart_07.push(parseFloat(d3.format(".1f")(chart07_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart07_cat3!=0){
									lindex+=1;
									chart07li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels+'</span><span class="ub-chart-number">'+chart07_cat3_print+'</span></li>';
									dataset_chart_07.push(parseFloat(d3.format(".1f")(chart07_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart07_cat4!=0){
									lindex+=1;
									chart07li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels+'</span><span class="ub-chart-number">'+chart07_cat4_print+'</span></li>';
									dataset_chart_07.push(parseFloat(d3.format(".1f")(chart07_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart07_cat5!=0){
									lindex+=1;
									chart07li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels+'</span><span class="ub-chart-number">'+chart07_cat5_print+'</span></li>';
									dataset_chart_07.push(parseFloat(d3.format(".1f")(chart07_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart07_cat6!=0){
									lindex+=1;
									chart07li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels+'</span><span class="ub-chart-number">'+chart07_cat6_print+'</span></li>';
									dataset_chart_07.push(parseFloat(d3.format(".1f")(chart07_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart07_cat7!=0){
									lindex+=1;
									chart07li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels+'</span><span class="ub-chart-number">'+chart07_cat7_print+'</span></li>';
									dataset_chart_07.push(parseFloat(d3.format(".1f")(chart07_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart07li!=''){
						$('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-data').html(chart07li);
						var chart07bars = d3.select('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart07bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_07)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart07bars = d3.select('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart07bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_08() {
				d3.csv("data/chart08_cbsa_data_v2.csv", function(data) {					
					chart08=data;
					dataset_chart_08=[];
					var lindex=0;
					var chart08li='';
					var dataChart08 = data.length;
					for (var i = 0; i < dataChart08; i++) {
						var chart08_areaid = data[i].areaFIPS;
						if (chart08_areaid==areaCurrentGlobal){
							chart08_labels=data[i].Subcategory;
							chart08_cat1=data[i].allchildren0to2;
							if (parseFloat(chart08_cat1*100)<1){chart08_cat1_print='<1%';}else if (parseFloat(chart08_cat1*100)>99 && parseFloat(chart08_cat1*100)<100){chart08_cat1_print='>99%';}else{chart08_cat1_print=d3.format(".0%")(chart08_cat1);}
							chart08_cat2=data[i].pareducHSless;
							if (parseFloat(chart08_cat2*100)<1){chart08_cat2_print='<1%';}else if (parseFloat(chart08_cat2*100)>99 && parseFloat(chart08_cat2*100)<100){chart08_cat2_print='>99%';}else{chart08_cat2_print=d3.format(".0%")(chart08_cat2);}
							chart08_cat3=data[i].parpostsec;
							if (parseFloat(chart08_cat3*100)<1){chart08_cat3_print='<1%';}else if (parseFloat(chart08_cat3*100)>99 && parseFloat(chart08_cat3*100)<100){chart08_cat3_print='>99%';}else{chart08_cat3_print=d3.format(".0%")(chart08_cat3);}
							chart08_cat4=data[i].lowincome;
							if (parseFloat(chart08_cat4*100)<1){chart08_cat4_print='<1%';}else if (parseFloat(chart08_cat4*100)>99 && parseFloat(chart08_cat4*100)<100){chart08_cat4_print='>99%';}else{chart08_cat4_print=d3.format(".0%")(chart08_cat4);}
							chart08_cat5=data[i].notlowincome;
							if (parseFloat(chart08_cat5*100)<1){chart08_cat5_print='<1%';}else if (parseFloat(chart08_cat5*100)>99 && parseFloat(chart08_cat5*100)<100){chart08_cat5_print='>99%';}else{chart08_cat5_print=d3.format(".0%")(chart08_cat5);}
							chart08_cat6=data[i].allnativebornparents;
							if (parseFloat(chart08_cat6*100)<1){chart08_cat6_print='<1%';}else if (parseFloat(chart08_cat6*100)>99 && parseFloat(chart08_cat6*100)<100){chart08_cat6_print='>99%';}else{chart08_cat6_print=d3.format(".0%")(chart08_cat6);}
							chart08_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart08_cat7*100)<1){chart08_cat7_print='<1%';}else if (parseFloat(chart08_cat7*100)>99 && parseFloat(chart08_cat7*100)<100){chart08_cat7_print='>99%';}else{chart08_cat7_print=d3.format(".0%")(chart08_cat7);}
							if(Cat01_on){	
								if (chart08_cat1!=0){
									lindex+=1;
									chart08li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels+'</span><span class="ub-chart-number">'+chart08_cat1_print+'</span></li>';
									dataset_chart_08.push(parseFloat(d3.format(".1f")(chart08_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart08_cat2!=0){
									lindex+=1;
									chart08li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels+'</span><span class="ub-chart-number">'+chart08_cat2_print+'</span></li>';
									dataset_chart_08.push(parseFloat(d3.format(".1f")(chart08_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart08_cat3!=0){
									lindex+=1;
									chart08li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels+'</span><span class="ub-chart-number">'+chart08_cat3_print+'</span></li>';
									dataset_chart_08.push(parseFloat(d3.format(".1f")(chart08_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart08_cat4!=0){
									lindex+=1;
									chart08li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels+'</span><span class="ub-chart-number">'+chart08_cat4_print+'</span></li>';
									dataset_chart_08.push(parseFloat(d3.format(".1f")(chart08_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart08_cat5!="0"){
									lindex+=1;
									chart08li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels+'</span><span class="ub-chart-number">'+chart08_cat5_print+'</span></li>';
									dataset_chart_08.push(parseFloat(d3.format(".1f")(chart08_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart08_cat6!=0){
									lindex+=1;
									chart08li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels+'</span><span class="ub-chart-number">'+chart08_cat6_print+'</span></li>';
									dataset_chart_08.push(parseFloat(d3.format(".1f")(chart08_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart08_cat7!=0){
									lindex+=1;
									chart08li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels+'</span><span class="ub-chart-number">'+chart08_cat7_print+'</span></li>';
									dataset_chart_08.push(parseFloat(d3.format(".1f")(chart08_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart08li!=''){
						$('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-data').html(chart08li);
						var chart08bars = d3.select('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart08bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_08)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart08bars = d3.select('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart08bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_09() {
				d3.csv("data/chart09_cbsa_data_v2.csv", function(data) {					
					chart09=data;
					dataset_chart_09=[];
					var lindex=0;
					var chart09li='';
					var dataChart09 = data.length;
					for (var i = 0; i < dataChart09; i++) {
						var chart09_areaid = data[i].areaFIPS;
						if (chart09_areaid==areaCurrentGlobal){
							chart09_labels=data[i].Subcategory;
							chart09_cat1=data[i].allchildren0to2;
							if (parseFloat(chart09_cat1*100)<1){chart09_cat1_print='<1%';}else if (parseFloat(chart09_cat1*100)>99 && parseFloat(chart09_cat1*100)<100){chart09_cat1_print='>99%';}else{chart09_cat1_print=d3.format(".0%")(chart09_cat1);}
							chart09_cat2=data[i].pareducHSless;
							if (parseFloat(chart09_cat2*100)<1){chart09_cat2_print='<1%';}else if (parseFloat(chart09_cat2*100)>99 && parseFloat(chart09_cat2*100)<100){chart09_cat2_print='>99%';}else{chart09_cat2_print=d3.format(".0%")(chart09_cat2);}
							chart09_cat3=data[i].parpostsec;
							if (parseFloat(chart09_cat3*100)<1){chart09_cat3_print='<1%';}else if (parseFloat(chart09_cat3*100)>99 && parseFloat(chart09_cat3*100)<100){chart09_cat3_print='>99%';}else{chart09_cat3_print=d3.format(".0%")(chart09_cat3);}
							chart09_cat4=data[i].lowincome;
							if (parseFloat(chart09_cat4*100)<1){chart09_cat4_print='<1%';}else if (parseFloat(chart09_cat4*100)>99 && parseFloat(chart09_cat4*100)<100){chart09_cat4_print='>99%';}else{chart09_cat4_print=d3.format(".0%")(chart09_cat4);}
							chart09_cat5=data[i].notlowincome;
							if (parseFloat(chart09_cat5*100)<1){chart09_cat5_print='<1%';}else if (parseFloat(chart09_cat5*100)>99 && parseFloat(chart09_cat5*100)<100){chart09_cat5_print='>99%';}else{chart09_cat5_print=d3.format(".0%")(chart09_cat5);}
							chart09_cat6=data[i].allnativebornparents;
							if (parseFloat(chart09_cat6*100)<1){chart09_cat6_print='<1%';}else if (parseFloat(chart09_cat6*100)>99 && parseFloat(chart09_cat5*100)<100){chart09_cat6_print='>99%';}else{chart09_cat6_print=d3.format(".0%")(chart09_cat6);}
							chart09_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart09_cat7*100)<1){chart09_cat7_print='<1%';}else if (parseFloat(chart09_cat7*100)>99 && parseFloat(chart09_cat7*100)<100){chart09_cat7_print='>99%';}else{chart09_cat7_print=d3.format(".0%")(chart09_cat7);}
							if(Cat01_on){
								if (chart09_cat1!=0){
									lindex+=1;
									chart09li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels+'</span><span class="ub-chart-number">'+chart09_cat1_print+'</span></li>';
									dataset_chart_09.push(parseFloat(d3.format(".1f")(chart09_cat1*100)));
								}
							}else if(Cat02_on){
								if (chart09_cat2!=0){
									lindex+=1;
									chart09li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels+'</span><span class="ub-chart-number">'+chart09_cat2_print+'</span></li>';
									dataset_chart_09.push(parseFloat(d3.format(".1f")(chart09_cat2*100)));
								}
							}else if(Cat03_on){
								if (chart09_cat3!=0){
									lindex+=1;
									chart09li += '<li class="ub-chart-row-0'+lindex+'"<span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels+'</span><span class="ub-chart-number">'+chart09_cat3_print+'</span></li>';
									dataset_chart_09.push(parseFloat(d3.format(".1f")(chart09_cat3*100)));
								}
							}else if(Cat04_on){
								if (chart09_cat4!=0){
									lindex+=1;
									chart09li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels+'</span><span class="ub-chart-number">'+chart09_cat4_print+'</span></li>';
									dataset_chart_09.push(parseFloat(d3.format(".1f")(chart09_cat4*100)));
								}
							}else if(Cat05_on){
								if (chart09_cat5!=0){
									lindex+=1;
									chart09li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels+'</span><span class="ub-chart-number">'+chart09_cat5_print+'</span></li>';
									dataset_chart_09.push(parseFloat(d3.format(".1f")(chart09_cat5*100)));
								}
							}else if(Cat06_on){
								if (chart09_cat6!=0){
									lindex+=1;
									chart09li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels+'</span><span class="ub-chart-number">'+chart09_cat6_print+'</span></li>';
									dataset_chart_09.push(parseFloat(d3.format(".1f")(chart09_cat6*100)));
								}
							}else if(Cat07_on){
								if (chart09_cat7!=0){
									lindex+=1;
									chart09li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels+'</span><span class="ub-chart-number">'+chart09_cat7_print+'</span></li>';
									dataset_chart_09.push(parseFloat(d3.format(".1f")(chart09_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart09li!=''){
						$('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-data').html(chart09li);
						var chart09bars = d3.select('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart09bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_09)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts2(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart09bars = d3.select('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart09bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};
			
			function chart_10() {
				d3.csv("data/chart10_cbsa_data_v3.csv", function(data) {					
					chart10=data;
					dataset_chart_10=[];
					var lindex=0;
					var chart10li='';
					var dataChart10 = data.length;
					for (var i = 0; i < dataChart10; i++) {
						var chart10_areaid = data[i].areaFIPS;
						if (chart10_areaid==areaCurrentGlobal){
							chart10_labels=data[i].Subcategory;
							chart10_cat1=data[i].allchildren0to2;
							if (parseFloat(chart10_cat1*100)<1){chart10_cat1_print='<1%';}else if (parseFloat(chart10_cat1*100)>99 && parseFloat(chart10_cat1*100)<100){chart10_cat1_print='>99%';}else{chart10_cat1_print=d3.format(".0%")(chart10_cat1);}
							chart10_cat2=data[i].pareducHSless;
							if (parseFloat(chart10_cat2*100)<1){chart10_cat2_print='<1%';}else if (parseFloat(chart10_cat2*100)>99 && parseFloat(chart10_cat2*100)<100){chart10_cat2_print='>99%';}else{chart10_cat2_print=d3.format(".0%")(chart10_cat2);}
							chart10_cat3=data[i].parpostsec;
							if (parseFloat(chart10_cat3*100)<1){chart10_cat3_print='<1%';}else if (parseFloat(chart10_cat3*100)>99 && parseFloat(chart10_cat3*100)<100){chart10_cat3_print='>99%';}else{chart10_cat3_print=d3.format(".0%")(chart10_cat3);}
							chart10_cat4=data[i].lowincome;
							if (parseFloat(chart10_cat4*100)<1){chart10_cat4_print='<1%';}else if (parseFloat(chart10_cat4*100)>99 && parseFloat(chart10_cat4*100)<100){chart10_cat4_print='>99%';}else{chart10_cat4_print=d3.format(".0%")(chart10_cat4);}
							chart10_cat5=data[i].notlowincome;
							if (parseFloat(chart10_cat5*100)<1){chart10_cat5_print='<1%';}else if (parseFloat(chart10_cat5*100)>99 && parseFloat(chart10_cat5*100)<100){chart10_cat5_print='>99%';}else{chart10_cat5_print=d3.format(".0%")(chart10_cat5);}
							chart10_cat6=data[i].allnativebornparents;
							if (parseFloat(chart10_cat6*100)<1){chart10_cat6_print='<1%';}else if (parseFloat(chart10_cat6*100)>99 && parseFloat(chart10_cat6*100)<100){chart10_cat6_print='>99%';}else{chart10_cat6_print=d3.format(".0%")(chart10_cat6);}
							chart10_cat7=data[i].atleast1immigparent;
							if (parseFloat(chart10_cat7*100)<1){chart10_cat7_print='<1%';}else if (parseFloat(chart10_cat7*100)>99 && parseFloat(chart10_cat7*100)<100){chart10_cat7_print='>99%';}else{chart10_cat7_print=d3.format(".0%")(chart10_cat7);}
							if(Cat01_on){
								if (!isNaN(chart10_cat1) && chart10_cat1!=0){
									lindex+=1;
									chart10li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels+'</span><span class="ub-chart-number">'+chart10_cat1_print+'</span></li>';
									dataset_chart_10.push(parseFloat(d3.format(".1f")(chart10_cat1*100)));
								}
							}else if(Cat02_on){
								if (!isNaN(chart10_cat2) && chart10_cat2!=0){
									lindex+=1;
									chart10li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels+'</span><span class="ub-chart-number">'+chart10_cat2_print+'</span></li>';
									dataset_chart_10.push(parseFloat(d3.format(".1f")(chart10_cat2*100)));
								}
							}else if(Cat03_on){
								if (!isNaN(chart10_cat3) && chart10_cat3!=0){
									lindex+=1;
									chart10li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels+'</span><span class="ub-chart-number">'+chart10_cat3_print+'</span></li>';
									dataset_chart_10.push(parseFloat(d3.format(".1f")(chart10_cat3*100)));
								}
							}else if(Cat04_on){
								if (!isNaN(chart10_cat4) && chart10_cat4!=0){
									lindex+=1;
									chart10li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels+'</span><span class="ub-chart-number">'+chart10_cat4_print+'</span></li>';
									dataset_chart_10.push(parseFloat(d3.format(".1f")(chart10_cat4*100)));
								}
							}else if(Cat05_on){
								if (!isNaN(chart10_cat5) && chart10_cat5!=0){
									lindex+=1;
									chart10li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels+'</span><span class="ub-chart-number">'+chart10_cat5_print+'</span></li>';
									dataset_chart_10.push(parseFloat(d3.format(".1f")(chart10_cat5*100)));
								}
							}else if(Cat06_on){
								if (!isNaN(chart10_cat6) && chart10_cat6!=0){
									lindex+=1;
									chart10li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels+'</span><span class="ub-chart-number">'+chart10_cat6_print+'</span></li>';
									dataset_chart_10.push(parseFloat(d3.format(".1f")(chart10_cat6*100)));
								}
							}else if(Cat07_on){
								if (!isNaN(chart10_cat7) && chart10_cat7!=0){
									lindex+=1;
									chart10li += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels+'</span><span class="ub-chart-number">'+chart10_cat7_print+'</span></li>';
									dataset_chart_10.push(parseFloat(d3.format(".1f")(chart10_cat7*100)));
								}
							}else{			

							}
						}
					}
					if (chart10li!=''){
						$('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-data').html(chart10li);
						var chart10bars = d3.select('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart10bars
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_10)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart10bars = d3.select('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart10bars
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};
			
			function chart_01_S() {				
				d3.csv("data/chart01_state_data_v3.csv", function(data) {
					chart01_S=data;
					dataset_chart_01_S=[];
					var lindex=0;
					var chart01li_S='';
					var dataChart01_S = data.length;
					for (var i = 0; i < dataChart01_S; i++) {
						var chart01_areaid_S = data[i].areaFIPS;
						if (chart01_areaid_S==areaCurrentGlobal){
							chart01_labels_S=data[i].Subcategory;
							chart01_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart01_cat1_S*100)<1){chart01_cat1_S_print='<1%';}else if (parseFloat(chart01_cat1_S*100)>99 && parseFloat(chart01_cat1_S*100)<100){chart01_cat1_S_print='>99%';}else{chart01_cat1_S_print=d3.format(".0%")(chart01_cat1_S);}
							chart01_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart01_cat2_S*100)<1){chart01_cat2_S_print='<1%';}else if (parseFloat(chart01_cat2_S*100)>99 && parseFloat(chart01_cat2_S*100)<100){chart01_cat2_S_print='>99%';}else{chart01_cat2_S_print=d3.format(".0%")(chart01_cat2_S);}
							chart01_cat3_S=data[i].parpostsec;
							if (parseFloat(chart01_cat3_S*100)<1){chart01_cat3_S_print='<1%';}else if (parseFloat(chart01_cat3_S*100)>99 && parseFloat(chart01_cat3_S*100)<100){chart01_cat3_S_print='>99%';}else{chart01_cat3_S_print=d3.format(".0%")(chart01_cat3_S);}
							chart01_cat4_S=data[i].lowincome;
							if (parseFloat(chart01_cat4_S*100)<1){chart01_cat4_S_print='<1%';}else if (parseFloat(chart01_cat4_S*100)>99 && parseFloat(chart01_cat4_S*100)<100){chart01_cat4_S_print='>99%';}else{chart01_cat4_S_print=d3.format(".0%")(chart01_cat4_S);}
							chart01_cat5_S=data[i].notlowincome;
							if (parseFloat(chart01_cat5_S*100)<1){chart01_cat5_S_print='<1%';}else if (parseFloat(chart01_cat5_S*100)>99 && parseFloat(chart01_cat5_S*100)<100){chart01_cat5_S_print='>99%';}else{chart01_cat5_S_print=d3.format(".0%")(chart01_cat5_S);}
							chart01_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart01_cat6_S*100)<1){chart01_cat6_S_print='<1%';}else if (parseFloat(chart01_cat6_S*100)>99 && parseFloat(chart01_cat6_S*100)<100){chart01_cat6_S_print='>99%';}else{chart01_cat6_S_print=d3.format(".0%")(chart01_cat6_S);}
							chart01_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart01_cat7_S*100)<1){chart01_cat7_S_print='<1%';}else if (parseFloat(chart01_cat7_S*100)>99 && parseFloat(chart01_cat7_S*100)<100){chart01_cat7_S_print='>99%';}else{chart01_cat7_S_print=d3.format(".0%")(chart01_cat7_S);}
							if(Cat01_on){
								if (chart01_cat1_S!=0){
									lindex+=1;
									chart01li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels_S+'</span><span class="ub-chart-number">'+chart01_cat1_S_print+'</span></li>';
									dataset_chart_01_S.push(parseFloat(d3.format(".1f")(chart01_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart01_cat2_S!=0){
									lindex+=1;
									chart01li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels_S+'</span><span class="ub-chart-number">'+chart01_cat2_S_print+'</span></li>';
									dataset_chart_01_S.push(parseFloat(d3.format(".1f")(chart01_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart01_cat3_S!=0){
									lindex+=1;
									chart01li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels_S+'</span><span class="ub-chart-number">'+chart01_cat3_S_print+'</span></li>';
									dataset_chart_01_S.push(parseFloat(d3.format(".1f")(chart01_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart01_cat4_S!=0){
									lindex+=1;
									chart01li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels_S+'</span><span class="ub-chart-number">'+chart01_cat4_S_print+'</span></li>';
									dataset_chart_01_S.push(parseFloat(d3.format(".1f")(chart01_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart01_cat5_S!=0){
									lindex+=1;
									chart01li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels_S+'</span><span class="ub-chart-number">'+chart01_cat5_S_print+'</span></li>';
									dataset_chart_01_S.push(parseFloat(d3.format(".1f")(chart01_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart01_cat6_S!=0){
									lindex+=1;
									chart01li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels_S+'</span><span class="ub-chart-number">'+chart01_cat6_S_print+'</span></li>';
									dataset_chart_01_S.push(parseFloat(d3.format(".1f")(chart01_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart01_cat7_S!=0){
									lindex+=1;
									chart01li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart01_labels_S+'</span><span class="ub-chart-number">'+chart01_cat7_S_print+'</span></li>';
									dataset_chart_01_S.push(parseFloat(d3.format(".1f")(chart01_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart01li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-data').html(chart01li_S);
						var chart01bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart01bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_01_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart01bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-01 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart01bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_02_S() {				
				d3.csv("data/chart02_state_data_v2.csv", function(data) {
					chart02_S=data;
					dataset_chart_02_S=[0,0,0,0,0,0];
					var lindex=0;
					var chart02li_S='';
					var dataChart02_S = data.length;
					for (var i = 0; i < dataChart02_S; i++) {
						var chart02_areaid_S = data[i].areaFIPS;
						if (chart02_areaid_S==areaCurrentGlobal){
							chart02_labels_S=data[i].Subcategory;
							chart02_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart02_cat1_S*100)<1){chart02_cat1_S_print='<1%';}else if (parseFloat(chart02_cat1_S*100)>99 && parseFloat(chart02_cat1_S*100)<100){chart02_cat1_S_print='>99%';}else{chart02_cat1_S_print=d3.format(".0%")(chart02_cat1_S);}
							chart02_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart02_cat2_S*100)<1){chart02_cat2_S_print='<1%';}else if (parseFloat(chart02_cat2_S*100)>99 && parseFloat(chart02_cat2_S*100)<100){chart02_cat2_S_print='>99%';}else{chart02_cat2_S_print=d3.format(".0%")(chart02_cat2_S);}
							chart02_cat3_S=data[i].parpostsec;
							if (parseFloat(chart02_cat3_S*100)<1){chart02_cat3_S_print='<1%';}else if (parseFloat(chart02_cat3_S*100)>99 && parseFloat(chart02_cat3_S*100)<100){chart02_cat3_S_print='>99%';}else{chart02_cat3_S_print=d3.format(".0%")(chart02_cat3_S);}
							chart02_cat4_S=data[i].lowincome;
							if (parseFloat(chart02_cat4_S*100)<1){chart02_cat4_S_print='<1%';}else if (parseFloat(chart02_cat4_S*100)>99 && parseFloat(chart02_cat4_S*100)<100){chart02_cat4_S_print='>99%';}else{chart02_cat4_S_print=d3.format(".0%")(chart02_cat4_S);}
							chart02_cat5_S=data[i].notlowincome;
							if (parseFloat(chart02_cat5_S*100)<1){chart02_cat5_S_print='<1%';}else if (parseFloat(chart02_cat5_S*100)>99 && parseFloat(chart02_cat5_S*100)<100){chart02_cat5_S_print='>99%';}else{chart02_cat5_S_print=d3.format(".0%")(chart02_cat5_S);}
							chart02_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart02_cat6_S*100)<1){chart02_cat6_S_print='<1%';}else if (parseFloat(chart02_cat6_S*100)>99 && parseFloat(chart02_cat6_S*100)<100){chart02_cat6_S_print='>99%';}else{chart02_cat6_S_print=d3.format(".0%")(chart02_cat6_S);}
							chart02_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart02_cat7_S*100)<1){chart02_cat7_S_print='<1%';}else if (parseFloat(chart02_cat7_S*100)>99 && parseFloat(chart02_cat7_S*100)<100){chart02_cat7_S_print='>99%';}else{chart02_cat7_S_print=d3.format(".0%")(chart02_cat7_S);}
							if(Cat01_on){
								if (chart02_cat1_S!=0){
									lindex+=1;
									lindex2=chart02_labels_S.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li_S += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels_S+'</span><span class="ub-chart-number">'+chart02_cat1_S_print+'</span></li>';
									dataset_chart_02_S.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart02_cat2_S!=0){
									lindex+=1;
									lindex2=chart02_labels_S.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li_S += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels_S+'</span><span class="ub-chart-number">'+chart02_cat2_S_print+'</span></li>';
									dataset_chart_02_S.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart02_cat3_S!=0){
									lindex+=1;
									lindex2=chart02_labels_S.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li_S += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels_S+'</span><span class="ub-chart-number">'+chart02_cat3_S_print+'</span></li>';
									dataset_chart_02_S.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart02_cat4_S!=0){
									lindex+=1;
									lindex2=chart02_labels_S.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li_S += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels_S+'</span><span class="ub-chart-number">'+chart02_cat4_S_print+'</span></li>';
									dataset_chart_02_S.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart02_cat5_S!=0){
									lindex+=1;
									lindex2=chart02_labels_S.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li_S += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels_S+'</span><span class="ub-chart-number">'+chart02_cat5_S_print+'</span></li>';
									dataset_chart_02_S.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart02_cat6_S!=0){
									lindex+=1;
									lindex2=chart02_labels_S.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li_S += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels_S+'</span><span class="ub-chart-number">'+chart02_cat6_S_print+'</span></li>';
									dataset_chart_02_S.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart02_cat7_S!=0){
									lindex+=1;
									lindex2=chart02_labels_S.substring(0,1);
									lindex2graph=parseFloat(lindex2) - 1;
									chart02li_S += '<li class="ub-chart-row-0'+lindex2+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart02_labels_S+'</span><span class="ub-chart-number">'+chart02_cat7_S_print+'</span></li>';
									dataset_chart_02_S.splice(lindex2graph,1,parseFloat(d3.format(".0f")(chart02_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart02li_S!=''){
						var chart02li_S_sorted = $(chart02li_S).sort(myCompare);
						$('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-data').html(chart02li_S_sorted);
						$('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-data li .ub-chart-label').each(function(){
							var liLong=$(this).text();
							var liShort=liLong.substring(3);
							$(this).text(liShort);
						});
						var chart02bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart02bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_02_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart02bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-02 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart02bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_03_S() {
				d3.csv("data/chart03_state_data_v2.csv", function(data) {					
					chart03_S=data;
					dataset_chart_03_S=[];
					var lindex=0;
					var chart03li_S='';
					var dataChart03_S = data.length;
					for (var i = 0; i < dataChart03_S; i++) {
						var chart03_areaid_S = data[i].areaFIPS;
						if (chart03_areaid_S==areaCurrentGlobal){
							chart03_labels_S=data[i].Subcategory;
							chart03_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart03_cat1_S*100)<1){chart03_cat1_S_print='<1%';}else if (parseFloat(chart03_cat1_S*100)>99 && parseFloat(chart03_cat1_S*100)<100){chart03_cat1_S_print='>99%';}else{chart03_cat1_S_print=d3.format(".0%")(chart03_cat1_S);}
							chart03_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart03_cat2_S*100)<1){chart03_cat2_S_print='<1%';}else if (parseFloat(chart03_cat2_S*100)>99 && parseFloat(chart03_cat2_S*100)<100){chart03_cat2_S_print='>99%';}else{chart03_cat2_S_print=d3.format(".0%")(chart03_cat2_S);}
							chart03_cat3_S=data[i].parpostsec;
							if (parseFloat(chart03_cat3_S*100)<1){chart03_cat3_S_print='<1%';}else if (parseFloat(chart03_cat3_S*100)>99 && parseFloat(chart03_cat3_S*100)<100){chart03_cat3_S_print='>99%';}else{chart03_cat3_S_print=d3.format(".0%")(chart03_cat3_S);}
							chart03_cat4_S=data[i].lowincome;
							if (parseFloat(chart03_cat4_S*100)<1){chart03_cat4_S_print='<1%';}else if (parseFloat(chart03_cat4_S*100)>99 && parseFloat(chart03_cat4_S*100)<100){chart03_cat4_S_print='>99%';}else{chart03_cat4_S_print=d3.format(".0%")(chart03_cat4_S);}
							chart03_cat5_S=data[i].notlowincome;
							if (parseFloat(chart03_cat5_S*100)<1){chart03_cat5_S_print='<1%';}else if (parseFloat(chart03_cat5_S*100)>99 && parseFloat(chart03_cat5_S*100)<100){chart03_cat5_S_print='>99%';}else{chart03_cat5_S_print=d3.format(".0%")(chart03_cat5_S);}
							chart03_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart03_cat6_S*100)<1){chart03_cat6_S_print='<1%';}else if (parseFloat(chart03_cat6_S*100)>99 && parseFloat(chart03_cat6_S*100)<100){chart03_cat6_S_print='>99%';}else{chart03_cat6_S_print=d3.format(".0%")(chart03_cat6_S);}
							chart03_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart03_cat7_S*100)<1){chart03_cat7_S_print='<1%';}else if (parseFloat(chart03_cat7_S*100)>99 && parseFloat(chart03_cat7_S*100)<100){chart03_cat7_S_print='>99%';}else{chart03_cat7_S_print=d3.format(".0%")(chart03_cat7_S);}
							if(Cat01_on){
								if (chart03_cat1_S!=0){
									lindex+=1;
									chart03li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels_S+'</span><span class="ub-chart-number">'+chart03_cat1_S_print+'</span></li>';
									dataset_chart_03_S.push(parseFloat(d3.format(".1f")(chart03_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart03_cat2_S!=0){
									lindex+=1;
									chart03li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels_S+'</span><span class="ub-chart-number">'+chart03_cat2_S_print+'</span></li>';
									dataset_chart_03_S.push(parseFloat(d3.format(".1f")(chart03_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart03_cat3_S!=0){
									lindex+=1;
									chart03li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels_S+'</span><span class="ub-chart-number">'+chart03_cat3_S_print+'</span></li>';
									dataset_chart_03_S.push(parseFloat(d3.format(".1f")(chart03_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart03_cat4_S!=0){
									lindex+=1;
									chart03li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels_S+'</span><span class="ub-chart-number">'+chart03_cat4_S_print+'</span></li>';
									dataset_chart_03_S.push(parseFloat(d3.format(".1f")(chart03_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart03_cat5_S!=0){
									lindex+=1;
									chart03li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels_S+'</span><span class="ub-chart-number">'+chart03_cat5_S_print+'</span></li>';
									dataset_chart_03_S.push(parseFloat(d3.format(".1f")(chart03_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart03_cat6_S!=0){
									lindex+=1;
									chart03li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels_S+'</span><span class="ub-chart-number">'+chart03_cat6_S_print+'</span></li>';
									dataset_chart_03_S.push(parseFloat(d3.format(".1f")(chart03_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart03_cat7_S!=0){
									lindex+=1;
									chart03li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart03_labels_S+'</span><span class="ub-chart-number">'+chart03_cat7_S_print+'</span></li>';
									dataset_chart_03_S.push(parseFloat(d3.format(".1f")(chart03_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart03li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-data').html(chart03li_S);
						var chart03bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart03bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_03_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts2(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart03bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-03 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart03bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};		
			
			function chart_04_S() {
				d3.csv("data/chart04_state_data_v3.csv", function(data) {					
					chart04_S=data;
					dataset_chart_04_S=[];
					var lindex=0;
					var chart04li_S='';
					var dataChart04_S = data.length;
					for (var i = 0; i < dataChart04_S; i++) {
						var chart04_areaid_S = data[i].areaFIPS;
						if (chart04_areaid_S==areaCurrentGlobal){
							chart04_labels_S=data[i].Subcategory;
							chart04_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart04_cat1_S*100)<1){chart04_cat1_S_print='<1%';}else if (parseFloat(chart04_cat1_S*100)>99 && parseFloat(chart04_cat1_S*100)<100){chart04_cat1_S_print='>99%';}else{chart04_cat1_S_print=d3.format(".0%")(chart04_cat1_S);}
							chart04_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart04_cat2_S*100)<1){chart04_cat2_S_print='<1%';}else if (parseFloat(chart04_cat2_S*100)>99 && parseFloat(chart04_cat2_S*100)<100){chart04_cat2_S_print='>99%';}else{chart04_cat2_S_print=d3.format(".0%")(chart04_cat2_S);}
							chart04_cat3_S=data[i].parpostsec;
							if (parseFloat(chart04_cat3_S*100)<1){chart04_cat3_S_print='<1%';}else if (parseFloat(chart04_cat3_S*100)>99 && parseFloat(chart04_cat3_S*100)<100){chart04_cat3_S_print='>99%';}else{chart04_cat3_S_print=d3.format(".0%")(chart04_cat3_S);}
							chart04_cat4_S=data[i].lowincome;
							if (parseFloat(chart04_cat4_S*100)<1){chart04_cat4_S_print='<1%';}else if (parseFloat(chart04_cat4_S*100)>99 && parseFloat(chart04_cat4_S*100)<100){chart04_cat4_S_print='>99%';}else{chart04_cat4_S_print=d3.format(".0%")(chart04_cat4_S);}
							chart04_cat5_S=data[i].notlowincome;
							if (parseFloat(chart04_cat5_S*100)<1){chart04_cat5_S_print='<1%';}else if (parseFloat(chart04_cat5_S*100)>99 && parseFloat(chart04_cat5_S*100)<100){chart04_cat5_S_print='>99%';}else{chart04_cat5_S_print=d3.format(".0%")(chart04_cat5_S);}
							chart04_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart04_cat6_S*100)<1){chart04_cat6_S_print='<1%';}else if (parseFloat(chart04_cat6_S*100)>99 && parseFloat(chart04_cat6_S*100)<100){chart04_cat6_S_print='>99%';}else{chart04_cat6_S_print=d3.format(".0%")(chart04_cat6_S);}
							chart04_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart04_cat7_S*100)<1){chart04_cat7_S_print='<1%';}else if (parseFloat(chart04_cat7_S*100)>99 && parseFloat(chart04_cat7_S*100)<100){chart04_cat7_S_print='>99%';}else{chart04_cat7_S_print=d3.format(".0%")(chart04_cat7_S);}
							if(Cat01_on){
								if (chart04_cat1_S!=0){
									lindex+=1;
									chart04li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels_S+'</span><span class="ub-chart-number">'+chart04_cat1_S_print+'</span></li>';
									dataset_chart_04_S.push(parseFloat(d3.format(".1f")(chart04_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart04_cat2_S!=0){
									lindex+=1;
									chart04li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels_S+'</span><span class="ub-chart-number">'+chart04_cat2_S_print+'</span></li>';
									dataset_chart_04_S.push(parseFloat(d3.format(".1f")(chart04_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart04_cat3_S!=0){
									lindex+=1;
									chart04li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels_S+'</span><span class="ub-chart-number">'+chart04_cat3_S_print+'</span></li>';
									dataset_chart_04_S.push(parseFloat(d3.format(".1f")(chart04_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart04_cat4_S!=0){
									lindex+=1;
									chart04li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels_S+'</span><span class="ub-chart-number">'+chart04_cat4_S_print+'</span></li>';
									dataset_chart_04_S.push(parseFloat(d3.format(".1f")(chart04_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart04_cat5_S!=0){
									lindex+=1;
									chart04li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels_S+'</span><span class="ub-chart-number">'+chart04_cat5_S_print+'</span></li>';
									dataset_chart_04_S.push(parseFloat(d3.format(".1f")(chart04_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart04_cat6_S!=0){
									lindex+=1;
									chart04li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels_S+'</span><span class="ub-chart-number">'+chart04_cat6_S_print+'</span></li>';
									dataset_chart_04_S.push(parseFloat(d3.format(".1f")(chart04_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart04_cat7_S!=0){
									lindex+=1;
									chart04li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart04_labels_S+'</span><span class="ub-chart-number">'+chart04_cat7_S_print+'</span></li>';
									dataset_chart_04_S.push(parseFloat(d3.format(".1f")(chart04_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart04li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-data').html(chart04li_S);
						var chart04bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart04bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_04_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart04bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-04 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart04bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_05_S() {
				d3.csv("data/chart05_state_data_v3.csv", function(data) {					
					chart05_S=data;
					dataset_chart_05_S=[];
					var lindex=0;
					var chart05li_S='';
					var dataChart05_S = data.length;
					for (var i = 0; i < dataChart05_S; i++) {
						var chart05_areaid_S = data[i].areaFIPS;
						if (chart05_areaid_S==areaCurrentGlobal){
							chart05_labels_S=data[i].Subcategory;
							chart05_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart05_cat1_S*100)<1){chart05_cat1_S_print='<1%';}else if (parseFloat(chart05_cat1_S*100)>99 && parseFloat(chart05_cat1_S*100)<100){chart05_cat1_S_print='>99%';}else{chart05_cat1_S_print=d3.format(".0%")(chart05_cat1_S);}
							chart05_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart05_cat2_S*100)<1){chart05_cat2_S_print='<1%';}else if (parseFloat(chart05_cat2_S*100)>99 && parseFloat(chart05_cat2_S*100)<100){chart05_cat2_S_print='>99%';}else{chart05_cat2_S_print=d3.format(".0%")(chart05_cat2_S);}
							chart05_cat3_S=data[i].parpostsec;
							if (parseFloat(chart05_cat3_S*100)<1){chart05_cat3_S_print='<1%';}else if (parseFloat(chart05_cat3_S*100)>99 && parseFloat(chart05_cat3_S*100)<100){chart05_cat3_S_print='>99%';}else{chart05_cat3_S_print=d3.format(".0%")(chart05_cat3_S);}
							chart05_cat4_S=data[i].lowincome;
							if (parseFloat(chart05_cat4_S*100)<1){chart05_cat4_S_print='<1%';}else if (parseFloat(chart05_cat4_S*100)>99 && parseFloat(chart05_cat4_S*100)<100){chart05_cat4_S_print='>99%';}else{chart05_cat4_S_print=d3.format(".0%")(chart05_cat4_S);}
							chart05_cat5_S=data[i].notlowincome;
							if (parseFloat(chart05_cat5_S*100)<1){chart05_cat5_S_print='<1%';}else if (parseFloat(chart05_cat5_S*100)>99 && parseFloat(chart05_cat5_S*100)<100){chart05_cat5_S_print='>99%';}else{chart05_cat5_S_print=d3.format(".0%")(chart05_cat5_S);}
							chart05_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart05_cat6_S*100)<1){chart05_cat6_S_print='<1%';}else if (parseFloat(chart05_cat6_S*100)>99 && parseFloat(chart05_cat6_S*100)<100){chart05_cat6_S_print='>99%';}else{chart05_cat6_S_print=d3.format(".0%")(chart05_cat6_S);}
							chart05_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart05_cat7_S*100)<1){chart05_cat7_S_print='<1%';}else if (parseFloat(chart05_cat7_S*100)>99 && parseFloat(chart05_cat7_S*100)<100){chart05_cat7_S_print='>99%';}else{chart05_cat7_S_print=d3.format(".0%")(chart05_cat7_S);}
							if(Cat01_on){
								if (chart05_cat1_S!=0){
									lindex+=1;
									chart05li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels_S+'</span><span class="ub-chart-number">'+chart05_cat1_S_print+'</span></li>';
									dataset_chart_05_S.push(parseFloat(d3.format(".1f")(chart05_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart05_cat2_S!=0){
									lindex+=1;
									chart05li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels_S+'</span><span class="ub-chart-number">'+chart05_cat2_S_print+'</span></li>';
									dataset_chart_05_S.push(parseFloat(d3.format(".1f")(chart05_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart05_cat3_S!=0){
									lindex+=1;
									chart05li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels_S+'</span><span class="ub-chart-number">'+chart05_cat3_S_print+'</span></li>';
									dataset_chart_05_S.push(parseFloat(d3.format(".1f")(chart05_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart05_cat4_S!=0){
									lindex+=1;
									chart05li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels_S+'</span><span class="ub-chart-number">'+chart05_cat4_S_print+'</span></li>';
									dataset_chart_05_S.push(parseFloat(d3.format(".1f")(chart05_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart05_cat5_S!=0){
									lindex+=1;
									chart05li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels_S+'</span><span class="ub-chart-number">'+chart05_cat5_S_print+'</span></li>';
									dataset_chart_05_S.push(parseFloat(d3.format(".1f")(chart05_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart05_cat6_S!=0){
									lindex+=1;
									chart05li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels_S+'</span><span class="ub-chart-number">'+chart05_cat6_S_print+'</span></li>';
									dataset_chart_05_S.push(parseFloat(d3.format(".1f")(chart05_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart05_cat7_S!=0){
									lindex+=1;
									chart05li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart05_labels_S+'</span><span class="ub-chart-number">'+chart05_cat7_S_print+'</span></li>';
									dataset_chart_05_S.push(parseFloat(d3.format(".1f")(chart05_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart05li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-data').html(chart05li_S);
						var chart05bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart05bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_05_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart05bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-05 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart05bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};
			
			function chart_06_S() {
				d3.csv("data/chart06_state_data_v2.csv", function(data) {					
					chart06_S=data;
					dataset_chart_06_S=[];
					var lindex=0;
					var chart06li_S='';
					var dataChart06_S = data.length;
					for (var i = 0; i < dataChart06_S; i++) {
						var chart06_areaid_S = data[i].areaFIPS;
						if (chart06_areaid_S==areaCurrentGlobal){
							chart06_labels_S=data[i].Subcategory;
							chart06_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart06_cat1_S*100)<1){chart06_cat1_S_print='<1%';}else if (parseFloat(chart06_cat1_S*100)>99 && parseFloat(chart06_cat1_S*100)<100){chart06_cat1_S_print='>99%';}else{chart06_cat1_S_print=d3.format(".0%")(chart06_cat1_S);}
							chart06_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart06_cat2_S*100)<1){chart06_cat2_S_print='<1%';}else if (parseFloat(chart06_cat2_S*100)>99 && parseFloat(chart06_cat2_S*100)<100){chart06_cat2_S_print='>99%';}else{chart06_cat2_S_print=d3.format(".0%")(chart06_cat2_S);}
							chart06_cat3_S=data[i].parpostsec;
							if (parseFloat(chart06_cat3_S*100)<1){chart06_cat3_S_print='<1%';}else if (parseFloat(chart06_cat3_S*100)>99 && parseFloat(chart06_cat3_S*100)<100){chart06_cat3_S_print='>99%';}else{chart06_cat3_S_print=d3.format(".0%")(chart06_cat3_S);}
							chart06_cat4_S=data[i].lowincome;
							if (parseFloat(chart06_cat4_S*100)<1){chart06_cat4_S_print='<1%';}else if (parseFloat(chart06_cat4_S*100)>99 && parseFloat(chart06_cat4_S*100)<100){chart06_cat4_S_print='>99%';}else{chart06_cat4_S_print=d3.format(".0%")(chart06_cat4_S);}
							chart06_cat5_S=data[i].notlowincome;
							if (parseFloat(chart06_cat5_S*100)<1){chart06_cat5_S_print='<1%';}else if (parseFloat(chart06_cat5_S*100)>99 && parseFloat(chart06_cat5_S*100)<100){chart06_cat5_S_print='>99%';}else{chart06_cat5_S_print=d3.format(".0%")(chart06_cat5_S);}
							chart06_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart06_cat6_S*100)<1){chart06_cat6_S_print='<1%';}else if (parseFloat(chart06_cat6_S*100)>99 && parseFloat(chart06_cat6_S*100)<100){chart06_cat6_S_print='>99%';}else{chart06_cat6_S_print=d3.format(".0%")(chart06_cat6_S);}
							chart06_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart06_cat7_S*100)<1){chart06_cat7_S_print='<1%';}else if (parseFloat(chart06_cat7_S*100)>99 && parseFloat(chart06_cat7_S*100)<100){chart06_cat7_S_print='>99%';}else{chart06_cat7_S_print=d3.format(".0%")(chart06_cat7_S);}
							if(Cat01_on){
								if (chart06_cat1_S!=0){
									lindex+=1;
									chart06li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels_S+'</span><span class="ub-chart-number">'+chart06_cat1_S_print+'</span></li>';
									dataset_chart_06_S.push(parseFloat(d3.format(".1f")(chart06_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart06_cat2_S!=0){
									lindex+=1;
									chart06li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels_S+'</span><span class="ub-chart-number">'+chart06_cat2_S_print+'</span></li>';
									dataset_chart_06_S.push(parseFloat(d3.format(".1f")(chart06_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart06_cat3_S!=0){
									lindex+=1;
									chart06li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels_S+'</span><span class="ub-chart-number">'+chart06_cat3_S_print+'</span></li>';
									dataset_chart_06_S.push(parseFloat(d3.format(".1f")(chart06_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart06_cat4_S!=0){
									lindex+=1;
									chart06li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels_S+'</span><span class="ub-chart-number">'+chart06_cat4_S_print+'</span></li>';
									dataset_chart_06_S.push(parseFloat(d3.format(".1f")(chart06_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart06_cat5_S!=0){
									lindex+=1;
									chart06li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels_S+'</span><span class="ub-chart-number">'+chart06_cat5_S_print+'</span></li>';
									dataset_chart_06_S.push(parseFloat(d3.format(".1f")(chart06_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart06_cat6_S!=0){
									lindex+=1;
									chart06li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels_S+'</span><span class="ub-chart-number">'+chart06_cat6_S_print+'</span></li>';
									dataset_chart_06_S.push(parseFloat(d3.format(".1f")(chart06_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart06_cat7_S!=0){
									lindex+=1;
									chart06li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart06_labels_S+'</span><span class="ub-chart-number">'+chart06_cat7_S_print+'</span></li>';
									dataset_chart_06_S.push(parseFloat(d3.format(".1f")(chart06_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart06li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-data').html(chart06li_S);
						var chart06bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart06bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_06_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart06bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-06 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart06bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_07_S() {
				d3.csv("data/chart07_state_data_v2.csv", function(data) {					
					chart07_S=data;
					dataset_chart_07_S=[];
					var lindex=0;
					var chart07li_S='';
					var dataChart07_S = data.length;
					for (var i = 0; i < dataChart07_S; i++) {
						var chart07_areaid_S = data[i].areaFIPS;
						if (chart07_areaid_S==areaCurrentGlobal){
							chart07_labels_S=data[i].Subcategory;
							chart07_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart07_cat1_S*100)<1){chart07_cat1_S_print='<1%';}else if (parseFloat(chart07_cat1_S*100)>99 && parseFloat(chart07_cat1_S*100)<100){chart07_cat1_S_print='>99%';}else{chart07_cat1_S_print=d3.format(".0%")(chart07_cat1_S);}
							chart07_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart07_cat2_S*100)<1){chart07_cat2_S_print='<1%';}else if (parseFloat(chart07_cat2_S*100)>99 && parseFloat(chart07_cat2_S*100)<100){chart07_cat2_S_print='>99%';}else{chart07_cat2_S_print=d3.format(".0%")(chart07_cat2_S);}
							chart07_cat3_S=data[i].parpostsec;
							if (parseFloat(chart07_cat3_S*100)<1){chart07_cat3_S_print='<1%';}else if (parseFloat(chart07_cat3_S*100)>99 && parseFloat(chart07_cat3_S*100)<100){chart07_cat3_S_print='>99%';}else{chart07_cat3_S_print=d3.format(".0%")(chart07_cat3_S);}
							chart07_cat4_S=data[i].lowincome;
							if (parseFloat(chart07_cat4_S*100)<1){chart07_cat4_S_print='<1%';}else if (parseFloat(chart07_cat4_S*100)>99 && parseFloat(chart07_cat4_S*100)<100){chart07_cat4_S_print='>99%';}else{chart07_cat4_S_print=d3.format(".0%")(chart07_cat4_S);}
							chart07_cat5_S=data[i].notlowincome;
							if (parseFloat(chart07_cat5_S*100)<1){chart07_cat5_S_print='<1%';}else if (parseFloat(chart07_cat5_S*100)>99 && parseFloat(chart07_cat5_S*100<100)){chart07_cat5_S_print='>99%';}else{chart07_cat5_S_print=d3.format(".0%")(chart07_cat5_S);}
							chart07_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart07_cat6_S*100)<1){chart07_cat6_S_print='<1%';}else if (parseFloat(chart07_cat6_S*100)>99 && parseFloat(chart07_cat6_S*100)<100){chart07_cat6_S_print='>99%';}else{chart07_cat6_S_print=d3.format(".0%")(chart07_cat6_S);}
							chart07_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart07_cat7_S*100)<1){chart07_cat7_S_print='<1%';}else if (parseFloat(chart07_cat7_S*100)>99 && parseFloat(chart07_cat7_S*100)<100){chart07_cat7_S_print='>99%';}else{chart07_cat7_S_print=d3.format(".0%")(chart07_cat7_S);}
							if(Cat01_on){
								if (chart07_cat1_S!=0){
									lindex+=1;
									chart07li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels_S+'</span><span class="ub-chart-number">'+chart07_cat1_S_print+'</span></li>';
									dataset_chart_07_S.push(parseFloat(d3.format(".1f")(chart07_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart07_cat2_S!=0){
									lindex+=1;
									chart07li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels_S+'</span><span class="ub-chart-number">'+chart07_cat2_S_print+'</span></li>';
									dataset_chart_07_S.push(parseFloat(d3.format(".1f")(chart07_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart07_cat3_S!=0){
									lindex+=1;
									chart07li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels_S+'</span><span class="ub-chart-number">'+chart07_cat3_S_print+'</span></li>';
									dataset_chart_07_S.push(parseFloat(d3.format(".1f")(chart07_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart07_cat4_S!=0){
									lindex+=1;
									chart07li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels_S+'</span><span class="ub-chart-number">'+chart07_cat4_S_print+'</span></li>';
									dataset_chart_07_S.push(parseFloat(d3.format(".1f")(chart07_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart07_cat5_S!=0){
									lindex+=1;
									chart07li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels_S+'</span><span class="ub-chart-number">'+chart07_cat5_S_print+'</span></li>';
									dataset_chart_07_S.push(parseFloat(d3.format(".1f")(chart07_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart07_cat6_S!=0){
									lindex+=1;
									chart07li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels_S+'</span><span class="ub-chart-number">'+chart07_cat6_S_print+'</span></li>';
									dataset_chart_07_S.push(parseFloat(d3.format(".1f")(chart07_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart07_cat7_S!=0){
									lindex+=1;
									chart07li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart07_labels_S+'</span><span class="ub-chart-number">'+chart07_cat7_S_print+'</span></li>';
									dataset_chart_07_S.push(parseFloat(d3.format(".1f")(chart07_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart07li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-data').html(chart07li_S);
						var chart07bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart07bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_07_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart07bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-07 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart07bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function chart_08_S() {
				d3.csv("data/chart08_state_data_v2.csv", function(data) {					
					chart08_S=data;
					dataset_chart_08_S=[];
					var lindex=0;
					var chart08li_S='';
					var dataChart08_S = data.length;
					for (var i = 0; i < dataChart08_S; i++) {
						var chart08_areaid_S = data[i].areaFIPS;
						if (chart08_areaid_S==areaCurrentGlobal){
							chart08_labels_S=data[i].Subcategory;
							chart08_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart08_cat1_S*100)<1){chart08_cat1_S_print='<1%';}else if (parseFloat(chart08_cat1_S*100)>99 && parseFloat(chart08_cat1_S*100)<100){chart08_cat1_S_print='>99%';}else{chart08_cat1_S_print=d3.format(".0%")(chart08_cat1_S);}
							chart08_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart08_cat2_S*100)<1){chart08_cat2_S_print='<1%';}else if (parseFloat(chart08_cat2_S*100)>99 && parseFloat(chart08_cat2_S*100)<100){chart08_cat2_S_print='>99%';}else{chart08_cat2_S_print=d3.format(".0%")(chart08_cat2_S);}
							chart08_cat3_S=data[i].parpostsec;
							if (parseFloat(chart08_cat3_S*100)<1){chart08_cat3_S_print='<1%';}else if (parseFloat(chart08_cat3_S*100)>99 && parseFloat(chart08_cat3_S*100)<100){chart08_cat3_S_print='>99%';}else{chart08_cat3_S_print=d3.format(".0%")(chart08_cat3_S);}
							chart08_cat4_S=data[i].lowincome;
							if (parseFloat(chart08_cat4_S*100)<1){chart08_cat4_S_print='<1%';}else if (parseFloat(chart08_cat4_S*100)>99 && parseFloat(chart08_cat4_S*100)<100){chart08_cat4_S_print='>99%';}else{chart08_cat4_S_print=d3.format(".0%")(chart08_cat4_S);}
							chart08_cat5_S=data[i].notlowincome;
							if (parseFloat(chart08_cat5_S*100)<1){chart08_cat5_S_print='<1%';}else if (parseFloat(chart08_cat5_S*100)>99 && parseFloat(chart08_cat5_S*100)<100){chart08_cat5_S_print='>99%';}else{chart08_cat5_S_print=d3.format(".0%")(chart08_cat5_S);}
							chart08_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart08_cat6_S*100)<1){chart08_cat6_S_print='<1%';}else if (parseFloat(chart08_cat6_S*100)>99 && parseFloat(chart08_cat6_S*100)<100){chart08_cat6_S_print='>99%';}else{chart08_cat6_S_print=d3.format(".0%")(chart08_cat6_S);}
							chart08_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart08_cat7_S*100)<1){chart08_cat7_S_print='<1%';}else if (parseFloat(chart08_cat7_S*100)>99 && parseFloat(chart08_cat7_S*100)<100){chart08_cat7_S_print='>99%';}else{chart08_cat7_S_print=d3.format(".0%")(chart08_cat7_S);}
							if(Cat01_on){
								if (chart08_cat1_S!=0){
									lindex+=1;
									chart08li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels_S+'</span><span class="ub-chart-number">'+chart08_cat1_S_print+'</span></li>';
									dataset_chart_08_S.push(parseFloat(d3.format(".1f")(chart08_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart08_cat2_S!=0){
									lindex+=1;
									chart08li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels_S+'</span><span class="ub-chart-number">'+chart08_cat2_S_print+'</span></li>';
									dataset_chart_08_S.push(parseFloat(d3.format(".1f")(chart08_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart08_cat3_S!=0){
									lindex+=1;
									chart08li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels_S+'</span><span class="ub-chart-number">'+chart08_cat3_S_print+'</span></li>';
									dataset_chart_08_S.push(parseFloat(d3.format(".1f")(chart08_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart08_cat4_S!=0){
									lindex+=1;
									chart08li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels_S+'</span><span class="ub-chart-number">'+chart08_cat4_S_print+'</span></li>';
									dataset_chart_08_S.push(parseFloat(d3.format(".1f")(chart08_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart08_cat5_S!=0){
									lindex+=1;
									chart08li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels_S+'</span><span class="ub-chart-number">'+chart08_cat5_S_print+'</span></li>';
									dataset_chart_08_S.push(parseFloat(d3.format(".1f")(chart08_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart08_cat6_S!=0){
									lindex+=1;
									chart08li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels_S+'</span><span class="ub-chart-number">'+chart08_cat6_S_print+'</span></li>';
									dataset_chart_08_S.push(parseFloat(d3.format(".1f")(chart08_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart08_cat7_S!=0){
									lindex+=1;
									chart08li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart08_labels_S+'</span><span class="ub-chart-number">'+chart08_cat7_S_print+'</span></li>';
									dataset_chart_08_S.push(parseFloat(d3.format(".1f")(chart08_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart08li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-data').html(chart08li_S);
						var chart08bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart08bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_08_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts4(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart08bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-08 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart08bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};
			
			function chart_09_S() {
				d3.csv("data/chart09_state_data_v2.csv", function(data) {					
					chart09_S=data;
					dataset_chart_09_S=[];
					var lindex=0;
					var chart09li_S='';
					var dataChart09_S = data.length;
					for (var i = 0; i < dataChart09_S; i++) {
						var chart09_areaid_S = data[i].areaFIPS;
						if (chart09_areaid_S==areaCurrentGlobal){
							chart09_labels_S=data[i].Subcategory;
							chart09_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart09_cat1_S*100)<1){chart09_cat1_S_print='<1%';}else if (parseFloat(chart09_cat1_S*100)>99 && parseFloat(chart09_cat1_S*100)<100){chart09_cat1_S_print='>99%';}else{chart09_cat1_S_print=d3.format(".0%")(chart09_cat1_S);}
							chart09_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart09_cat2_S*100)<1){chart09_cat2_S_print='<1%';}else if (parseFloat(chart09_cat2_S*100)>99 && parseFloat(chart09_cat2_S*100)<100){chart09_cat2_S_print='>99%';}else{chart09_cat2_S_print=d3.format(".0%")(chart09_cat2_S);}
							chart09_cat3_S=data[i].parpostsec;
							if (parseFloat(chart09_cat3_S*100)<1){chart09_cat3_S_print='<1%';}else if (parseFloat(chart09_cat3_S*100)>99 && parseFloat(chart09_cat3_S*100)<100){chart09_cat3_S_print='>99%';}else{chart09_cat3_S_print=d3.format(".0%")(chart09_cat3_S);}
							chart09_cat4_S=data[i].lowincome;
							if (parseFloat(chart09_cat4_S*100)<1){chart09_cat4_S_print='<1%';}else if (parseFloat(chart09_cat4_S*100)>99 && parseFloat(chart09_cat4_S*100)<100){chart09_cat4_S_print='>99%';}else{chart09_cat4_S_print=d3.format(".0%")(chart09_cat4_S);}
							chart09_cat5_S=data[i].notlowincome;
							if (parseFloat(chart09_cat5_S*100)<1){chart09_cat5_S_print='<1%';}else if (parseFloat(chart09_cat5_S*100)>99 && parseFloat(chart09_cat5_S*100)<100){chart09_cat5_S_print='>99%';}else{chart09_cat5_S_print=d3.format(".0%")(chart09_cat5_S);}
							chart09_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart09_cat6_S*100)<1){chart09_cat6_S_print='<1%';}else if (parseFloat(chart09_cat6_S*100)>99 && parseFloat(chart09_cat6_S*100)<100){chart09_cat6_S_print='>99%';}else{chart09_cat6_S_print=d3.format(".0%")(chart09_cat6_S);}
							chart09_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart09_cat7_S*100)<1){chart09_cat7_S_print='<1%';}else if (parseFloat(chart09_cat7_S*100)>99 && parseFloat(chart09_cat7_S*100)<100){chart09_cat7_S_print='>99%';}else{chart09_cat7_S_print=d3.format(".0%")(chart09_cat7_S);}
							if(Cat01_on){
								if (chart09_cat1_S!=0){
									lindex+=1;
									chart09li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels_S+'</span><span class="ub-chart-number">'+chart09_cat1_S_print+'</span></li>';
									dataset_chart_09_S.push(parseFloat(d3.format(".1f")(chart09_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (chart09_cat2_S!=0){
									lindex+=1;
									chart09li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels_S+'</span><span class="ub-chart-number">'+chart09_cat2_S_print+'</span></li>';
									dataset_chart_09_S.push(parseFloat(d3.format(".1f")(chart09_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (chart09_cat3_S!=0){
									lindex+=1;
									chart09li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels_S+'</span><span class="ub-chart-number">'+chart09_cat3_S_print+'</span></li>';
									dataset_chart_09_S.push(parseFloat(d3.format(".1f")(chart09_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (chart09_cat4_S!=0){
									lindex+=1;
									chart09li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels_S+'</span><span class="ub-chart-number">'+chart09_cat4_S_print+'</span></li>';
									dataset_chart_09_S.push(parseFloat(d3.format(".1f")(chart09_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (chart09_cat5_S!=0){
									lindex+=1;
									chart09li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels_S+'</span><span class="ub-chart-number">'+chart09_cat5_S_print+'</span></li>';
									dataset_chart_09_S.push(parseFloat(d3.format(".1f")(chart09_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (chart09_cat6_S!=0){
									lindex+=1;
									chart09li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels_S+'</span><span class="ub-chart-number">'+chart09_cat6_S_print+'</span></li>';
									dataset_chart_09_S.push(parseFloat(d3.format(".1f")(chart09_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (chart09_cat7_S!=0){
									lindex+=1;
									chart09li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart09_labels_S+'</span><span class="ub-chart-number">'+chart09_cat7_S_print+'</span></li>';
									dataset_chart_09_S.push(parseFloat(d3.format(".1f")(chart09_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart09li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-data').html(chart09li_S);
						var chart09bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart09bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_09_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts2(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart09bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-09 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart09bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};
			
			function chart_10_S() {
				d3.csv("data/chart10_state_data_v3.csv", function(data) {					
					chart10_S=data;
					dataset_chart_10_S=[];
					var lindex=0;
					var chart10li_S='';
					var dataChart10_S = data.length;
					for (var i = 0; i < dataChart10_S; i++) {
						var chart10_areaid_S = data[i].areaFIPS;
						if (chart10_areaid_S==areaCurrentGlobal){
							chart10_labels_S=data[i].Subcategory;
							chart10_cat1_S=data[i].allchildren0to2;
							if (parseFloat(chart10_cat1_S*100)<1){chart10_cat1_S_print='<1%';}else if (parseFloat(chart10_cat1_S*100)>99 && parseFloat(chart10_cat1_S*100)<100){chart10_cat1_S_print='>99%';}else{chart10_cat1_S_print=d3.format(".0%")(chart10_cat1_S);}
							chart10_cat2_S=data[i].pareducHSless;
							if (parseFloat(chart10_cat2_S*100)<1){chart10_cat2_S_print='<1%';}else if (parseFloat(chart10_cat2_S*100)>99 && parseFloat(chart10_cat2_S*100)<100){chart10_cat2_S_print='>99%';}else{chart10_cat2_S_print=d3.format(".0%")(chart10_cat2_S);}
							chart10_cat3_S=data[i].parpostsec;
							if (parseFloat(chart10_cat3_S*100)<1){chart10_cat3_S_print='<1%';}else if (parseFloat(chart10_cat3_S*100)>99 && parseFloat(chart10_cat3_S*100)<100){chart10_cat3_S_print='>99%';}else{chart10_cat3_S_print=d3.format(".0%")(chart10_cat3_S);}
							chart10_cat4_S=data[i].lowincome;
							if (parseFloat(chart10_cat4_S*100)<1){chart10_cat4_S_print='<1%';}else if (parseFloat(chart10_cat4_S*100)>99 && parseFloat(chart10_cat4_S*100)<100){chart10_cat4_S_print='>99%';}else{chart10_cat4_S_print=d3.format(".0%")(chart10_cat4_S);}
							chart10_cat5_S=data[i].notlowincome;
							if (parseFloat(chart10_cat5_S*100)<1){chart10_cat5_S_print='<1%';}else if (parseFloat(chart10_cat5_S*100)>99 && parseFloat(chart10_cat5_S*100)<100){chart10_cat5_S_print='>99%';}else{chart10_cat5_S_print=d3.format(".0%")(chart10_cat5_S);}
							chart10_cat6_S=data[i].allnativebornparents;
							if (parseFloat(chart10_cat6_S*100)<1){chart10_cat6_S_print='<1%';}else if (parseFloat(chart10_cat6_S*100)>99 && parseFloat(chart10_cat6_S*100)<100){chart10_cat6_S_print='>99%';}else{chart10_cat6_S_print=d3.format(".0%")(chart10_cat6_S);}
							chart10_cat7_S=data[i].atleast1immigparent;
							if (parseFloat(chart10_cat7_S*100)<1){chart10_cat7_S_print='<1%';}else if (parseFloat(chart10_cat7_S*100)>99 && parseFloat(chart10_cat7_S*100)<100){chart10_cat7_S_print='>99%';}else{chart10_cat7_S_print=d3.format(".0%")(chart10_cat7_S);}
							if(Cat01_on){
								if (!isNaN(chart10_cat1_S) && chart10_cat1_S!=0){
									lindex+=1;
									chart10li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels_S+'</span><span class="ub-chart-number">'+chart10_cat1_S_print+'</span></li>';
									dataset_chart_10_S.push(parseFloat(d3.format(".1f")(chart10_cat1_S*100)));
								}
							}else if(Cat02_on){
								if (!isNaN(chart10_cat2_S) && chart10_cat2_S!=0){
									lindex+=1;
									chart10li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels_S+'</span><span class="ub-chart-number">'+chart10_cat2_S_print+'</span></li>';
									dataset_chart_10_S.push(parseFloat(d3.format(".1f")(chart10_cat2_S*100)));
								}
							}else if(Cat03_on){
								if (!isNaN(chart10_cat3_S) && chart10_cat3_S!=0){
									lindex+=1;
									chart10li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels_S+'</span><span class="ub-chart-number">'+chart10_cat3_S_print+'</span></li>';
									dataset_chart_10_S.push(parseFloat(d3.format(".1f")(chart10_cat3_S*100)));
								}
							}else if(Cat04_on){
								if (!isNaN(chart10_cat4_S) && chart10_cat4_S!=0){
									lindex+=1;
									chart10li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels_S+'</span><span class="ub-chart-number">'+chart10_cat4_S_print+'</span></li>';
									dataset_chart_10_S.push(parseFloat(d3.format(".1f")(chart10_cat4_S*100)));
								}
							}else if(Cat05_on){
								if (!isNaN(chart10_cat5_S) && chart10_cat5_S!=0){
									lindex+=1;
									chart10li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels_S+'</span><span class="ub-chart-number">'+chart10_cat5_S_print+'</span></li>';
									dataset_chart_10_S.push(parseFloat(d3.format(".1f")(chart10_cat5_S*100)));
								}
							}else if(Cat06_on){
								if (!isNaN(chart10_cat6_S) && chart10_cat6_S!=0){
									lindex+=1;
									chart10li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels_S+'</span><span class="ub-chart-number">'+chart10_cat6_S_print+'</span></li>';
									dataset_chart_10_S.push(parseFloat(d3.format(".1f")(chart10_cat6_S*100)));
								}
							}else if(Cat07_on){
								if (!isNaN(chart10_cat7_S) && chart10_cat7_S!=0){
									lindex+=1;
									chart10li_S += '<li class="ub-chart-row-0'+lindex+'"><span class="ub-chart-color"></span><span class="ub-chart-label">'+chart10_labels_S+'</span><span class="ub-chart-number">'+chart10_cat7_S_print+'</span></li>';
									dataset_chart_10_S.push(parseFloat(d3.format(".1f")(chart10_cat7_S*100)));
								}
							}else{			

							}
						}
					}
					if (chart10li_S!=''){
						$('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-data').html(chart10li_S);
						var chart10bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars svg.ub-stackedbars');
						var perc_so_far = 0;
						d3.select('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars').style("height","35px");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart10bars_S
							.attr("width","100%")
							.attr("height",hchart)
							.selectAll("rect")
							.data(dataset_chart_10_S)
							.enter()
							.append("rect")
							.attr("width", function(d){
								return d+"%";
							})
							.attr("x", function(d){
								var prev_perc = perc_so_far;
								var this_perc = d;
								perc_so_far = perc_so_far + this_perc;
								return prev_perc + "%";
							})
							.attr("height",hchart)
							.style("fill", function(d,i){
								return greenCharts(i);
    						});
					}else{
						$('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
						var chart10bars_S = d3.select('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars svg.ub-stackedbars');
						d3.select('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars').style("height","0");
						d3.selectAll('.ub-charts-container .ub-row .ub-chart-10 .ub-chart-bars svg.ub-stackedbars rect').remove();
						chart10bars_S
							.attr("width","100%")
							.attr("height","0");
					}
				});
			};

			function clicked(d) {
				Cat_States_on=false;
				Cat_Middle_on=false;
				Cat_CBSA_on=true;
				var currentArea;
				var currentAreaNull;
				var currentAllChildren;
				var currentEnrolled;
				var currentNotEnrolled;
				var currentLowIncome;
				var currentNotLowIncome;
				var currentNative;
				var currentNotNative;
				var theWord="";
				var thisPath = d3.select(this.parentNode.appendChild(this)).classed("active", true);
				var allPath = d3.selectAll("path");
				var allPathHTML = $("#ub-states path");
				var allPathHTMLTop = $("#ub-states-rest path");
				if (active.node() === this) return reset();			

				allPath.classed("active", false);
				allPathHTML.css("fill","#ececec");
				allPathHTMLTop.css("stroke","#ffffff");
				allPathHTMLTop.css("stroke-width","1.15px");
				thisPath.classed("active", true);
								
				var currentId = d3.select(this).attr("id");
				areaCurrentGlobal = currentId;
				var currentIdNum = parseFloat(areaCurrentGlobal);
				var areaCurrentGlobal56 = currentIdNum+56;
				var thisPathLine = $("path[id='"+areaCurrentGlobal56+"']");
				if (Cat_CBSA_on){
					thisPathLine.css("stroke","rgb(0,0,0)");
					thisPathLine.css("stroke-width","1px");
					$('#ub-states-rest').append(thisPathLine);
				}				
				
				var allPathStates = d3.selectAll("#ub-states-national path");				
				var thisClick = projection.invert(d3.mouse(this));

				var areaCurrentState;
				var areaCurrentStateShort;
                allPathStates.each(function(b){
                    var thisPolygons = b.geometry.coordinates
                	var thisPolygon, inside, outputInside;
					var thisPolygonsLength = thisPolygons.length;
                    for(var i = 0; i < thisPolygonsLength; i++){
                        thisPolygon = thisPolygons[i][0]
                        inside = d3.polygonContains(thisPolygon,thisClick)
                        if(inside){
							areaCurrentState = b.properties[1];
							areaCurrentStateShort = b.properties[15];
                            outputInside = b.properties[1]+' '+b.id+': '+inside;
                            break;
                        }
                    }
                    
                });

				var chosenShort = d3.select(this).attr('data-areanameshort');
				if (chosenShort) {
					chosenShortGlobal = chosenShort;
				} else {
					chosenShortGlobal = areaCurrentStateShort;
				}				

				$('.ub-cbsa-list li.ub-sorted').each(function(){
					$(this).removeClass("ub-cbsa-select");
				});
				ListCBSA();
				
				if (Cat_CBSA_on){
					if (currentIdNum<200){theWord="the ";}else{theWord="";}
				}
				
				currentArea = d3.select(this).attr("data-areaname");
				currentAreaNull = d3.select(this).attr("data-name");
				currentAllChildren = d3.select(this).attr("data-allchildren");
				currentEnrolled = d3.select(this).attr("data-enrolled");
				currentNotEnrolled = d3.select(this).attr("data-notenrolled");
				currentLowIncome = d3.select(this).attr("data-lowincome");
				currentNotLowIncome = d3.select(this).attr("data-notlowincome");
				currentNative = d3.select(this).attr("data-native");
				currentNotNative = d3.select(this).attr("data-notnative");
				if (Cat_States_on){
					areaCurrentGlobal = areaCurrentGlobal-112;
				} else {
					areaCurrentGlobal = areaCurrentGlobal;
				}
				if (areaCurrentGlobal) {
					if (Cat_CBSA_on){
						$('#ub-state-menu p').html('<span class="ub-initial">'+areaCurrentState+'</span>');
						$('#ub-cbsa-menu p').text(currentArea);
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
					if (Cat_States_on){
						$('#ub-state-menu p').html('<span class="ub-initial">'+areaCurrentState+'</span>');
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}else{
					$('#ub-cbsa-menu p').html(currentAreaNull+'<span class="ub-initial"></span>');
				}
				

				var bounds = path.bounds(d);
      			var dx = bounds[1][0] - bounds[0][0];
				var dy = bounds[1][1] - bounds[0][1];
				var x = (bounds[0][0] + bounds[1][0]) / 2;
				var y = (bounds[0][1] + bounds[1][1]) / 2;
				var scale = Math.max(1, Math.min(2, 0.9 / Math.max(dx / w, dy / h)));
				var translate = [w / 2 - scale * x, h / 2 - scale * y];
				svg.transition()
					.duration(750)
					.call(zoom.translate(translate).scale(scale).event);
				
				$('.ub-data h3 span.ub-data-place').text(theWord+d3.select(this).attr("data-areaname"));
				if(Cat01_on){
					if (currentArea) {
						if (currentAllChildren==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> for children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat02_on){
					if (currentArea) {
						if (currentEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat03_on){
					if (currentArea) {
						if (currentNotEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat04_on){
					if (currentArea) {
						if (currentLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat05_on){
					if (currentArea) {
						if (currentNotLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat06_on){
					if (currentArea) {
						if (currentNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat07_on){
					if (currentArea) {
						if (currentNotNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else{			

				}
				moveMenusB();
				$('#factsheet-tab').addClass('active');
				document.getElementById('factsheet').className += ' active';
				setTimeout(function(){
					$('#factsheet').addClass('ub-in');
				},50);
				$('#usamap-tab').removeClass('active');
				$('#usamap').removeClass('active ub-in');
			};

			
			function clicked_S(d) {
				Cat_States_on=true;
				Cat_Middle_on=true;
				Cat_CBSA_on=false;
				var currentArea;
				var currentAreaNull;
				var currentAllChildren;
				var currentEnrolled;
				var currentNotEnrolled;
				var currentLowIncome;
				var currentNotLowIncome;
				var currentNative;
				var currentNotNative;
				var theWord="";
					
				
				var currentId = d3.select(this).attr("id");
				areaCurrentGlobal = currentId;
				var currentIdNum = parseFloat(areaCurrentGlobal);
				var areaCurrentGlobal56 = currentIdNum-56;
				
				var currPath = d3.select("path[id='"+areaCurrentGlobal+"']");
				var currPathHTML = $("path[id='"+areaCurrentGlobal+"']");
				var currPathLine = $("path[id='"+areaCurrentGlobal56+"']");
				var restPath = d3.selectAll("path");
				var restPathLine = $('#ub-states-rest path');
				var restPathHTML = $("#ub-states path");

				restPathLine.css("stroke","#FFFFFF");
				restPathLine.css("stroke-width","1.15px");
				currPathLine.css("stroke","#000000");
				currPathLine.css("stroke-width","1px");
				$('#ub-states-rest').append(currPathLine);			
				
				if (active.node() === this) return reset();
				restPath.classed("active", false);
				currPath.classed("active", true);
				restPathHTML.css("fill","#ececec");
				$('#ub-states-national').append(currPathHTML);
				
				

				
				var chosenShort = d3.select(this).attr('data-areanameshort');
				if (chosenShort) {
					chosenShortGlobal = chosenShort;
				} else {
					chosenShortGlobal = chosenShortGlobal;
				}

				$('.ub-cbsa-list li.ub-sorted').each(function(){
					$(this).removeClass("ub-cbsa-select");
				});
				ListCBSA();

	//			if (Cat_CBSA_on){
	//				if (currentIdNum<200){theWord="the ";}else{theWord="";}
	//			}
				
				currentArea = d3.select(this).attr("data-areaname");
				currentAreaNull = d3.select(this).attr("data-name");
				currentAllChildren = d3.select(this).attr("data-allchildren");
				currentEnrolled = d3.select(this).attr("data-enrolled");
				currentNotEnrolled = d3.select(this).attr("data-notenrolled");
				currentLowIncome = d3.select(this).attr("data-lowincome");
				currentNotLowIncome = d3.select(this).attr("data-notlowincome");
				currentNative = d3.select(this).attr("data-native");
				currentNotNative = d3.select(this).attr("data-notnative");
				areaCurrentGlobal = areaCurrentGlobal-112;
				if (areaCurrentGlobal) {
						$('#ub-state-menu p').html('<span class="ub-initial">'+currentArea+'</span>');
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
				}else{
					$('#ub-cbsa-menu p').text(currentAreaNull);
				}
				

				var bounds = path.bounds(d);
      			var dx = bounds[1][0] - bounds[0][0];
				var dy = bounds[1][1] - bounds[0][1];
				var x = (bounds[0][0] + bounds[1][0]) / 2;
				var y = (bounds[0][1] + bounds[1][1]) / 2;
				var scale = Math.max(1, Math.min(2, 0.9 / Math.max(dx / w, dy / h)));
				var translate = [w / 2 - scale * x, h / 2 - scale * y];				
				svg.transition()
					.duration(750)
					.call(zoom.translate(translate).scale(scale).event);
				
				$('.ub-data h3 span.ub-data-place').text(theWord+d3.select(this).attr("data-areaname"));
				if(Cat01_on){
					if (currentArea) {
						if (currentAllChildren==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> for children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat02_on){
					if (currentArea) {
						if (currentEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat03_on){
					if (currentArea) {
						if (currentNotEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat04_on){
					if (currentArea) {
						if (currentLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat05_on){
					if (currentArea) {
						if (currentNotLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat06_on){
					if (currentArea) {
						if (currentNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat07_on){
					if (currentArea) {
						if (currentNotNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else{			

				}
				
				setTimeout(function(){
					MapCBSA();
					if(Cat01_on){
						funcCat01_color();
					}else if(Cat02_on){
						funcCat02_color();
					}else if(Cat03_on){
						funcCat03_color();
					}else if(Cat04_on){
						funcCat04_color();
					}else if(Cat05_on){
						funcCat05_color();
					}else if(Cat06_on){
						funcCat06_color();
					}else if(Cat07_on){
						funcCat07_color();
					}else {
					}
					chart_01_S();
					chart_02_S();
					chart_03_S();
					chart_04_S();
					chart_05_S();
					chart_06_S();
					chart_07_S();
					chart_08_S();
					chart_09_S();
					chart_10_S();
				},750);
				
			};	
			
			
			function selected(d) {
				Cat_States_on=false;
				Cat_Middle_on=false;
				Cat_CBSA_on=true;
				var currentArea;
				var currentAreaNull;
				var currentAllChildren;
				var currentEnrolled;
				var currentNotEnrolled;
				var currentLowIncome;
				var currentNotLowIncome;
				var currentNative;
				var currentNotNative;				
				var theWord="";
				var chosenCbsa = d3.select(this).property('value');				
				areaCurrentGlobal = chosenCbsa;
				var chosenIdNum = parseFloat(areaCurrentGlobal);	
				if (Cat_CBSA_on){
					if (chosenIdNum<200){theWord="the ";}else{theWord="";}
				}
				
				var currPath = d3.select("path[id='"+areaCurrentGlobal+"']");
				var currPathHTML = $("path[id='"+areaCurrentGlobal+"']");
				var restPath = d3.selectAll("path");
				var restPathHTML = $("#ub-states path");
				var restPathHTMLLine = $("#ub-states-rest path");
				
				if (active.node() === this) return reset();
				restPath.classed("active", false);
				restPathHTML.css("fill","#ececec");
				restPathHTMLLine.css("stroke","#FFFFFF");
				restPathHTMLLine.css("stroke-width","1.15px");
				currPath.classed("active", true);
				$('#ub-cbsa').append(currPathHTML);
				
				var chosenShort = currPath.attr('data-areanameshort');
				if (chosenShort) {
					chosenShortGlobal = chosenShort;
				} else {
					chosenShortGlobal = chosenShortGlobal;
				}
				
				if (Cat_CBSA_on){
					$('.ub-cbsa-list li.ub-sorted').each(function(){
						$(this).removeClass("ub-cbsa-select");
					});
					ListCBSA();
				}

				
				currentArea = currPath.attr("data-areaname");
				currentAreaNull = currPath.attr("data-name");
				currentAllChildren = currPath.attr("data-allchildren");
				currentEnrolled = currPath.attr("data-enrolled");
				currentNotEnrolled = currPath.attr("data-notenrolled");
				currentLowIncome = currPath.attr("data-lowincome");
				currentNotLowIncome = currPath.attr("data-notlowincome");
				currentNative = currPath.attr("data-native");
				currentNotNative = currPath.attr("data-notnative");

				if (areaCurrentGlobal) {
					if (Cat_CBSA_on){					
						$('#ub-cbsa-menu p').text(currentArea);
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
					if (Cat_States_on){
						$('#ub-state-menu p').html('<span class="ub-initial">'+currentArea+'</span>');
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}else{
					$('#ub-cbsa-menu p').text(currentAreaNull);
				}			

				var bounds = path.bounds(d);
      			var dx = bounds[1][0] - bounds[0][0];
				var dy = bounds[1][1] - bounds[0][1];
				var x = (bounds[0][0] + bounds[1][0]) / 2;
				var y = (bounds[0][1] + bounds[1][1]) / 2;
				var scale = Math.max(1, Math.min(2, 0.9 / Math.max(dx / w, dy / h)));
				var translate = [w / 2 - scale * x, h / 2 - scale * y];
				svg.transition()
					.duration(750)
					.call(zoom.translate(translate).scale(scale).event);
					lastK += 1;
				$('.ub-data h3 span.ub-data-place').text(theWord+currentArea);
				if(Cat01_on){
					if (currentArea) {
						if (currentAllChildren==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> for children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat02_on){
					if (currentArea) {
						if (currentEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat03_on){
					if (currentArea) {
						if (currentNotEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat04_on){
					if (currentArea) {
						if (currentLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat05_on){
					if (currentArea) {
						if (currentNotLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat06_on){
					if (currentArea) {
						if (currentNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat07_on){
					if (currentArea) {
						if (currentNotNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else{			

				}
				moveMenusB();
				$('#factsheet-tab').addClass('active');
				document.getElementById('factsheet').className += ' active';
				setTimeout(function(){
					$('#factsheet').addClass('ub-in');
				},50);
				$('#usamap-tab').removeClass('active');
				$('#usamap').removeClass('active ub-in');
			};

			function selected_R(d) {
				Cat_States_on=false;
				Cat_Middle_on=false;
				Cat_CBSA_on=true;
				var currentArea;
				var currentAreaNull;
				var currentAllChildren;
				var currentEnrolled;
				var currentNotEnrolled;
				var currentLowIncome;
				var currentNotLowIncome;
				var currentNative;
				var currentNotNative;				
				var theWord="";
				var chosenCbsa = d3.select(this).property('value');		
				areaCurrentGlobal = chosenCbsa;
				var areaCurrentGlobal56 = areaCurrentGlobal-56;

				var chosenIdNum = parseFloat(areaCurrentGlobal);	
				if (Cat_CBSA_on){
					if (chosenIdNum<200){theWord="the ";}else{theWord="";}
				}
				
				var currPath = d3.select("path[id='"+areaCurrentGlobal+"']");
				var currPathHTML = $("path[id='"+areaCurrentGlobal+"']");
				var currPathLine = $("path[id='"+areaCurrentGlobal56+"']");
				var restPath = d3.selectAll("path");
				var restPathHTML = $("#ub-states path");
				
				if (active.node() === this) return reset();
				restPath.classed("active", false);
				currPath.classed("active", true);
				restPathHTML.css("fill","#ececec");
				currPathLine.css("fill","rgb(253,191,17)");
				currPathHTML.addClass("active");
				$('#ub-states-rest').append(currPathHTML);
				
				var chosenShort = currPath.attr('data-areanameshort');
				if (chosenShort) {
					chosenShortGlobal = chosenShort;
				} else {
					chosenShortGlobal = chosenShortGlobal;
				}
				
				if (Cat_CBSA_on){
					$('.ub-cbsa-list li.ub-sorted').each(function(){
						$(this).removeClass("ub-cbsa-select");
					});
					ListCBSA();
				}
				
				currentArea = currPath.attr("data-areaname");
				currentAreaNull = currPath.attr("data-name");
				currentAllChildren = currPath.attr("data-allchildren");
				currentEnrolled = currPath.attr("data-enrolled");
				currentNotEnrolled = currPath.attr("data-notenrolled");
				currentLowIncome = currPath.attr("data-lowincome");
				currentNotLowIncome = currPath.attr("data-notlowincome");
				currentNative = currPath.attr("data-native");
				currentNotNative = currPath.attr("data-notnative");
				areaCurrentGlobal=areaCurrentGlobal-56;
				if (areaCurrentGlobal) {
					if (Cat_CBSA_on){					
						$('#ub-cbsa-menu p').text(currentArea);
						chart_01();
						chart_02();
						chart_03();
						chart_04();
						chart_05();
						chart_06();
						chart_07();
						chart_08();
						chart_09();
						chart_10();
					}
					if (Cat_States_on){
						$('#ub-state-menu p').html('<span class="ub-initial">'+currentArea+'</span>');
						chart_01_S();
						chart_02_S();
						chart_03_S();
						chart_04_S();
						chart_05_S();
						chart_06_S();
						chart_07_S();
						chart_08_S();
						chart_09_S();
						chart_10_S();
					}
				}else{
					$('#ub-cbsa-menu p').text(currentAreaNull);
				}			

				var bounds = path.bounds(d);
      			var dx = bounds[1][0] - bounds[0][0];
				var dy = bounds[1][1] - bounds[0][1];
				var x = (bounds[0][0] + bounds[1][0]) / 2;
				var y = (bounds[0][1] + bounds[1][1]) / 2;
				var scale = Math.max(1, Math.min(2, 0.9 / Math.max(dx / w, dy / h)));
				var translate = [w / 2 - scale * x, h / 2 - scale * y];
				svg.transition()
					.duration(750)
					.call(zoom.translate(translate).scale(scale).event);
					lastK += 1;
				$('.ub-data h3 span.ub-data-place').text(theWord+currentArea);
				if(Cat01_on){
					if (currentArea) {
						if (currentAllChildren==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> for children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat02_on){
					if (currentArea) {
						if (currentEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat03_on){
					if (currentArea) {
						if (currentNotEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat04_on){
					if (currentArea) {
						if (currentLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat05_on){
					if (currentArea) {
						if (currentNotLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat06_on){
					if (currentArea) {
						if (currentNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat07_on){
					if (currentArea) {
						if (currentNotNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else{			

				}
				moveMenusB();
				$('#factsheet-tab').addClass('active');
				document.getElementById('factsheet').className += ' active';
				setTimeout(function(){
					$('#factsheet').addClass('ub-in');
				},50);
				$('#usamap-tab').removeClass('active');
				$('#usamap').removeClass('active ub-in');
			};
			
			function selected_S(d) {
				Cat_States_on=true;
				Cat_Middle_on=true;
				Cat_CBSA_on=false;
				var currentArea;
				var currentAreaNull;
				var currentAllChildren;
				var currentEnrolled;
				var currentNotEnrolled;
				var currentLowIncome;
				var currentNotLowIncome;
				var currentNative;
				var currentNotNative;				
				var theWord="";
				var chosenCbsa = d3.select(this).property('value');				
				areaCurrentGlobal = chosenCbsa;
				var areaCurrentGlobal56 = areaCurrentGlobal-56;
				
				var currPath = d3.select("path[id='"+areaCurrentGlobal+"']");
				var currPathHTML = $("path[id='"+areaCurrentGlobal+"']");
				var currPathLine = $("path[id='"+areaCurrentGlobal56+"']");
				var restPath = d3.selectAll("path");
				var restPathLine = $('#ub-states-rest path');
				var restPathHTML = $("#ub-states path");
			//	if (Cat_CBSA_on){
					restPathLine.css("stroke","#FFFFFF");
					restPathLine.css("stroke-width","1.15px");
					currPathLine.css("stroke","#000000");
					currPathLine.css("stroke-width","1px");
					$('#ub-states-rest').append(currPathLine);
			//	}				
				
				if (active.node() === this) return reset();
				restPath.classed("active", false);
				currPath.classed("active", true);
				restPathHTML.css("fill","#ececec");
				$('#ub-states-national').append(currPathHTML);

				
				var chosenShort = currPath.attr('data-areanameshort');
				if (chosenShort) {
					chosenShortGlobal = chosenShort;
				} else {
					chosenShortGlobal = chosenShortGlobal;
				}
				
				$('.ub-cbsa-list li.ub-sorted').each(function(){
					$(this).removeClass("ub-cbsa-select");
				});
				ListCBSA();
				
				currentArea = currPath.attr("data-areaname");
				currentAreaNull = currPath.attr("data-name");
				currentAllChildren = currPath.attr("data-allchildren");
				currentEnrolled = currPath.attr("data-enrolled");
				currentNotEnrolled = currPath.attr("data-notenrolled");
				currentLowIncome = currPath.attr("data-lowincome");
				currentNotLowIncome = currPath.attr("data-notlowincome");
				currentNative = currPath.attr("data-native");
				currentNotNative = currPath.attr("data-notnative");
				areaCurrentGlobal=areaCurrentGlobal-112;
				if (areaCurrentGlobal) {
					$('#ub-state-menu p').html('<span class="ub-initial">'+currentArea+'</span>');
					$('#ub-cbsa-menu p').html('<span class="ub-initial">Choose</span>');
					chart_01_S();
					chart_02_S();
					chart_03_S();
					chart_04_S();
					chart_05_S();
					chart_06_S();
					chart_07_S();
					chart_08_S();
					chart_09_S();
					chart_10_S();
				}else{
					$('#ub-cbsa-menu p').text(currentAreaNull);
				}			

				var bounds = path.bounds(d);
      			var dx = bounds[1][0] - bounds[0][0];
				var dy = bounds[1][1] - bounds[0][1];
				var x = (bounds[0][0] + bounds[1][0]) / 2;
				var y = (bounds[0][1] + bounds[1][1]) / 2;
				var scale = Math.max(1, Math.min(2, 0.9 / Math.max(dx / w, dy / h)));
				var translate = [w / 2 - scale * x, h / 2 - scale * y];
				svg.transition()
					.duration(750)
					.call(zoom.translate(translate).scale(scale).event);
					lastK += 1;
				$('.ub-data h3 span.ub-data-place').text(theWord+currentArea);
				if(Cat01_on){
					if (currentArea) {
						if (currentAllChildren==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> for children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentAllChildren+'</span><span class="ub-cat-category"> children from birth to age 2 in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat02_on){
					if (currentArea) {
						if (currentEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom all parents have a high school education or less in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat03_on){
					if (currentArea) {
						if (currentNotEnrolled==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> for children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotEnrolled+'</span><span class="ub-cat-category"> children from birth to age 2 for whom at least one parent has education beyond high school in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat04_on){
					if (currentArea) {
						if (currentLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in low-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat05_on){
					if (currentArea) {
						if (currentNotLowIncome==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> for children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotLowIncome+'</span><span class="ub-cat-category"> children from birth to age 2 in higher-income families in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat06_on){
					if (currentArea) {
						if (currentNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNative+'</span><span class="ub-cat-category"> children from birth to age 2 with all native-born parents in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else if(Cat07_on){
					if (currentArea) {
						if (currentNotNative==globalNoData) {
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> for children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}else{
							$('.ub-charts-container h3').html('<span class="ub-cat-number">'+currentNotNative+'</span><span class="ub-cat-category"> children from birth to age 2 with at least one immigrant parent in </span><span class="ub-cat-name">'+theWord+currentArea+'</span>');
						}
					} else {
						$('.ub-charts-container h3').html('<span class="ub-cat-number"></span><span class="ub-cat-category">There is insufficient data available for </span><span class="ub-cat-name">'+currentAreaNull+'</span>');
						$('.ub-charts-container .ub-row .ub-chart-data').html('<li><span class="ub-chart-label">'+globalNoData+'</span></li>');
					}
				}else{			

				}
				setTimeout(function(){
					MapCBSA();
					if(Cat01_on){
						funcCat01_color();
					}else if(Cat02_on){
						funcCat02_color();
					}else if(Cat03_on){
						funcCat03_color();
					}else if(Cat04_on){
						funcCat04_color();
					}else if(Cat05_on){
						funcCat05_color();
					}else if(Cat06_on){
						funcCat06_color();
					}else if(Cat07_on){
						funcCat07_color();
					}else {
					}
					chart_01_S();
					chart_02_S();
					chart_03_S();
					chart_04_S();
					chart_05_S();
					chart_06_S();
					chart_07_S();
					chart_08_S();
					chart_09_S();
					chart_10_S();
				},750);
			};
			
			function myCompare(a, b) {
				var cls_a = parseInt(a.classList, 10) || -1;
				var cls_b = parseInt(b.classList, 10) || -1;
				if (cls_a === cls_b) {
					var str_a = a.innerText || a.textContent;
					var str_b = b.innerText || b.textContent;
					return str_a.localeCompare(str_b);
				}else{
					return cls_b - cls_a;
				}
			};

			function reset() {
				active.classed("active", false);
				active = d3.select(null);
				var allPath = d3.selectAll("path");
				allPath.classed("active", false);
				setTimeout(function(){
					$('.ub-cbsa-list li').each(function(){
						$(this).removeClass("ub-cbsa-select");
					});
				},750);
				svg.transition()
					.duration(750)
					.call(zoom.translate([0, 0]).scale(1).event);
			};

			function resetTotal() {
				$('#ub-loading-overlay').css("display","block");
				setTimeout(function(){
					$('#ub-loading-overlay').fadeOut(800);
				},800);
				$('#ub-states-national').remove();
				Cat01_on=true;
				Cat02_on=false;Cat03_on=false;Cat04_on=false;Cat05_on=false;Cat06_on=false;Cat07_on=false;
				Cat_States_on=true;
				Cat_Middle_on=false;
				Cat_CBSA_on=false;
				areaCurrentGlobal=100;
				MapStates();
				funcCat01_S();
				d3.select("#ub-state-menu p").html('All states<span class="ub-initial"></span>');
				d3.select("#ub-cbsa-menu p").html('None selected<span class="ub-initial"></span>');
				d3.select("#ub-cbsa-menu .ub-cbsa-list").classed("ub-opened-long",false);
				$('.ub-data-container .ub-data-container-wrap p').text("All children");
				reset();
			}

			function zoomed() {
				g.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
			};
			// If the drag behavior prevents the default click, also stop propagation so we don’t click-to-zoom.
			function stopped() {
				if (d3.event.defaultPrevented) d3.event.stopPropagation();
			};
			
			function numberWithCommas(x) {
    			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
			


			d3.select(".ub-zoom.reset").on("click", resetTotal);

			d3.selectAll('.ub-button').on('click', function(){
    			d3.event.preventDefault();

    			var scale = zoom.scale(),
        		extent = zoom.scaleExtent(),
        		translate = zoom.translate(),
        		x = translate[0], y = translate[1],
        		factor = (this.id === 'zoom_in') ? 1.2 : 1/1.2,
        		target_scale = scale * factor;

   				// If we're already at an extent, done
   				// if (target_scale === extent[0] || target_scale === extent[1]) { return false; } THIS LINE COMMENTED BY MV
    			// If the factor is too much, scale it down to reach the extent exactly
    			var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
    			if (clamped_target_scale != target_scale){
        			target_scale = clamped_target_scale;
        			factor = target_scale / scale;
    			}
    			// Center each vector, stretch, then put back
    			x = (x - center[0]) * factor + center[0];
    			y = (y - center[1]) * factor + center[1];

    			// Transition to the new view over 350ms
    			d3.transition().duration(350).tween("zoom", function () {
        			var interpolate_scale = d3.interpolate(scale, target_scale), interpolate_trans = d3.interpolate(translate, [x,y]);
        			return function (t) {
            			zoom.scale(interpolate_scale(t))
                			.translate(interpolate_trans(t));
            			zoomed();
        			};
    			});
			});
			
			function moveMenusA(){
				var leftMenuA = $(".ub-data-container .ub-data-container-wrap");
				var rightMenusA = $(".ub-right-container .ub-right-container-wrap .ub-menus");
  				$("#usamap").find(".ub-data-container").append(leftMenuA);
				$("#usamap").find(".ub-right-container .ub-right-container-wrap").prepend(rightMenusA);				
			}

			function moveMenusB(){
				var leftMenuB = $(".ub-data-container .ub-data-container-wrap");
				var rightMenusB = $(".ub-right-container .ub-right-container-wrap .ub-menus");
				$("#factsheet").find(".ub-data-container").append(leftMenuB);
  				$("#factsheet").find(".ub-charts-container .ub-right-container .ub-right-container-wrap").append(rightMenusB);			
			}

		//	window.onload = function() {};
			$(document).click(function (e) {
    			e.stopPropagation();
    			var containerCat = $(".ub-data-container-wrap");
				var containerState = $("#ub-state-menu");
				var containerCbsa = $("#ub-cbsa-menu");

    			//check if the clicked area is dropDown or not
    			if (containerState.has(e.target).length === 0) {
					$('#ub-state-menu').removeClass("icon-opened");
					$('.ub-state-list').removeClass("state-opened");
    			}
    			if (containerCbsa.has(e.target).length === 0) {
					$('#ub-cbsa-menu').removeClass("icon-opened");
					$('.ub-cbsa-list').removeClass("cbsa-opened");
    			}
    			if (containerCat.has(e.target).length === 0) {
					$(".ub-data-container-wrap").removeClass("icon-opened");
					$(".ub-data-container-wrap ul").removeClass("cat-opened");
    			}
			});
			
			$(document).ready(function() {
				BrowserDetection();
				$('#ub-cbsa-menu').click(function(){
					$(this).toggleClass("icon-opened");
					$('.ub-cbsa-list').toggleClass("cbsa-opened");
					$('#ub-state-menu').removeClass("icon-opened");
					$('.ub-state-list').removeClass("state-opened");
				});
				$('#ub-state-menu').click(function(){
					$(this).toggleClass("icon-opened");
					$('.ub-state-list').toggleClass("state-opened");
					$('#ub-cbsa-menu').removeClass("icon-opened");
					$('.ub-cbsa-list').removeClass("cbsa-opened");
				});
				
				$('.ub-data-container-wrap').click(function(){
					$(this).toggleClass("icon-opened")
					$('.ub-data-container-wrap ul').toggleClass("cat-opened");
				//	$('.ub-data-container ul li').click(function(){
				//		$(this).parent().removeClass("cat-opened");
				//	});
				})
			});
			
			$('a[data-target="#usamap"]').on('shown.bs.tab', function (e) {
				moveMenusA();
			});
			$('a[data-target="#factsheet"]').on('shown.bs.tab', function (e) {
				moveMenusB();
			});
			$('a[data-target="#usamap"]').on('show.bs.tab', function (e) {
				$('#usamap').addClass('ub-in');
				$('#factsheet').removeClass('ub-in');
			});
			$('a[data-target="#factsheet"]').on('show.bs.tab', function (e) {
				$('#factsheet').addClass('ub-in');
				$('#usamap').removeClass('ub-in');
			});