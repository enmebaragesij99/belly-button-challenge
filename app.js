const url="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Fetch JSON data and console it
d3.json(url).then(function(data){
    console.log(data)
});


function init() {
    // Reference to the dropdown select element
    let dropdownMenu = d3.select("#selDataset");
  
    // List of sample names to populate the select options
    d3.json(url).then((data) => {
      let sampleNames = data.names;

      //For loop to loop through each sample name
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

//List of sample data
function buildCharts(sample) {
  d3.json(url).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(object => object.id == sample);
    let result = resultArray[0];

    //Creating variables for each key in sample data
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    let idSlice = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    //Creating bar chart
    let barData = [
      {
        y: idSlice,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    
    ];

    //Creating bubble chart
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

    //Layout for bar chart
    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };


    //Layout for bubble chart
    let layout1 = {
      height:800,
      width:1000,
      xaxis:{
          title:{
            text:"OTU ID"
          }
        }
    };

    //Render plots
    Plotly.newPlot("bar", barData, layout);
    Plotly.newPlot("bubble",bubbleData,layout1)
    
  });
}


function buildMetadata (sample){
  
  //List of sample metadata data
  d3.json(url).then((data) => {

    //Reference to demographics element
    let demographics=d3.select("#sample-metadata")
    let metadata=data.metadata;
    let results=metadata.filter(object=>object.id==sample);
    let result=results[0];

    //Clear html
    demographics.html("");
    
    //for loop to loop through and print all keys and values of metadata data
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



  

