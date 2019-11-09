// @TODO: YOUR CODE HERE!

// Width
var width = parseInt(d3.select("#scatter").style("width"));
// Height
var height = width/ 4;

// Margin
var Margin = 20;

var labelArea = 110;

// padding

var tPadBot = 40;
var tPadLeft = 40;

// Create the canvas for the graph??

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart")



var circRadius;
function crGet(){
    if (width <= 530){
        circRadius = 5;
    }
    else{
        circRadius = 10;
    
    }
}
crGet();



svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

function xTextRefresh(){
    xText.attr(
        "transform",
        "translate(" + ((width - labelArea)/2 + labelArea) +
        ", " +
        (height - margin - tPadBot) +
        ")"

    );
}
xTextRefresh();

xText
    .append("text")
    .attr("y",-26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("In Poverty (%)");

xText
    .append("text")
    .attr("y",0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median)");
xText
    .append("text")
    .attr("y",26)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household Income (Median)");

var leftTextX = margin + tPadLeft;
var leftTextY = (height+ labelArea) / 2 - labelArea;

svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");


function yTextRefresh(){
    yText.attr(
        "transform",
        "translate(" + leftTextX + ", "+ leftTextY + ")rotate(-90)"
    );
}

yTextRefresh();

yText
    .append("text")
    .attr("y",-26)
    .attr("data-name", "obesity")
    .attr("data-axis","y")
    .attr("class", "aText active y")
    .text("Obese (%)");
yText
    .append("text")
    .attr("y",0)
    .attr("data-name", "smokes")
    .attr("data-axis","y")
    .attr("class", "aText active y")
    .text("Smokes (%)");
yText
    .append("text")
    .attr("y",26)
    .attr("data-name", "healthcare")
    .attr("data-axis","y")
    .attr("class", "aText active y")
    .text("Lacks Healthcare (%)");

d3.csv("assets/data/data.csv").then(function(data) {
    // Visualize the data
    visualize(data);
});

function visualize(theData) {
var curX = "poverty";
var curY = "obesity";

var xMin;
var xMax;
var yMin;
var yMax;

var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40,-60])
    .html(function(d){
        console.log(d)
        var theX;

        var theState = "<div>" + curX + d.state+ "%</div>";

        var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
        
        if (curX === "poverty") {
            // Grab the x 
            theX = "<div>" + curX + ": " + d[curX] + "%</div>";

        }
        else{
            theX = "<div>" + 
                curX +
                ": "+
                parseFloat(d[curX]).toLocaleString("en") + 
                "</div>";
        }
        return theState + theX + theY;
    });
        // Call the toolTip function.
    svg.call(toolTip);
}
// Part 2
function xMinMax() {
    
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    // .max
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
}

  
function yMinMax() {
    
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
}

  // c. change the classes (and appearance) of label text when clicked.
function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
}

  // Part 3: Instantiate the Scatter Plot

  xMinMax();
  yMinMax();

  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);


  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);


function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
}
  tickCount();

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // We append the circles for each row of data (or each state, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // Matching Labels
  theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  // Part 4: Make the Graph Dynamic

  // Select all axis text and add this d3 click event.
  d3.selectAll(".aText").on("click", function() {
    // Make sure we save a selection of the clicked text,
    var self = d3.select(this);

    // We only want to run this on inactive labels.
    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

    
      if (axis === "x") {
        // Make curX the same as the data name.
        curX = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Update the domain of x.
        xScale.domain([xMin, xMax]);

        // Now use a transition when we update the xAxis.
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });


        labelChange(axis, self);
      }
      else {
        // When y is the saved axis, execute this:
        // Make curY the same as the data name.
        curY = name;

        // Change the min and max of the y-axis.
        yMinMax();

        // Update the domain of y.
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {

          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
    }
  });

  // Part 5: Mobile Responsive
  // =========================
  d3.select(window).on("resize", resize);

function resize() {
    // Redefine the width, height and leftTextY (the three variables dependent on the width of the window).
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    // Apply the width and height to the svg canvas.
    svg.attr("width", width).attr("height", height);

    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // With the scales changes, update the axes (and the height of the x-axis)
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    // Update the ticks on each axis.
    tickCount();

    // Update the labels.
    xTextRefresh();
    yTextRefresh();

    // Update the radius of each dot.
    crGet();

    // With the axis changed, let's update the location and radius of the state circles.
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });

    // We need change the location and size of the state texts, too.
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
}