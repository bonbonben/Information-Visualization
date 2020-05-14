// Load the datasets and call the functions to make the visualizations

//d3.csv("aiddata-countries-only-final.csv", d3.autoType)
//  .then(vis1);

Promise.all([
  d3.csv("aiddata-countries-only1.csv", d3.autoType),
  d3.csv("aiddata-countries-only2.csv", d3.autoType)
]).then(([data, data2]) => {
  vis1(data, d3.select('#vis1'));
  vis2(data2, d3.select('#vis1'));
});

function vis1(data, div)
{
  const final = data.map(d => ({country: d.country, year: d.year, donate: d.donate, receive: d.receive, difference: d.donate - d.receive}));
  
  const margin = {top: 20, right: 0, bottom: 40, left: 160};
  const height = 480;
  const width = 1120;
  const visWidth = width - margin.left - margin.right;
  const visHeight = height - margin.top - margin.bottom;
  
  const countries = ["United States of America", "Japan", "Germany", "United Kingdom", "France", 
  "Netherlands", "Sweden", "Norway", "Canada", "Switzerland", "Denmark", "Belgium", "Spain", 
  "Italy", "Finland", "Austria", "Monaco", "Liechtenstein", "Iceland", "Portugal", "Australia", 
  "New Zealand", "Slovenia", "United Arab Emirates", "Estonia", "Latvia", "Luxembourg", "Greece", 
  "Lithuania", "Qatar", "Ireland", "Slovakia", "Cyprus", "Czechia", "Hungary", "Saudi Arabia", 
  "Taiwan", "Romania", "Kuwait", "Chile", "South Africa", "South Korea", "Poland", "Colombia", 
  "Brazil", "Thailand", "India"];
  const years = ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", 
  "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", 
  "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", 
  "2007", "2008", "2009", "2010", "2011", "2012", "2013"];
  
  //const svg = d3.select(DOM.svg(visWidth + margin.left + margin.right,
  //                              visHeight + margin.top + margin.bottom));
								
  const svg = d3.select("#vis1")
	.append("svg")
		.attr("width", visWidth + margin.left + margin.right)
		.attr("height", visHeight + margin.top + margin.bottom);

  const g = svg.attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', 0)');
  
  // add title

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20x")
    .text("Annual Donate - Annual Receive");
	
  // add legend
  
  const color_scale = d3.scaleDiverging([-11399278504, 0, 11399278504], d3.interpolateRdBu);
	  
  const myLegend = d3.legendColor()
	.labelFormat(d3.format(".2s"))
    .shapeWidth(30)
    .cells(10)
    .orient("vertical")
    .scale(color_scale); 

  g.append("g")
	  .attr('transform', 'translate(-160, 0)')
      .call(myLegend);
  
  const x = d3.scaleBand()
      .domain(years)
      .range([0, visWidth])
      .padding(0.05);
  
  const y = d3.scaleBand()
      .domain(countries)
      .range([height, 0])
      .padding(0.05);
  
  g.append('g')
    .attr('transform', 'translate(0,' + height +')')
    .call(d3.axisBottom(x).ticks(10))
    .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
  
  g.append('g')
    .call(d3.axisLeft(y));
  
  svg.selectAll()
    .data(final)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.year) + margin.left)
    .attr('y', (d) => y(d.country))
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .attr('fill', (d) => color_scale(d.difference));

  //return svg.node();
}

function vis2(data2, div)
{
  const margin = {top: 20, right: 0, bottom: 40, left: 250};
  const height = 400;
  const width = 1000;
  const visWidth = width - margin.left - margin.right;
  const visHeight = height - margin.top - margin.bottom;
  
  const purposes = ["Rail transport", "Water supply and sanitation - large systems", 
  "Industrial development", "Power generation/non-renewable sources", "Social/ welfare services", 
  "Air transport", "Telecommunications", "Import support (capital goods)", 
  "Food security programmes/food aid", "Rescheduling and refinancing"];
  const years = ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", 
  "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", 
  "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", 
  "2007", "2008", "2009", "2010", "2011", "2012", "2013"];
  
  //const svg = d3.select(DOM.svg(visWidth + margin.left + margin.right,
  //                              visHeight + margin.top + margin.bottom));
								
  const svg = d3.select("#vis2")
	.append("svg")
		.attr("width", visWidth + margin.left + margin.right)
		.attr("height", visHeight + margin.top + margin.bottom);

  const g = svg.attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', 0)');
  
  // add title

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20x")
    .text("Annual donation amounts");
	
  // add legend
  
  const color_scale = d3.scaleLinear()
      .domain([0, 8344866729])
      .range(['#fef0d9', '#d7301f']);
	  
  const myLegend = d3.legendColor()
	.labelFormat(d3.format(".2s"))
    .shapeWidth(30)
    .cells(10)
    .orient("vertical")
    .scale(color_scale); 

  g.append("g")
	  .attr('transform', 'translate(-250, 0)')
      .call(myLegend);
  
  const x = d3.scaleBand()
      .domain(years)
      .range([0, visWidth])
      .padding(0.05);
  
  const y = d3.scaleBand()
      .domain(purposes)
      .range([height, 0])
      .padding(0.05);
  
  g.append('g')
    .attr('transform', 'translate(0,' + height +')')
    .call(d3.axisBottom(x).ticks(10))
    .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
  
  g.append('g')
    .call(d3.axisLeft(y));
  
  svg.selectAll()
    .data(data2)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.year) + margin.left)
    .attr('y', (d) => y(d.purpose))
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .attr('fill', function(d) {if(d.amount === 0){return '#f0f0f0'}
                               else {return color_scale(d.amount)}});

  //return svg.node();
}
