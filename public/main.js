// Focus div based on nav button click
const home = document.getElementById("homenav")
            home.addEventListener("click", displayInstructions)
            function displayInstructions() {
                // Reveal home instructions, hide all other attributes
                document.getElementById("home").setAttribute("class", "active");
                document.getElementById("single").setAttribute("class", "hidden");
                document.getElementById("multi").setAttribute("class", "hidden");
                document.getElementById("guess").setAttribute("class", "hidden");
            }

// Flip one coin and show coin image to match result when button clicked

function flipOneCoin() {
    document.getElementById("flipACoinRes").innerHTML = "Flipping..."
    document.getElementById("singleFlipRes").src="assets/img/coin.png";
    fetch("http://localhost:5000/app/flip/")
        .then(res => res.json())
        .then(data => {
            const result = data.flip.toString()
            setTimeout(function(){
                document.getElementById("singleFlipRes").src="assets/img/"+result+".png";
                document.getElementById("flipACoinRes").innerHTML = "Result: " + result + "!"
            }, 200);
        })
}
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Our flip many coins form
const coins = document.getElementById("coins")
// Add event listener for coins form
coins.addEventListener("submit", flipCoins)
// Create the submit handler
async function flipCoins(event) {
    event.preventDefault();
    
    const endpoint = "app/flip/coins/"
    const url = document.baseURI+endpoint

    const formEvent = event.currentTarget

    try {
        const formData = new FormData(formEvent);
        const flips = await sendFlips({ url, formData });

        console.log(flips);
        document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads;
        document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;
    } catch (error) {
        console.log(error);
    }
}
// Create a data sender
async function sendFlips({ url, formData }) {
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJson = JSON.stringify(plainFormData);
    console.log(formDataJson);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: formDataJson
    };

    const response = await fetch(url, options);
    return response.json()
}

// Guess a flip by clicking either heads or tails button
