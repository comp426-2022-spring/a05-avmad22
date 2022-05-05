// Focus div based on nav button click
// FLIP ONE COIN //
const coin = document.getElementById("coin")
// event listener to look for click
coin.addEventListener("click", flipCoin)
// function to wait for a response
async function flipCoin() {
    // endpoint, where are we going?
    const endpoint = "app/flip/"
    const url=document.baseURI+endpoint
    // waiting for response
    await fetch(url)
    // receiving response
                    .then(function(response) {
                        return response.json();
                    })
                    
                    .then(function(result) {
                        console.log(result);
                        document.getElementById("result").innerHTML = result.flip;
                        document.getElementById("quarter").setAttribute("src", "assets/img/"+result.flip+".png");
                      });
}



// FLIP MANY COINS
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series
const coins = document.getElementById("coins")
// listener for coins
coins.addEventListener("submit", flipCoins)
// run when submit button
async function flipCoins(event) {
    // endpoint, where are we going
    const endpoint = "app/flip/coins/"
	const url = document.baseURI+endpoint
// This extracts the data object from the form so we can run it through the FormData API
	const formEvent = event.currentTarget
// Give the data to FormData and wait for a response or log an error to console.
	try {
		const formData = new FormData(formEvent);
// Hand the form data off to the function that is actually going to interact with the API.
		const flips = await sendFlips({ url, formData });
// Process the response and manipulate some elements in div#multi.
		console.log(flips);
// Present the summary information.
		document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads;
		document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;
// This calls a function what will make a list of coin images based on the array of coin flip results.
// See below for coinList() function.
    document.getElementById("coinlist").innerHTML = coinList(flips.raw);
	} catch (error) {
		console.log(error);
	}
}

// GUESS COIN //
// Guess a flip by clicking either heads or tails button
const call = document.getElementById("call")
// listener gor coins in guess
call.addEventListener("submit", flipCall)

async function flipCall(event) {
    event.preventDefault();
    // url
    const endpoint = "app/flip/call/"
	const url = document.baseURI+endpoint
// Extract the data from the form.
	const formEvent = event.currentTarget
    try {
		const formData = new FormData(formEvent); 
// Hand the form data off to the function that is actually going to interact with the API.
		const results = await sendFlips({ url, formData });
// Process the results.
		console.log(results);
// Present the text results
		document.getElementById("choice").innerHTML = "Guess: "+results.call;
		document.getElementById("actual").innerHTML = "Actual: "+results.flip;
		document.getElementById("results").innerHTML = "Result: "+results.result;
// Assemble a list containing images corresponding to the game results
    document.getElementById("coingame").innerHTML = '<li><img src="assets/img/'+results.call+'.png" class="bigcoin" id="callcoin"></li><li><img src="assets/img/'+results.flip+'.png" class="bigcoin"></li><li><img src="assets/img/'+results.result+'.png" class="bigcoin"></li>';
	} catch (error) {
		console.log(error);
	}
}

// DATA SENDER //
async function sendFlips({ url, formData }) {
    // Extract the form data from the FormData object
        const plainFormData = Object.fromEntries(formData.entries());
    // to JSON
        const formDataJson = JSON.stringify(plainFormData);
    // what is going to be sent in the API message body
        console.log(formDataJson);
    // Set up the request
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: formDataJson
        };
    // send the request 
        const response = await fetch(url, options);
    // Pass response 
        return response.json()
}

// NAV BUTTONS //

// nav for home
function homeNav() {
    // home is active
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "active";
    // everything else inactive
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  // nav for single coin
  function singleNav() {
      // home inactive
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    // single is active
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "active";
    // everything else inactive
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  // nav for many coin
  function multiNav() {
      // everything not multi is inactive
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    // multi active
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "active";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  // nav for guess
  function guessNav() {
      // everything else inactive
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    // guess acgive
    document.getElementById("guessnav").className = "active";
    document.getElementById("guesscoin").className = "active";
  } 

  // get results for coinflippys
  function coinList(array) {
    let text = "";
    let arrayLength = array.length
    for (let i = 0; i < arrayLength; i++) {
      text += '<li><img src="assets/img/'+array[i]+'.png" class="bigcoin"></li>';
    }
    return text
  }