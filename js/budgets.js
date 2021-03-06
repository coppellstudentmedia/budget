function drawBudgetChartGeneral(w) {
    // constant margins, width, and height
    var margin = {top: 50, right: 200, bottom: 20, left: 0};
    var width = w - margin.left - margin.right;
    var height = 120 - margin.top - margin.bottom;

    // set up our scales
    var x = d3.scaleLinear().range([0, width]);

    // make our svgs
    var svgGeneral = d3.select(".budget-charts").append("div").append("svg")
        .attr("class", "general-budget")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);


    // add a title for the main bar
    svgGeneral.append("text")
        .attr("class", "chart-title")
        .attr("x", 0)
        .attr("y",  margin.top / 2)
        .text("Coppell ISD General Budget Breakdown");





    // add in our general budget data and plot!!
    d3.csv("./data/general_budget_breakdown_groups.csv").then(function(data) {

        // format the data
        data.forEach(function(d) {
            d.proposed = +d["Proposed Budget"];
            d.name = d["General Fund"];
        });

        data = data.slice().sort((a, b) => d3.descending(a.proposed, b.proposed));

        // add the stack attributes to the data
        const total = d3.sum(data, d => d.proposed);
        let value = 0;
        var stack = data.map(d => ({
            name: d.name,
            amount: d.proposed,
            value: d.proposed / total,
            startValue: (value / total),
            endValue: (value += d.proposed) / total
        }));

        var bars = svgGeneral.append("g")
            .selectAll("rect")
            .data(stack)
            .enter()
            .append("rect")
            .attr("fill", "var(--secondary)")
            .attr("x", d => x(d.startValue))
            .attr("y", margin.top)
            .attr("width", d => x(d.endValue) - x(d.startValue) - 1)
            .attr("height", height);
        var tooltip = generateTooltip(svgGeneral);

        bars.on("mouseover", function() {
            d3.select(this).transition()
                .attr("fill", "var(--secondary-light)");
            tooltip.attr("display", "inline");
        })
        .on("mouseout", function() {
            d3.select(this).transition()
                .attr("fill", "var(--secondary)");
            tooltip.attr("display", "none");
        })
        .on("mousemove", function(event, data) {
            var x0 = d3.pointer(event, this)[0],
            y0 = d3.pointer(event, this)[1];

            tooltip.attr("transform", `translate(${x0}, ${y0})`);
            tooltip.select(".tooltip-group").text(data.name);
            tooltip.select(".tooltip-amount").text(formatCurrency(data.amount));
            });
        
    });
}


function drawRevenueChart(w) {
    // constant margins, width, and height
    var margin = {top: 50, right: 200, bottom: 20, left: 0};
    var width = w - margin.left - margin.right;
    var height = 120 - margin.top - margin.bottom;

    // set up our scales
    var x = d3.scaleLinear().range([0, width]);

    // make our svgs
    var svgRevenue = d3.select(".budget-charts").append("div").append("svg")
        .attr("class", "revenue-budget")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("opacity", 0);


    // add a title for the main bar
    svgRevenue.append("text")
        .attr("class", "chart-title")
        .attr("x", 0)
        .attr("y",  margin.top / 2)
        .text("Revenue Sources");




    // add in our general revenue data and plot!!
    d3.csv("./data/general_revenue.csv").then(function(data) {

        // format the data
        data.forEach(function(d) {
            d.projected = +d["Amount Projected"];
            d.name = d["Source"];
        });

        // add the stack attributes to the data
        const total = d3.sum(data, d => d.projected);
        let value = 0;
        var stack = data.map(d => ({
            name: d.name,
            amount: d.projected,
            value: d.projected / total,
            startValue: (value / total),
            endValue: (value += d.projected) / total
        }));

        var bars = svgRevenue.append("g")
            .selectAll("rect")
            .data(stack)
            .enter()
            .append("rect")
            .attr("fill", function(data) {
                if (data.name == "Deficit") return "var(--secondary-light)";
                else return "var(--secondary)";
            })
            .attr("x", d => x(d.startValue))
            .attr("y", margin.top)
            .attr("width", d => x(d.endValue) - x(d.startValue) - 1)
            .attr("height", height);
        var tooltip = generateTooltip(svgRevenue);

        bars.on("mouseover", function() {
            d3.select(this).transition()
                .attr("fill", "var(--secondary-light)");
            tooltip.attr("display", "inline");
        })
        .on("mouseout", function() {
            d3.select(this).transition()
                .attr("fill", function(data) {
                    if (data.name == "Deficit") return "var(--secondary-light)";
                    else return "var(--secondary)";
                });
            tooltip.attr("display", "none");
        })
        .on("mousemove", function(event, data) {
            var x0 = d3.pointer(event, this)[0],
            y0 = d3.pointer(event, this)[1];

            tooltip.attr("transform", `translate(${x0}, ${y0})`);
            tooltip.select(".tooltip-group").text(data.name);
            tooltip.select(".tooltip-amount").text(formatCurrency(data.amount));
            });
        
    });

    return svgRevenue;
}


// default off
function drawBudgetChartsSecondary(w) {

    var margin = {top: 50, right: 200, bottom: 20, left: 0};
    var width = w - margin.left - margin.right;
    var height = 120 - margin.top - margin.bottom;

    // -------- CREATE STATIC BARS --------
    var svgDebt = d3.select(".budget-charts").append("div").append("svg")
            .attr("class", "debt-budget")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("opacity", 0); // set opacity

        svgDebt.append("text")
            .attr("class", "chart-title")
            .attr("x", 0)
            .attr("y",  margin.top * 0.75)
            .text("Debt Service Budget")
            .style("font-size", "14px");

        var debtBar = svgDebt.append("rect")
            .attr("x", 0)
            .attr("y", margin.top)
            .attr("width", width * 0.221)
            .attr("height", height)
            .attr("fill", "var(--secondary)");

    var svgFood = d3.select(".budget-charts").append("svg")
        .attr("class", "food-budget")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("opacity", 0); // set opacity to 0

        svgFood.append("text")
            .attr("class", "chart-title")
            .attr("x", 0)
            .attr("y",  margin.top * 0.75)
            .text("Food Service Budget")
            .style("font-size", "14px");

        var foodBar = svgFood.append("rect")
            .attr("x", 0)
            .attr("y", margin.top)
            .attr("width", width * 0.033)
            .attr("height", height)
            .attr("fill", "var(--secondary)");

    var debtToolTip = generateTooltip(svgDebt);
    var foodTooltip = generateTooltip(svgFood);



    // tooltips galore for our static bars

    debtBar.on("mouseover", function() {
        d3.select(this).transition()
            .attr("fill", "var(--secondary-light)");
        debtToolTip.attr("display", "inline");
    })
    .on("mouseout", function() {
        d3.select(this).transition()
            .attr("fill", "var(--secondary)");
        debtToolTip.attr("display", "none");
    })
    .on("mousemove", function(event) {
        var x0 = d3.pointer(event, this)[0],
        y0 = d3.pointer(event, this)[1];

        debtToolTip.attr("transform", `translate(${x0}, ${y0})`);
        debtToolTip.select(".tooltip-group").text("Debt Service Expenditures");
        debtToolTip.select(".tooltip-amount").text(formatCurrency(35650331));
    });

    foodBar.on("mouseover", function() {
        d3.select(this).transition()
            .attr("fill", "var(--secondary-light)");
        foodTooltip.attr("display", "inline");
    })
    .on("mouseout", function() {
        d3.select(this).transition()
            .attr("fill", "var(--secondary)");
        foodTooltip.attr("display", "none");
    })
    .on("mousemove", function(event) {
        var x0 = d3.pointer(event, this)[0],
        y0 = d3.pointer(event, this)[1];

        foodTooltip.attr("transform", `translate(${x0}, ${y0})`);
        foodTooltip.select(".tooltip-group").text("Food Service Expenditures");
        foodTooltip.select(".tooltip-amount").text(formatCurrency(5350900));
    });
    
    return svgDebt, svgFood;
}


// ------- HELPER FUNCTIONS -------


// format currency
function formatCurrency(amount) { return "$" + d3.format(",.2f")(amount); };


// hide/show charts

function showChart(svg) {
    svg
    .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("opacity", 1);
}

function hideChart(svg) {
    svg
    .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("opacity", 0);
}


// used to generate tooltip, but not display them
function generateTooltip(svg) {
    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .attr("display", "none");

    tooltip.append("rect")
        .attr("x", 0)
        .attr("y", -25)
        .attr("width", 200)
        .attr("height", 40)
        .attr("pointer-events", "none")
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "white");
    
    tooltip.append("text")
        .attr("class", "tooltip-group")
        .attr("x", 10)
        .attr("y", -8)
        .text("group");

    tooltip.append("text")
        .attr("class", "tooltip-amount")
        .style("font-weight", "normal")
        .attr("x", 10)
        .attr("y", 7)
        .text("amount");

    return tooltip;
}