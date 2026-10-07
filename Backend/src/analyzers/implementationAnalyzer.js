const extractUrls = (readme) => {
  const markdownLinks = [];
  const rawUrls = [];

  // Find markdown links:
  // [Live Demo](https://example.com)
  const markdownRegex =
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

  let match;

  while ((match = markdownRegex.exec(readme)) !== null) {
    markdownLinks.push({
      label: match[1],
      url: match[2]
    });
  }

  // Find normal URLs:
  // https://example.com
  const urlRegex =
    /https?:\/\/[^\s<>)]+/g;

  const urls = readme.match(urlRegex) || [];

  urls.forEach((url) => {
    if (
      !markdownLinks.some((link) => link.url === url)
    ) {
      rawUrls.push({
        label: "",
        url
      });
    }
  });

  return [...markdownLinks, ...rawUrls];
};


const analyzeImplementation = (readme, files = []) => {

  const text = readme.toLowerCase();

  const links = extractUrls(readme);

  const result = {
    codeAvailable: files.some((file) =>
      /\.(js|jsx|ts|tsx|py|java|cpp|c|cs|go|rs|php|rb|swift|kt)$/i.test(file)
    ),

    demoAvailable: false,
    demoUrl: null,

    prototypeMentioned: false,
    prototypeUrl: null,

    deploymentMentioned: false,
    deploymentUrl: null,

    runInstructionsAvailable: false,

    evidence: []
  };


  // --------------------------------
  // DEMO
  // --------------------------------

  const demoKeywords = [
    "demo",
    "live demo",
    "try it",
    "try the app",
    "working demo"
  ];

  const demoLink = links.find((link) => {

    const label = link.label.toLowerCase();

    return demoKeywords.some(
      (keyword) => label.includes(keyword)
    );
  });

  if (demoLink) {

    result.demoAvailable = true;
    result.demoUrl = demoLink.url;

    result.evidence.push({
      type: "Demo",
      url: demoLink.url,
      description:
        `README contains a demo link: ${demoLink.label}`
    });

  } else if (
    demoKeywords.some(
      (keyword) => text.includes(keyword)
    )
  ) {

    result.evidence.push({
      type: "Demo Mention",
      description:
        "README mentions a demo, but no specific demo URL was found."
    });
  }


  // --------------------------------
  // PROTOTYPE
  // --------------------------------

  const prototypeKeywords = [
    "prototype",
    "working prototype",
    "proof of concept",
    "poc"
  ];

  if (
    prototypeKeywords.some(
      (keyword) => text.includes(keyword)
    )
  ) {

    result.prototypeMentioned = true;

    result.evidence.push({
      type: "Prototype",
      description:
        "README mentions a prototype or proof of concept."
    });
  }


  // --------------------------------
  // DEPLOYMENT
  // --------------------------------

  const deploymentKeywords = [
    "deployed",
    "deployment",
    "production",
    "live application",
    "live app"
  ];

  const deploymentLink = links.find((link) => {

    const label = link.label.toLowerCase();

    return deploymentKeywords.some(
      (keyword) => label.includes(keyword)
    );
  });

  if (deploymentLink) {

    result.deploymentMentioned = true;
    result.deploymentUrl = deploymentLink.url;

    result.evidence.push({
      type: "Deployment",
      url: deploymentLink.url,
      description:
        `README contains a deployment link: ${deploymentLink.label}`
    });

  } else if (
    deploymentKeywords.some(
      (keyword) => text.includes(keyword)
    )
  ) {

    result.deploymentMentioned = true;

    result.evidence.push({
      type: "Deployment Mention",
      description:
        "README mentions deployment, but no specific deployment URL was found."
    });
  }


  // --------------------------------
  // RUN INSTRUCTIONS
  // --------------------------------

  const runKeywords = [
    "npm install",
    "npm start",
    "npm run",
    "python ",
    "docker compose",
    "docker run",
    "installation",
    "setup",
    "getting started"
  ];

  if (
    runKeywords.some(
      (keyword) => text.includes(keyword)
    )
  ) {

    result.runInstructionsAvailable = true;

    result.evidence.push({
      type: "Run Instructions",
      description:
        "README contains instructions or commands for running the project."
    });
  }


  // --------------------------------
  // SOURCE CODE
  // --------------------------------

  if (result.codeAvailable) {

    result.evidence.push({
      type: "Source Code",
      description:
        "Repository contains source-code files."
    });
  }


  return result;
};


module.exports = {
  analyzeImplementation
};