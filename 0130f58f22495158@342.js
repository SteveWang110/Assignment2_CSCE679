import define1 from "./a33468b95d0b15b0@817.js";

function _1(md){return(
md`# Assignment 2

`
)}

function _temperature_daily(__query,FileAttachment,invalidation){return(
__query(FileAttachment("temperature_daily.csv"),{from:{table:"temperature_daily"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _d3(require){return(
require('d3@7')
)}

function _data(FileAttachment){return(
FileAttachment("temperature_daily.csv").csv({typed: true})
)}

function _processedData(d3,data){return(
Array.from(
  d3.rollup(
    data,
    (rows) => ({  //Data summary, simple max and min calculation for grouped data
      max_temperature: d3.max(rows, (d) => d.max_temperature),
      min_temperature: d3.min(rows, (d) => d.min_temperature),
    // Group data by day within the month-year group for challenge 2
      dailyTemps: Array.from(
        d3.rollup(
          rows,
          (dayRows) => ({
            maxTemp: d3.max(dayRows, (d) => d.max_temperature),
            minTemp: d3.min(dayRows, (d) => d.min_temperature),
          }),
          (d) => new Date(d.date).getUTCDate() // Group by day of the month
        ),
        ([day, temps]) => ({ day, ...temps }) // back to array format
      ),

    }),

    
    (d) => {  //Group data by Year-Month for max and min temps
      const date = new Date(d.date);
      return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
    }
  ),
  ([key, value]) => { //New object processedData array containing year, month, maxtemp, and mintemp
    const [year, month] = key.split("-").map(Number);
    return { year, month, ...value };
  }
)
)}

function _tempType(Inputs){return(
Inputs.radio(["max_temperature", "min_temperature"], {
  label: "Select Temperature Type",
  value: "max_temperature" 
})
)}

function _heatmap(processedData,d3,Legend,tempType)
{
  const width = 1000;
  const height = 500;
  const margin = { top: 50, right: 50, bottom: 100, left: 100 };

  // Years and month ticks
  const years = Array.from(new Set(processedData.map(d => d.year))).sort(d3.ascending);
  const months = d3.range(1, 13);
  
  const xScale = d3.scaleBand().domain(years).range([margin.left, width - margin.right]).padding(0.1);
  const yScale = d3.scaleBand().domain(months).range([margin.top, height - margin.bottom]).padding(0.1);

  //For Legend domain
  const minTemp = 0;
  const maxTemp = 40;

  //Creating legend scale and values 

const customInterpolator = (t) => {
  const tempRange = 40; // Total temperature range
  const temp = t * tempRange; // Map t to temperature

  if (temp < 4) return "#8000ff"; // (0-4)
  else if (temp < 8) return "#0084ff"; // (4-8)
  else if (temp < 12) return "#00ffc8"; // (8-12)
  else if (temp < 16) return "#CCFFCC"; // (12-16)
  else if (temp < 20) return "#c3ff00"; // (16-20)
  else if (temp < 24) return "#e8e1e1"; // (20-24)
  else if (temp < 28) return "#fffb00"; // (24-28)
  else if (temp < 32) return "#ff8000"; // (28-32)
  else if (temp < 36) return "#FF0000"; // (32-36)
  else return "#660033"; // (36-40)
};
const legend = Legend(d3.scaleSequential()
  .domain([0, 40])
  .interpolator(customInterpolator), {
  title: "Legend: Temperature (°C)"
});

const colorScale = d3.scaleThreshold()
  .domain([4, 8, 12, 16, 20, 24, 28, 32, 36]) // Thresholds
  .range([
    "#8000ff", // (0-4)
    "#0084ff", // (4-8)
    "#00ffc8", // (8-12)
    "#CCFFCC", // (12-16)
    "#c3ff00", // (16-20)
    "#e8e1e1",  // (20-24)
    "#fffb00", // (24-28)
    "#ff8000", // (28-32)
    "#FF0000",  // (32-36)
    "#660033"   // (36-40)
  ]);

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);
  // Select all rectangles and bind data to them, cells are organized by year and month.
  const cells = svg.selectAll("g.cell")
    .data(processedData)
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", d => `translate(${xScale(d.year)}, ${yScale(d.month)})`);

  // Append heatmap rectangles
  cells.append("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", d => colorScale(d[tempType]))
    .on("mouseover", function(event, d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 1);
      tooltip.style("opacity", 1)
        .html(`Date: ${d.year}-${String(d.month).padStart(1, "0")}; max: ${d.max_temperature}, min: ${d.min_temperature}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mouseout", function() {  // Delete styling from mouseover when hovering away from rectangle
      d3.select(this).attr("stroke", "none");
      tooltip.style("opacity", 0);
    });

  // Appending labels for top and left axis
  svg.append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(xScale).tickFormat(d3.format("d")));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickFormat(m => d3.timeFormat("%B")(new Date(2000, m - 1))));

// Appending Legend to d3 graph
const legendGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${height - margin.bottom + 20})`); // Adjust the y value to position below the heatmap

legendGroup.append(() => legend);
  
  // Tooltip for when hovering over a rectangle
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "4px")

  return svg.node();
}


function _processedData2(processedData){return(
processedData.filter(d => d.year >= 2008 && d.year <= 2017)
)}

function _heatmap2(processedData2,d3,Legend,tempType)
{
  const width = 800;
  const height = 500;
  const margin = { top: 50, right: 50, bottom: 100, left: 100 };

  // Years and month ticks
  const years = Array.from(new Set(processedData2.map(d => d.year))).sort(d3.ascending);
  const months = d3.range(1, 13);
  
  const xScale = d3.scaleBand().domain(years).range([margin.left, width - margin.right]).padding(0.1);
  const yScale = d3.scaleBand().domain(months).range([margin.top, height - margin.bottom]).padding(0.1);

  //For Legend domain
  const minTemp = 0;
  const maxTemp = 40;

  //Creating legend scale and values 

  const customInterpolator = (t) => {
  const tempRange = 40; // Total temperature range
  const temp = t * tempRange; // Map t to temperature

  if (temp < 4) return "#8000ff"; // (0-4)
  else if (temp < 8) return "#0084ff"; // (4-8)
  else if (temp < 12) return "#00ffc8"; // (8-12)
  else if (temp < 16) return "#CCFFCC"; // (12-16)
  else if (temp < 20) return "#c3ff00"; // (16-20)
  else if (temp < 24) return "#e8e1e1"; // (20-24)
  else if (temp < 28) return "#fffb00"; // (24-28)
  else if (temp < 32) return "#ff8000"; // (28-32)
  else if (temp < 36) return "#FF0000"; // (32-36)
  else return "#660033"; // (36-40)
};
const legend = Legend(d3.scaleSequential()
  .domain([0, 40])
  .interpolator(customInterpolator), {
  title: "Legend: Temperature (°C)"
});

const colorScale = d3.scaleThreshold()
  .domain([4, 8, 12, 16, 20, 24, 28, 32, 36]) // Thresholds
  .range([
    "#8000ff", // (0-4)
    "#0084ff", // (4-8)
    "#00ffc8", // (8-12)
    "#CCFFCC", // (12-16)
    "#c3ff00", // (16-20)
    "#e8e1e1",  // (20-24)
    "#fffb00", // (24-28)
    "#ff8000", // (28-32)
    "#FF0000",  // (32-36)
    "#660033"   // (36-40)
  ]);

  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

  // Select all groups and bind data to them
  const cells = svg.selectAll("g.cell")
    .data(processedData2)
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", d => `translate(${xScale(d.year)}, ${yScale(d.month)})`);

  // Append heatmap rectangles
  cells.append("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", d => colorScale(d[tempType]))
    .on("mouseover", function(event, d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 1);
      tooltip.style("opacity", 1)
        .html(`Date: ${d.year}-${String(d.month).padStart(1, "0")}; max: ${d.max_temperature}, min: ${d.min_temperature}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mouseout", function() {  // Delete styling from mouseover when hovering away from rectangle
      d3.select(this).attr("stroke", "none");
      tooltip.style("opacity", 0);
    });

  // Scales for mini line graphs
  const xScaleDay = d3.scaleLinear()
    .domain([1, 31]) // Days of the month
    .range([0, xScale.bandwidth()]); 

  const yScaleTemp = d3.scaleLinear()
    .domain([5, 40]) // Temperature range
    .range([yScale.bandwidth(), 0]); 

  // Define line generators for minimum temp and maximum temp lines
  const lineMax = d3.line()
    .x(d => xScaleDay(d.day))
    .y(d => yScaleTemp(d.maxTemp));

  const lineMin = d3.line()
    .x(d => xScaleDay(d.day))
    .y(d => yScaleTemp(d.minTemp));

  // Adding Line paths for each cell
  cells.each(function(d) {
    const dailyTemps = d.dailyTemps;  // Using data from daily temperatures for each month, iterated

    const g = d3.select(this);

    g.append("path")
      .datum(dailyTemps)
      .attr("d", lineMax)
      .attr("fill", "none")
      .attr("stroke", "Green")
      .attr("stroke-width", 1.5);

    g.append("path")
      .datum(dailyTemps)
      .attr("d", lineMin)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5);
  });

  // Add axis labels
  svg.append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(xScale).tickFormat(d3.format("d")));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickFormat(m => d3.timeFormat("%B")(new Date(2000, m - 1))));
  
  // Appending Legend to d3 graph
  const legendGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom + 20})`); // Adjust the y value to position below the heatmap
  
  legendGroup.append(() => legend);

    // Tooltip for when hovering over a rectangle
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "4px")
  
  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["temperature_daily.csv", {url: new URL("./files/b14b4f364b839e451743331d515692dfc66046924d40e4bff6502f032bd591975811b46cb81d1e7e540231b79a2fa0f4299b0e339e0358f08bef900595e74b15.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("temperature_daily")).define("temperature_daily", ["__query","FileAttachment","invalidation"], _temperature_daily);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("Legend", child1);
  main.import("Swatches", child1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("processedData")).define("processedData", ["d3","data"], _processedData);
  main.variable(observer("viewof tempType")).define("viewof tempType", ["Inputs"], _tempType);
  main.variable(observer("tempType")).define("tempType", ["Generators", "viewof tempType"], (G, _) => G.input(_));
  main.variable(observer("heatmap")).define("heatmap", ["processedData","d3","Legend","tempType"], _heatmap);
  main.variable(observer("processedData2")).define("processedData2", ["processedData"], _processedData2);
  main.variable(observer("heatmap2")).define("heatmap2", ["processedData2","d3","Legend","tempType"], _heatmap2);
  return main;
}
