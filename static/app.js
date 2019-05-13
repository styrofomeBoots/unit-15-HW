function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(sample){
      // Use d3 to select the panel with id of `#sample-metadata`
      var metaD = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      metaD.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(sample).forEach(function([key,value]){
        metaD.append("p").text(`${key}:${value}`)
      })
    });

    // BONUS: Build the Gauge Chart
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${sample}`).then(function(data){
    var bubble = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: `markers`,
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    };

    var data = [bubble];
    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    d3.json(`/samples/${sample}`).then((data) => {
      var pie_chart = [{
        values: data.sample_values.slice(0,10),
        lables: data.otu_ids.slice(0,10),
        hovertext: data.otu_labels.slice(0,10),
        type: "pie"
      }];
      Plotly.newPlot('pie',pie_chart);
    });
  });
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();



