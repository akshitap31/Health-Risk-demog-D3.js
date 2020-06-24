var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;
var labelArea= 110
var margin = 20;
var tpadBottom=40;
var tpadLeft=40; 
// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin}, ${margin})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";
// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]),
      d3.max(data, d => d[chosenXAxis])
    ])
    .range([margin+labelArea, width-margin]);

  return xLinearScale;

}
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]),
      d3.max(data, d => d[chosenYAxis])
    ])
    .range([height-margin-labelArea, margin]);

  return yLinearScale;

}
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d=> newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var ylabel;
  var xlabel;

  if (chosenXAxis === "poverty") {
    if (chosenYAxis === "obesity"){
      ylabel= "Obesity: "
      xlabel = "Poverty(%): ";
    }
    else if (chosenYAxis === "smokes"){
      ylabel= "Smokes"
      xlabel = "Poverty(%): ";
    }
    else if (chosenYAxis=== "healthcare"){
      ylabel= "Healthcare: "
      xlabel = "Poverty(%): ";
    }  
  }
  else if(chosenXAxis === "age"){
    if (chosenYAxis === "obesity"){
      ylabel= "Obesity: "
      xlabel = "Age(median): ";
    }
    else if (chosenYAxis === "smokes"){
      ylabel= "Smokes"
      xlabel = "Age(median): ";
    }
    else if (chosenYAxis=== "healthcare"){
      ylabel= "Healthcare: "
      xlabel = "Age(median): ";
    }  
  }

  else if (chosenXAxis === "income"){
    if (chosenYAxis === "obesity"){
      ylabel= "Obesity: "
      xlabel = "Household Income(median): ";
    }
    else if (chosenYAxis === "smokes"){
      ylabel= "Smokes"
      xlabel = "Household Income(median): ";
    }
    else if (chosenYAxis=== "healthcare"){
      ylabel= "Healthcare: "
      xlabel = "Household Income(median): ";
    }  
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    // .classed("d3-tip", true)
    .offset([80, -60])
    .html(function(d) {
      return (`${ylabel}${d[chosenYAxis]}%<br>${xlabel} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
  if (err) throw err;

  // parse data
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.age = +d.age;
    d.obesity = +d.obesity;
    d.smokes = +d.smokes;
    d.healthcare = +d.healthcare;
    d.income = +d.income;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(data, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .classed("stateCircle", true)
    .attr("opacity", ".5");
  // circlesGroup.
  
  // append("text")
  //   .text(d=> d.abbr)
  // Create group for three x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (median)");


var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (median)");

var ylabelsGroup = chartGroup.append("g")
.attr("transform", "rotate(-90)")
// .attr("y", 0 - margin.left)
// .attr("x", 0 - (height / 2))
// .attr("dy", "1em")
  

  var obesityLabel = ylabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -20)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obesity (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smpokes (%)");


var healthcareLabel = ylabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -60)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Healthcare (%)");

//   // append y axis
//   chartGroup.append("text")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("value");

     if (yvalue !== chosenYAxis) {
      chosenYAxis = yvalue;
      console.log(chosenYAxis)
      yLinearScale = yScale(data, chosenYAxis);
      yAxis= renderYAxes(yLinearScale, yAxis);
      circlesGroup = renderCircles(circlesGroup,yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);

        // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
      if (chosenYAxis === "obesity"){
        obesityLabel
      .classed("active", true)
      .classed("inactive", false);
      smokesLabel
      .classed("active", false)
      .classed("inactive", true);
      healthcareLabel
      .classed("active", false)
      .classed("inactive", true);
      }
      else if (chosenYAxis === "smokes"){
        obesityLabel
      .classed("active", false)
      .classed("inactive", true);
      smokesLabel
      .classed("active", true)
      .classed("inactive", false);
      healthcareLabel
      .classed("active", false)
      .classed("inactive", true);
      }
      else if (chosenYAxis === "healthcare"){
        obesityLabel
      .classed("active", false)
      .classed("inactive", true);
      smokesLabel
      .classed("active", false)
      .classed("inactive", true);
      healthcareLabel
      .classed("active", true)
      .classed("inactive", false);
      }
     }
    });
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;
        
        console.log(chosenXAxis)
        
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);
        
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
       
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup,yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//         // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            
        }
        else if (chosenXAxis === "age"){
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {

          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});
