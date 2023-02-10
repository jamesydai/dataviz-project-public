function plots() {
  var filePath = "data/subset_hate.csv";
  var q1_2_filePath = "data/q1_2.csv";
  question1(filePath);
  question2(filePath);
  question3(filePath);
  question4(filePath);
  question5(filePath);
  question6(filePath);

}

var question1 = function (filePath) {
  var svgheight_q1 = 600;
  var svgwidth_q1 = 1000;
  var padding = 150;
  svg_q1 = d3.select("#q1_plot")
    .append("svg")
    .attr("id", "q1plot")
    .attr("width", svgwidth_q1 + padding)
    .attr("height", svgheight_q1 + padding);
  const data_frame = d3.csv(filePath);
  data_frame.then(function (data) {
    // Pre sort the year, so don't need to sort rollup (which is tedious)
    sorted_year = data.sort((a, b) => d3.ascending(a.Year, b.Year));
    year_grouped = d3.rollup(sorted_year, v => v.length, d => d.Year);
    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    const tooltip = d3.select("#q1_plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");



    // A function that change this tooltip when the user hover a point.
    const mouseover = function (event, d) {
      tooltip
        .style("opacity", 1);
      tooltip
        .html('The exact count of hate crime in year ' + d3.format("d")(d[0]) + ' is: ' + d[1]);
      tooltip.style("left", event.pageX + "px").style("top", event.pageY + "px");
    };

    const mousemove = function (event, d) {
      tooltip
        .style("opacity", 1);
      tooltip
        .html('The exact count of hate crime in year ' + d3.format("d")(d[0]) + ' is: ' + d[1]);
      tooltip.style("left", event.pageX + "px" + "px").style("top", event.pageY + "px");

    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function (event, d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    };

    var xScale = d3.scaleBand()
      .domain(Array.from(year_grouped.keys()).reverse())
      .range([svgwidth_q1 - padding, 50]);

    var yScale = d3.scaleLinear().domain([0, d3.max(Array.from(year_grouped.values()))])
      .range([svgheight_q1, padding]);

    var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
    var yAxis = d3.axisLeft().scale(yScale);
    svg_q1.selectAll("circle_US")
      .data(year_grouped).enter().append("circle")
      .attr("cx", function (d, i) {
        return xScale(Array.from(year_grouped.keys())[i]) + 20;
      })
      .attr("cy", function (d) {
        return yScale(d[1]);
      })
      .attr("r", 5).attr("fill", d3.schemeCategory10[0])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);


    svg_q1.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0,570)");
    svg_q1.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(50,-30)");
    // Generating lines:
    var line = d3.line()
      .x(function (d, i) { return xScale(Array.from(year_grouped.keys())[i]) + 20; }) // set the x values for the line generator
      .y(function (d) {
        return yScale(d[1]);
      }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line
    svg_q1.append("path")
      .datum(year_grouped) // Binds data to the line
      .attr("fill", "none")
      .attr("stroke", d3.schemeCategory10[0])
      .attr("class", "line") // Assign a class for styling
      .attr("d", line);  // Calls the line generator

    // text label for the x axis
    svg_q1.append("text")
      .attr("transform",
        "translate(" + (svgwidth_q1 / 2) + " ," +
        (svgheight_q1 + 20) + ")")
      .style("text-anchor", "middle")
      .text("Year")
      .attr("id", "axis-title");

    // text label for the y axis
    svg_q1.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", -(svgheight_q1 / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("# of Hate Crimes")
      .attr("id", "axis-title");

  });
}

var question2 = function (filePath) {
  const dataset = d3.csv(filePath);
  var svgheight_q2 = 700;
  var svgwidth_q2 = 700;
  var padding = 150;
  svg_q2 = d3.select("#q2_plot").append("svg").attr("id", "q2plot").attr("width", svgwidth_q2).attr("height", svgheight_q2);
  const data_frame = d3.csv(filePath);
  data_frame.then(function (data) {
    draw(data, true);
    //radio button
    d3.selectAll(("input[name='type']")).on("change", function () {
      if (this.value == "victim") {
        var check_vic = true;
      } else if (this.value == "offender") {
        var check_vic = false;
      }
      draw(data, check_vic);
    });
    function draw(data, victim) {
      svg_q2.selectAll('*').remove();
      if (victim) {
        var grouped_race = d3.flatRollup(data, v => v.length, d => d.Victim_race, d => d.Offense);
        var flatten_race = grouped_race.map(([Victim_race, Offense, Count]) => ({ Offense, Victim_race, Count }));
        (flatten_race);
        var key = ["Assault", "Intimidation", "Others", "Property"];
        (flatten_race);
        var filter_assault = flatten_race.filter(function (d) {
          if (d["Offense"] == "Assault") {
            return d;
          }
        });
        var filter_assault_array = filter_assault.map(function (d) { return d.Count; })
        var filter_intimidation = flatten_race.filter(function (d) {
          if (d["Offense"] == "Intimidation") {
            return d;
          }
        });
        var filter_intimidation_array = filter_intimidation.map(function (d) { return d.Count; });
        var filter_others = flatten_race.filter(function (d) {
          if (d["Offense"] == "Others") {
            return d;
          }
        });
        var filter_others_array = filter_others.map(function (d) { return d.Count; });
        var filter_property = flatten_race.filter(function (d) {
          if (d["Offense"] == "Property") {
            return d;
          }
        });
        var filter_property_array = filter_property.map(function (d) { return d.Count; });
        var victim_race_arr = Array.from(d3.rollup(flatten_race, v => v.length, d => d.Victim_race).keys())
        var stack_data = [];
        for (let i = 0; i < victim_race_arr.length; i++) {
          stack_data.push({
            Victim_race: victim_race_arr[i], Assault: filter_assault_array[i], Intimidation: filter_intimidation_array[i],
            Others: filter_others_array[i], Property: filter_property_array[i]
          });
        }
        (stack_data);
        var series = d3.stack().keys(key)(stack_data);
        (series);
        // create a tooltip
        const Tooltip = svg_q2
          .append("text")
          .attr("text-anchor", "end")
          .attr("x", 650)
          .attr("y", 600)
          .style("opacity", 0)
          .style("font-size", 17);

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (event, d) {
          Tooltip.style("opacity", 1)
          d3.selectAll(".gbars").style("opacity", .2)
          d3.select(this).style("fill", "black")
          d3.select(this.parentNode)
            .style("stroke", "black")
            .style("opacity", 1)
        }
        const mousemove = function (event, d, i) {
          grp = d3.select(this.parentNode).datum().key;
          val = d.data[grp];
          Tooltip.text("There are " + val + " counts of " + grp + " recorded for " + d.data.Victim_race + " victims.");
        }
        const mouseleave = function (event, d) {
          Tooltip.style("opacity", 0)
          d3.selectAll(".gbars").style("opacity", 1).style("stroke", "none")
          d3.select(this).style("fill", d3.select(this.parentNode).attr("fill"))
        }
        // plotting stacked bar chart
        var xScale = d3.scaleBand()
          .domain(d3.range(victim_race_arr.length))
          .range([padding, svgwidth_q2 - padding])
          .paddingInner(0.05);

        var yScale = d3.scaleLinear()
          .domain([0, d3.max(stack_data, function (d) {
            return d.Assault + d.Intimidation + d.Others + d.Property;
          })])
          .range([svgheight_q2 - padding, padding]);
        /*group bars with respect to the secondary Key */
        var groups = svg_q2.selectAll(".gbars").data(series).enter().append("g")
          .attr("class", "gbars").attr("fill", function (d, i) { return d3.schemeCategory10[i] });
        //draw a bar for each Key value
        var rects = groups.selectAll("rect").data(function (d) {
          return d;
        }).enter().append("rect")
          .attr("x", function (d, i) {
            return xScale(i);
          }).attr("y", function (d) {
            return yScale(d[1]);
          }).attr("width", function (d) {
            return xScale.bandwidth();
          }).attr("height", function (d) {
            return yScale(d[0]) - yScale(d[1]);
          }).on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

        var xAxis = d3.axisBottom().scale(xScale);
        xAxis.tickFormat((d, i) => victim_race_arr[i]);
        var yAxis = d3.axisLeft().scale(yScale);
        svg_q2.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0,550)");
        svg_q2.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(150,0)");


        // Legend
        // Add one dot in the legend for each name.
        svg_q2.selectAll("mydots2")
          .data(key)
          .enter()
          .append("circle")
          .attr("cx", 550)
          .attr("cy", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill", function (d, i) { return d3.schemeCategory10[i] })

        // Add one dot in the legend for each name.
        svg_q2.selectAll("mylabels2")
          .data(key)
          .enter()
          .append("text")
          .attr("x", 570)
          .attr("y", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function (d, i) { return d3.schemeCategory10[i] })
          .text(function (d) { return d })
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
      } else {
        var grouped_race = d3.flatRollup(data, v => v.length, d => d.Offender_race, d => d.Offense);
        var flatten_race = grouped_race.map(([Offender_race, Offense, Count]) => ({ Offense, Offender_race, Count }));
        (flatten_race);
        var key = ["Assault", "Intimidation", "Others", "Property"];
        (flatten_race);
        var filter_assault = flatten_race.filter(function (d) {
          if (d["Offense"] == "Assault") {
            return d;
          }
        });
        var filter_assault_array = filter_assault.map(function (d) { return d.Count; })
        var filter_intimidation = flatten_race.filter(function (d) {
          if (d["Offense"] == "Intimidation") {
            return d;
          }
        });
        var filter_intimidation_array = filter_intimidation.map(function (d) { return d.Count; });
        var filter_others = flatten_race.filter(function (d) {
          if (d["Offense"] == "Others") {
            return d;
          }
        });
        var filter_others_array = filter_others.map(function (d) { return d.Count; });
        var filter_property = flatten_race.filter(function (d) {
          if (d["Offense"] == "Property") {
            return d;
          }
        });
        var filter_property_array = filter_property.map(function (d) { return d.Count; });
        var Offender_race_arr = Array.from(d3.rollup(flatten_race, v => v.length, d => d.Offender_race).keys())
        var stack_data = [];
        for (let i = 0; i < Offender_race_arr.length; i++) {
          stack_data.push({
            Offender_race: Offender_race_arr[i], Assault: filter_assault_array[i], Intimidation: filter_intimidation_array[i],
            Others: filter_others_array[i], Property: filter_property_array[i]
          });
        }
        (stack_data);
        var series = d3.stack().keys(key)(stack_data);
        (series);
        // create a tooltip
        const Tooltip = svg_q2
          .append("text")
          .attr("text-anchor", "end")
          .attr("x", 650)
          .attr("y", 600)
          .style("opacity", 0)
          .style("font-size", 17);

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (event, d) {
          Tooltip.style("opacity", 1)
          d3.selectAll(".gbars").style("opacity", .2)
          d3.select(this).style("fill", "black")
          d3.select(this.parentNode)
            .style("stroke", "black")
            .style("opacity", 1)
        }
        const mousemove = function (event, d, i) {
          grp = d3.select(this.parentNode).datum().key;
          val = d.data[grp];
          Tooltip.text("There are " + val + " counts of " + grp + " recorded for " + d.data.Offender_race + " offenders.");
        }
        const mouseleave = function (event, d) {
          Tooltip.style("opacity", 0)
          d3.selectAll(".gbars").style("opacity", 1).style("stroke", "none")
          d3.select(this).style("fill", d3.select(this.parentNode).attr("fill"))
        }
        // plotting stacked bar chart
        var xScale = d3.scaleBand()
          .domain(d3.range(Offender_race_arr.length))
          .range([padding, svgwidth_q2 - padding])
          .paddingInner(0.05);

        var yScale = d3.scaleLinear()
          .domain([0, d3.max(stack_data, function (d) {
            return d.Assault + d.Intimidation + d.Others + d.Property;
          })])
          .range([svgheight_q2 - padding, padding]);
        /*group bars with respect to the secondary Key */
        var groups = svg_q2.selectAll(".gbars").data(series).enter().append("g")
          .attr("class", "gbars").attr("fill", function (d, i) { return d3.schemeCategory10[i] });
        //draw a bar for each Key value
        var rects = groups.selectAll("rect").data(function (d) {
          return d;
        }).enter().append("rect")
          .attr("x", function (d, i) {
            return xScale(i);
          }).attr("y", function (d) {
            return yScale(d[1]);
          }).attr("width", function (d) {
            return xScale.bandwidth();
          }).attr("height", function (d) {
            return yScale(d[0]) - yScale(d[1]);
          }).on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

        var xAxis = d3.axisBottom().scale(xScale);
        xAxis.tickFormat((d, i) => Offender_race_arr[i]);
        var yAxis = d3.axisLeft().scale(yScale);
        svg_q2.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0,550)");
        svg_q2.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(150,0)");


        // Legend
        // Add one dot in the legend for each name.
        svg_q2.selectAll("mydots2")
          .data(key)
          .enter()
          .append("circle")
          .attr("cx", 550)
          .attr("cy", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill", function (d, i) { return d3.schemeCategory10[i] })

        // Add one dot in the legend for each name.
        svg_q2.selectAll("mylabels2")
          .data(key)
          .enter()
          .append("text")
          .attr("x", 570)
          .attr("y", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function (d, i) { return d3.schemeCategory10[i] })
          .text(function (d) { return d })
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
      }
    }
  });
}

var question3 = function (filePath) {
  var svgheight_q3 = 600;
  var svgwidth_q3 = 1000;
  var padding = 150;
  svg_q3 = d3.select("#q3_plot")
    .append("svg")
    .attr("id", "q3plot")
    .attr("width", svgwidth_q3 + padding)
    .attr("height", svgheight_q3 + padding);
  const data_frame = d3.csv(filePath);
  data_frame.then(function (data) {
    // Pre sort the city, so don't need to sort rollup (which is tedious)
    sorted_city = data.sort((a, b) => d3.ascending(a.City, b.City));
    offenders_grouped = d3.rollup(sorted_city, v => d3.mean(v, d => d.Offender_count), d => d.City);
    victims_grouped = d3.rollup(sorted_city, v => d3.mean(v, d => d.Victim_count), d => d.City);
    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    const tooltip = d3.select("#q3_plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");



    // A function that change this tooltip when the user hover a point.
    const mouseover = function (event, d) {
      tooltip
        .style("opacity", 1);
      tooltip
        .html(d[0] + "<br> Average of count of offenders: " + d[1] + '<br> Average of count of victims: ' + yScale.invert(d3.select(this).attr("cy")));
      tooltip.style("left", event.pageX + "px").style("top", event.pageY + "px");
    };

    const mousemove = function (event, d) {
      tooltip
        .style("opacity", 1);
      tooltip
        .html(d[0] + "<br> Average of count of offenders: " + d[1] + '<br> Average of count of victims: ' + yScale.invert(d3.select(this).attr("cy")));
      tooltip.style("left", event.pageX + "px").style("top", event.pageY + "px");

    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function (event, d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    };
    var xScale = d3.scaleLinear()
      .domain([0, 10])
      .range([50, svgwidth_q3]);

    var yScale = d3.scaleLinear().domain([0, 10])
      .range([svgheight_q3 - 30, padding]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
    svg_q3.selectAll("circle_OV")
      .data(offenders_grouped).enter().append("circle")
      .attr("cx", function (d, i) {
        return xScale(Array.from(offenders_grouped.values())[i]);
      })
      .attr("cy", function (d, i) {
        return yScale(Array.from(victims_grouped.values())[i]);
      })
      .attr("r", 5).attr("fill", d3.schemeCategory10[0])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);


    svg_q3.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0,570)");
    svg_q3.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(50,0)");

    // text label for the x axis
    svg_q3.append("text")
      .attr("transform",
        "translate(" + (svgwidth_q3 / 2) + " ," +
        (svgheight_q3 + 20) + ")")
      .style("text-anchor", "middle")
      .text("Average Number of Victims")
      .attr("id", "axis-title");

    // text label for the y axis
    svg_q3.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", -(svgheight_q3 / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average Number of Offenders")
      .attr("id", "axis-title");
  });
}

var question4 = function (filePath) {
  var svgheight_q4 = 700;
  var svgwidth_q4 = 700;
  var padding = 150;
  svg_q4 = d3.select("#q4_plot").append("svg").attr("id", "q4plot").attr("width", svgwidth_q4).attr("height", svgheight_q4);
  var rowConverter = function (d) {
    return {
      Region: d.Region,
      Juvenile_Offender_Count: parseFloat(d.Juvenile_Offeneder_Count)
    };
  }
  const data_frame = d3.csv(filePath, rowConverter);
  data_frame.then(function (data) {
    // Filter null values
    var null_filter = data.filter(function (d) {
      if (d["Juvenile_Offender_Count"] != 0) {
        return d;
      }
    });
    (null_filter);
    sorted_region = null_filter.sort((a, b) => d3.ascending(a.Region, b.Region));
    juvenile_grouped = d3.rollup(sorted_region, v => [
      d3.quantile(v.map(function(g) { return g.Juvenile_Offender_Count;}).sort(d3.ascending),.25),
      d3.quantile(v.map(function(g) { return g.Juvenile_Offender_Count;}).sort(d3.ascending),.5),
      d3.quantile(v.map(function(g) { return g.Juvenile_Offender_Count;}).sort(d3.ascending),.75),
      d3.quantile(v.map(function(g) { return g.Juvenile_Offender_Count;}).sort(d3.ascending),.75) - d3.quantile(v.map(function(g) { return g.Juvenile_Offender_Count;}).sort(d3.ascending),.25),
      d3.min(v.map(function(g) { return g.Juvenile_Offender_Count;})),
      d3.max(v.map(function(g) { return g.Juvenile_Offender_Count;}))
    ],d => d.Region);
    (juvenile_grouped);
    var xScale = d3.scaleBand()
      .domain(Array.from(juvenile_grouped.keys()).reverse())
      .range([svgwidth_q4 - padding, 50]);

    var yScale = d3.scaleLinear().domain([0, d3.max(sorted_region, d=> d.Juvenile_Offender_Count)])
      .range([svgheight_q4 - padding, padding]);
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
    svg_q4.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0,550)");
    svg_q4.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(50,0)");
    // Show the main vertical line
  svg_q4
    .selectAll("vertLines")
    .data(juvenile_grouped)
    .enter()
    .append("line")
      .attr("x1", function(d){return(xScale(Array.from(d.values())[0]) + 63)})
      .attr("x2", function(d){return(xScale(Array.from(d.values())[0]) + 63)})
      .attr("y1", function(d){
        (Array.from(d.values()));
        return(yScale(Array.from(d.values())[1][4]))})
      .attr("y2", function(d){return(yScale(Array.from(d.values())[1][5]))})
      .attr("stroke", "black")
      .style("width", 40)
      // rectangle for the main box
      var boxWidth = 100
      svg_q4
        .selectAll("boxes")
        .data(juvenile_grouped)
        .enter()
        .append("rect")
            .attr("x", function(d){return(xScale(Array.from(d.values())[0])-boxWidth/2 + 63)})
            .attr("y", function(d){return(yScale(Array.from(d.values())[1][2]))})
            .attr("height", function(d){return(yScale(Array.from(d.values())[1][0]) - yScale(Array.from(d.values())[1][2]))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

      // Show the median
      svg_q4
        .selectAll("medianLines")
        .data(juvenile_grouped)
        .enter()
        .append("line")
          .attr("x1", function(d){return(xScale(Array.from(d.values())[0])-boxWidth/2 + 63) })
          .attr("x2", function(d){return(xScale(Array.from(d.values())[0])+boxWidth/2 + 63) })
          .attr("y1", function(d){return(yScale(Array.from(d.values())[1][1]))})
          .attr("y2", function(d){return(yScale(Array.from(d.values())[1][1]))})
          .attr("stroke", "black")
          .style("width", 80)
  });
}


var question5 = function (filePath) {
  var svgheight_q5 = 700;
  var svgwidth_q5 = 700;
  var padding = 150;
  svg_q5 = d3.select("#q5_plot")
    .append("svg")
    .attr("id", "q5plot")
    .attr("width", svgwidth_q5 + padding)
    .attr("height", svgheight_q5 + padding);
  const data_frame = d3.csv(filePath);
  data_frame.then(function (data) {
    // Filter null values
    var null_filter = data.filter(function (d) {
      if (d["Offender_race"] != "") {
        return d;
      }
    });
    // Pre sort the race so that the label would be come out as sorted
    sorted_offenders = null_filter.sort((a, b) => d3.ascending(a.Offender_race, b.Offender_race));
    sorted_victims = sorted_offenders.sort((a, b) => d3.ascending(a.Victim_race, b.Victim_race));
    var grouped_offenders = d3.rollup(sorted_victims,
      v => v.length,
      d => d.Offender_race);
    var grouped_victims = d3.rollup(sorted_victims,
      v => v.length,
      d => d.Victim_race);
    var offenders = Array.from(grouped_offenders.keys());
    var victims = Array.from(grouped_victims.keys());
    var grouped = d3.flatRollup(sorted_victims,
      v => v.length,
      d => d.Victim_race, d => d.Offender_race);
    (grouped);
    var mapped = grouped.map(([Victim_race, Offender_race, Value]) => ({ Victim_race, Offender_race, Value }));
    var grouped_roll = d3.rollup(sorted_victims,
      v => v.length,
      d => d.Victim_race, d => d.Offender_race);

    var xScale = d3.scaleBand()
      .domain(offenders)
      .range([padding, svgwidth_q5 - padding])
      .paddingInner(0.05);

    var yScale = d3.scaleBand()
      .domain(victims)
      .range([svgheight_q5 - padding, padding])
      .paddingInner(0.05);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
    svg_q5.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0,550)");
    svg_q5.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(150,0)");
    // Build color scale
    const scaleFactor = 0.25;
    const myColor = d3.scaleSequential()
      .domain([1, (8591 ** scaleFactor)]).interpolator(d3.interpolateRgb("white", "#08306B"));
    // create a tooltip
    const tooltip_4 = d3.select("#q5_plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // A function that change this tooltip when the user hover a point.
    const mouseover = function (event, d) {
      tooltip_4
        .style("opacity", 1);
      tooltip_4
        .html(d.Offender_race + '/ ' + d.Victim_race + ' : ' + d.Value);
      tooltip_4.style("left", event.pageX + "px").style("top", event.pageY + "px");
    };

    const mousemove = function (event, d) {
      tooltip_4
        .html(d.Offender_race + '/ ' + d.Victim_race + ' : ' + d.Value);
      tooltip_4.style("left", event.pageX + "px").style("top", event.pageY + "px");

    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function (event, d) {
      tooltip_4
        .transition()
        .duration(200)
        .style("opacity", 0)
    };

    // add the squares
    svg_q5.selectAll()
      .data(mapped, function (d) { return d.Victim_race + ':' + d.Offender_race; })
      .enter()
      .append("rect")
      .attr("x", function (d) { return xScale(d.Victim_race); })
      .attr("y", function (d, i) { return yScale(d.Offender_race); })
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", function (d, i) { return myColor(d.Value ** scaleFactor); })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)


    // text label for the x axis
    svg_q5.append("text")
      .attr("transform",
        "translate(" + (svgwidth_q5 / 2) + " ," +
        (svgheight_q5 - padding + 50) + ")")
      .style("text-anchor", "middle")
      .text("Victim Race")
      .attr("id", "axis-title");

    // text label for the y axis
    svg_q5.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", -(svgheight_q5 / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Offender Race")
      .attr("id", "axis-title");
  });


}
var question6 = function (filePath) {
  var svgheight_q6 = 700;
  var svgwidth_q6 = 700;
  var padding = 150;
  svg_q6 = d3.select("#q6_plot").append("svg").attr("id", "q6plot").attr("viewBox", [0, 0, 975, 610]);

  const data_frame = d3.csv(filePath);
  data_frame.then(function (data) {
    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    const tooltip = d3.select("#q6_plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");



    // A function that change this tooltip when the user hover a point.
    const mouseover = function (event, d) {
      d3.selectAll(".Country")
        .style("opacity", .5)
      d3.select(this)
        .style("opacity", 1)
        .style("fill", "red")
        .style("stroke", "black")
      tooltip
        .style("opacity", 1);
      tooltip
        .html(d.properties.name + '<br> Total count of hate crimes: ' + data.get(d.properties.name));
      tooltip.style("left", event.pageX + "px").style("top", event.pageY + "px");
    };

    const mousemove = function (event, d) {
      d3.selectAll(".Country")
        .style("opacity", .5)
      d3.select(this)
        .style("opacity", 1)
        .style("fill", "red")
        .style("stroke", "black")
      tooltip
        .style("opacity", 1);
      tooltip
        .html(d.properties.name + '<br> Total count of hate crimes: ' + data.get(d.properties.name));
      tooltip.style("left", event.pageX + "px").style("top", event.pageY + "px");

    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function (event, d) {
      d3.selectAll(".Country")
        .style("opacity", 1)
      d3.select(this)
        .style("fill", color(data.get(d.properties.name) ** 0.25))
        .style("stroke", "white")
      tooltip
        .style("opacity", 0)
    };
    // Pre sort the state so that the label would be come out as sorted
    sorted_state = data.sort((a, b) => d3.ascending(a.State, b.State));
    var grouped_state = d3.flatRollup(sorted_state,
      v => v.length,
      d => d.State);
    var data = grouped_state.map(([State, Value]) => ({ State, Value }));
    console.log(d3.min(data, d => d.Value))
    const scaleFactor = 0.25;
    var color = d3.scaleSequential()
      .domain([d3.min(data, d => d.Value) ** scaleFactor, d3.max(data, d => d.Value) ** scaleFactor]).interpolator(d3.interpolateBlues);
    var data = d3.rollup(sorted_state,
      v => v.length,
      d => d.State);
    var path = d3.geoPath()
    var format = d => `${d}%`
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json").then(function (geojson) {
      svg_q6.append("g")
        .attr("transform", "translate(610,20)");

      svg_q6.append("g")
        .selectAll("path")
        .data(topojson.feature(geojson, geojson.objects.states).features)
        .join("path")
        .attr("fill", d => color(data.get(d.properties.name) ** scaleFactor))
        .attr("d", path)
        .attr("class", function (d) { return "States" })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

      svg_q6.append("path")
        .datum(topojson.mesh(geojson, geojson.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);


    });
  });

}
