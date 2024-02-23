// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
const chooseChamp = () => {
	rng = Math.floor(Math.random() * champsList.length);
	const chosen = champsData[champsList[rng]];
	console.log(chosen);
  return chosen;
}
const prepareValues = (chosen) => {
	// Prepare the values i care about
	return {
	  name: chosen["name"],
	  title: chosen["title"],
	  tags: chosen["tags"],
	  info: chosen["info"],
	  blurb: chosen["blurb"]
	}
}
async function getSplash(chosen){
	// Get spash art from community dragon
	champKey = chosen["key"];
	const splashUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champKey}/${champKey}000.jpg`;
	const splash = await new Request(splashUrl).loadImage();
  return splash;
}

async function changeChamp(){
	// Chose a random champion
	chosen = chooseChamp();

	// Prepare info about champion
	info = prepareValues(chosen);
	splash = await getSplash(chosen);
	widget.backgroundImage = splash;
// 	console.log(info["name"]);
// 	for (const text in texts){
// 		texts[text].text = info[text];
// 	}

	Script.setWidget(widget);
	widget.setWidget()
}

// Request champion info
const req = new Request("https://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json")
data = await req.loadJSON()
const champsData = data["data"];

// Make a list of champions (names)
let champsList = []
for (const champ in champsData){
  champsList.push(`${champ}`);
}

// Prepare widget
widget = new ListWidget();
widget.refreshAfterDate = new Date(Date.now());
const stack = widget.addStack();
stack.size = new Size(720, 350);
stack.setPadding(20, 20, 20, 20)

// Gradient
const colors = [new Color("000000", 0), new Color("000000", 0.8)];
const locations = [0, 1];
let gradient = new LinearGradient();
gradient.colors = colors;
gradient.locations = locations;
gradient.startPoint = new Point(1, 1);
gradient.endPoint = new Point(0, 0);
stack.backgroundGradient = gradient;
const fontSizes = {
  name: 40,
  title: 25,
  tags: 20,
  info: 20,
  blurb: 15
}

// Chose a random champion
let chosen = chooseChamp();

// Prepare info about champion
let info = prepareValues(chosen);
let splash = await getSplash(chosen);
widget.backgroundImage = splash;

// Put values onto the widget
let texts = {};
let txt = '';
for (const prop in info){
  txt = '';
  if(prop != "info" && prop != "tags"){
    txt = info[prop];
  } else {
    for(attr in info[prop]){
      if(txt != ''){
        txt += ' / ';
      }
      txt += info[prop][attr];
    }
  }
  console.log(prop + ": " + txt);
  texts[prop] = stack.addText(txt);
  texts[prop].textColor = new Color("ffffff");
  texts[prop].font = new Font('Verdana', fontSizes[prop]);
}
stack.layoutVertically();
Script.setWidget(widget);

let timer = new Timer();
timer.timeInterval = 6000;
timer.repeats = true;
timer.schedule(() => {
	changeChamp();
})
