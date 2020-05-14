// Load the datasets and call the functions to make the visualizations

//d3.csv("aiddata-countries-only-final.csv", d3.autoType)
//  .then(vis1);

Promise.all([
  d3.csv("aiddata-countries-only-final.csv", d3.autoType),
  d3.json("countries.json"),
]).then(([data, geoJSON]) => {
  vis1(data, d3.select('#vis1'));
  vis2(data, geoJSON, d3.select('#vis2'));
});
  
function vis1(data, div)
{
  const final = data.map(d => ({country: d.country, donate: d.donate, receive: d.receive, difference: d.donate - d.receive})).sort((a, b) => d3.descending(a.difference, b.difference))
  
  const margin = {top: 20, right: 40, bottom: 10, left: 40};
  const barHeight = 20;
  
  const visWidth = 1100 - margin.left - margin.right;
  const visHeight = 500 - margin.top - margin.bottom;
  //const visWidth = 1000 - margin.left - margin.right;
  //const visHeight = Math.ceil((final.length + 0.1) * barHeight) + margin.top + margin.bottom;
  
  //const svg = d3.select(DOM.svg(visWidth + margin.left + margin.right,
  //                              visHeight + margin.top + margin.bottom));
								
  const svg = d3.select("#vis1")
	.append("svg")
		.attr("width", visWidth + margin.left + margin.right)
		.attr("height", visHeight + margin.top + margin.bottom)

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .text("Donate - Receive");
  
  const x = d3.scaleLinear()
      .domain(d3.extent(final, d => d.difference))
      .rangeRound([margin.left, visWidth - margin.right]);
  
  const xAxis = g => g
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(visWidth / 80).tickFormat(d3.format(".2s")))
      .call(g => g.select(".domain").remove());
  
  const y = d3.scaleBand()
      .domain(d3.range(final.length))
      .rangeRound([margin.top, visHeight - margin.bottom])
      .padding(0.2);
  
  const yAxis = g => g
      .attr("transform", `translate(${x(0)},0)`)
      .call(d3.axisLeft(y).tickFormat(i => final[i].country).tickSize(0).tickPadding(6))
      .call(g => g.selectAll(".tick text").filter(i => final[i].difference < 0)
          .attr("text-anchor", "start")
          .attr("x", 6));
  
  g.append("g")
    .selectAll("rect")
    .data(final)
    .join("rect")
      .attr("fill", d => d3.schemeSet1[d.difference > 0 ? 1 : 0])
      .attr("x", d => x(Math.min(d.difference, 0)))
      .attr("y", (d, i) => y(i))
      .attr("width", d => Math.abs(x(d.difference) - x(0)))
      .attr("height", y.bandwidth());

  g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("text")
    .data(final)
    .join("text")
      .attr("text-anchor", d => d.difference < 0 ? "end" : "start")
      .attr("x", d => x(d.difference) + Math.sign(d.difference - 0) * 4)
      .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d.difference);

  g.append("g")
      .call(xAxis);

  g.append("g")
      .call(yAxis);

  //return svg.node();
}

function vis2(data, geoJSON, div)
{
  const countries = ["United States of America", "United Kingdom", "United Arab Emirates", "Thailand", "Taiwan",
"Switzerland", "Sweden", "Spain", "South Africa", "Slovenia", "Slovakia", "Saudi Arabia", "Romania", "Qatar", "Portugal", 
"Poland", "Norway", "New Zealand", "Netherlands", "Monaco", "Luxembourg", "Lithuania", "Liechtenstein", "Latvia", "Kuwait", "South Korea", "Japan", "Italy", "Ireland", "India", "Iceland", "Hungary", "Greece", "Germany", "France",
"Finland", "Estonia", "Denmark", "Czechia", "Cyprus", "Colombia", "Chile", "Canada", "Brazil", "Belgium", "Austria", "Australia"]
	
  const final2 = Object.fromEntries((data.map(d => ({country: d.country, donate: d.donate, receive: d.receive, difference: d.donate - d.receive})).sort((a, b) => d3.descending(a.difference, b.difference))).map(d => [d.country, {difference: d.difference}]));
 
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const visWidth = 1200 - margin.left - margin.right;
  const visHeight = 500 - margin.top - margin.bottom;

  //const svg = d3.select(DOM.svg(visWidth + margin.left + margin.right,
  //                              visHeight + margin.top + margin.bottom));
  
  const svg = d3.select("#vis2")
	.append("svg")
		.attr("width", visWidth + margin.left + margin.right)
		.attr("height", visHeight + margin.top + margin.bottom)         

  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
	  
  // add title

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", visHeight + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20x")
    .text("Donate - Receive");
  
  // add legend
  
  const myColor = d3.scaleDiverging([-140000000000, 0, 140000000000], d3.interpolateRdYlBu);

  const myLegend = d3.legendColor()
	.labelFormat(d3.format(".2s"))
    .shapeWidth(30)
    .cells(10)
    .orient("vertical")
    .scale(myColor); 

  g.append("g")
      .call(myLegend);
  
  // draw map
  
  const projection =  d3.geoEqualEarth()
      .fitSize([visWidth, visHeight], geoJSON);

  const path = d3.geoPath().projection(projection);

  g.selectAll('.border')
    .data(geoJSON.features)
    .join('path')
      .attr('class', 'border')
      .attr('d', path)
      .attr('fill', function(d) { if(countries.indexOf(d.properties.NAME) === -1){return '#dcdcdc'}
                                  else{return myColor(final2[d.properties.NAME].difference)} })
      .attr('stroke', 'white');
  
  const mapOutline = d3.geoGraticule().outline();
  
  g.append('path')
    .datum(mapOutline)
    .attr('d', path)
    .attr('stroke', '#dcdcdc')
    .attr('fill', 'none');

  //return svg.node();
}