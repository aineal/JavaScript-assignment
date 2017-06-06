	Manifest file 
{

  "manifest_version": 2,
  "name": "Beastify",
  "version": "1.0",

  "description": "Adds a browser action icon to the toolbar. Click the
button to choose a beast. The active tab's body content is then
replaced with a picture of the chosen beast.
  "icons": {
    "48": "icons/beasts-48.png"
  },

  "permissions": [
    "activeTab"
  ],

  "browser_action": {
    "default_icon": "icons/beasts-32.png",
    "default_title": "Beastify",
    "default_popup": "popup/choose_beast.html"
  },

  "web_accessible_resources": [
    "beasts/frog.jpg",
    "beasts/turtle.jpg",
    "beasts/snake.jpg"
  ]

}


	Icon
"icons": {
  "48": "icons/beasts-48.png",
  "96": "icons/beasts-96.png"
}

	HTML file
choose_beast.html

<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="choose_beast.css"/>
  </head>

  <body>
    <div class="button beast">Frog</div>
    <div class="button beast">Turtle</div>
    <div class="button beast">Snake</div>
    <div class="button clear">Reset</div>

    <script src="choose_beast.js"></script>
  </body>

</html>

	CSS
choose_beast.css
html, body {
  width: 100px;
}

.button {
  margin: 3% auto;
  padding: 4px;
  text-align: center;
  font-size: 1.5em;
  cursor: pointer;
}

.beast:hover {
  background-color: #CFF2F2;
}

.beast {
 background-color: #E5F2F2;
}

.clear {
 background-color: #FBFBC9;
}

.clear:hover {
 background-color: #EAEAC9;
}

	JAVACSRIPT
choose_beast.js
/* Given the name of a beast, get the URL to the corresponding image*/

function beastNameToURL(beastName) {
  switch (beastName) {
    case "Frog":
      return browser.extension.getURL("beasts/frog.jpg");
    case "Snake":
      return browser.extension.getURL("beasts/snake.jpg");
    case "Turtle":
      return browser.extension.getURL("beasts/turtle.jpg");
  }
}

/* Clicks in the popup */

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("beast")) {
    var chosenBeast = e.target.textContent;
    var chosenBeastURL = beastNameToURL(chosenBeast);

    browser.tabs.executeScript(null, {
      file: "/content_scripts/beastify.js"
    });

    var gettingActiveTab = browser.tabs.query({active: true,
currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {beastURL: chosenBeastURL});
    });
  }
  else if (e.target.classList.contains("clear")) {
    browser.tabs.reload();
    window.close();
  }
});


beastify.js
/* beastify()  removes every node in the document.body, then inserts the chosen beast then removes itself as a listener*/
function beastify(request, sender, sendResponse) {
  removeEverything();
  insertBeast(request.beastURL);
  browser.runtime.onMessage.removeListener(beastify);
}

/* Remove every node under document.body */
function removeEverything() {
  while (document.body.firstChild) {
    document.body.firstChild.remove();
  }
}

/* Given a URL to a beast image, create and style an IMG node pointing to that image, then insert the node into the document. */
function insertBeast(beastURL) {
  var beastImage = document.createElement("img");
  beastImage.setAttribute("src", beastURL);
  beastImage.setAttribute("style", "width: 100vw");
  beastImage.setAttribute("style", "height: 100vh");
  document.body.appendChild(beastImage);
}

/* Assign beastify() as a listener for messages from the extension. */

browser.runtime.onMessage.addListener(beastify);
