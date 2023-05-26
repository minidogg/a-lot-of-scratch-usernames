// This is the current link being used.
var fileLink = "https://raw.githubusercontent.com/dwyl/english-words/master/words.txt"

//code
const https = require('https');
const fs = require('fs')

function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds))
  }

https.get(fileLink, (res) => {
  // console.log('statusCode:', res.statusCode);
  // console.log('headers:', res.headers);

  res.on('data', async (d) => {
    var words = d.toString().split("\n")
    var validUser = []

    for (let i = 0; i < words.length; i++) {
        https.get(encodeURI("https://api.scratch.mit.edu/accounts/checkusername/"+words[i]), (res) => {
            // console.log('statusCode:', res.statusCode);
            // console.log('headers:', res.headers);
        
            res.on('data', async (d) => {
                var jsonData = JSON.parse(d)
                if(jsonData.msg == "valid username"){
                    console.log(words[i])
                    validUser.push(words[i]+" \n")
                }
                if(jsonData.msg == "Too many requests"){
                    console.warn("Too many requests! Waiting 2 seconds...")
                    wait(2000)
                    console.log("Resuming")
                }
            });
          }).on('error', (e) => {
            console.error(e);
          });
          await wait(500)
    }
  });

}).on('error', (e) => {
  console.error(e);
}); 
