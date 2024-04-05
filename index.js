const mongoose = require("mongoose")
const jsonfile = require("jsonfile")
const dotenv = require('dotenv').config();


jsonfile.readFile("problems.json", async function(err, problems) {
    if(err) {
        console.error("Error reading file", err);
    }
    let fullProblems = []
    for(let i = 0; i < problems.length; i++){
        let problem = problems[i]
        console.log(problem?.loaded)
        if(problem?.loaded == undefined) {
            console.log(`Fetching ${problem.titleSlug}...`)
            let fullProblem;
            try{
                fullProblem = await (await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${problem.titleSlug}`)).json()
            }catch(err){
                console.log("Encountered error!", err);
                console.log("waiting one hour: ")
                await new Promise((resolve) => {
                    setTimeout(resolve, 3600000);
                  });
                  i--
                  continue
            }
            console.log(fullProblem)
            jsonfile.writeFileSync("fullProblems.json", fullProblem, {flag: "a"})
            problems[i].loaded = "true"
        }
    }

})


// mongoose.connect(process.env.mongoDBUrl)

// console.log("hello")
// mongoose.disconnect()