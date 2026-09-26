require("dotenv").config();

const {
  analyzeReadme
} = require("./analyzers/readmeAnalyzer");


const test = async () => {

  const sampleReadme = `
# Smart Street Light Monitoring

This project uses IoT sensors to monitor
street lights and detect failures.

When a street light stops working,
the system sends an alert to the maintenance team.

Technologies used:
- Arduino
- IoT sensors
- Python
`;


  const result =
    await analyzeReadme(sampleReadme);


  console.log("\nFinal result:");
  console.log(result);
};


test();