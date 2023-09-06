const url="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data){
    console.log(data)
});


function init() {
    // Reference to the dropdown select element
    let dropdownMenu = d3.select("#selDataset");
  
    // List of sample names to populate the select options
    d3.json(url).then((data) => {
      let sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        dropdownMenu
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // First sample from the list to build the initial plots
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });

  }
  
// Initialize the dashboard
init();

function buildCharts(sample) {
  d3.json(url).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(object => object.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    let idSlice = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    let barData = [
      {
        y: idSlice,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    
    ];

      let bubbleData=[
      {
        x:otu_ids,
        y:sample_values,
        mode: "markers" ,
        text: otu_labels,
        marker: {
            color:otu_ids,
            colorscale:"Jet",
            size:sample_values
          }
      }]

    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    let layout1 = {
      height:800,
      width:1000,
      xaxis:{
          title:{
            text:"OTU ID"
          }
        }
    };

    Plotly.newPlot("bar", barData, layout);
    Plotly.newPlot("bubble",bubbleData,layout1)
    
  });
}


function buildMetadata (sample){
  
  d3.json(url).then((data) => {
    let demographics=d3.select("#sample-metadata")
    let metadata=data.metadata;
    let results=metadata.filter(object=>object.id==sample);
    let result=results[0];

    demographics.html("");
    
    for(i in result){
      demographics.append("h6").text(
        `${i}`+`: ${result[i]}`)
    }

})
}
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}



  

