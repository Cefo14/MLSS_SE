(function(DOC, ZONE, SAVER, OFST, LVLS, ITEMLIST)
{	
	var app = DOC.querySelector("#app")
	var btnSave = DOC.querySelector("#save")
	var uploadDropZone = DOC.querySelector("#uploadDropZone")
	var btnOptions = DOC.querySelector('#options')
	var tglBug = DOC.querySelector('.bugToggle')
	var tglLvl = DOC.querySelector('.lvlToggle')
	var settings = {
		"bug": false,
		"lvl": true,
	}

	var file
	var component
	
	ZONE.options.uploadDropZone = {
		init: function() 
		{
			this.on("addedfile", function(file) 
			{ 
				onChange(file)
				this.removeFile(file)
				uploadDropZone.classList.add("green-bg")
			})
		},

		dictDefaultMessage: '<p>Drop or click to load the file (ML1_001.sav)</p><span class="glyphicon glyphicon-upload"></span>'
	}

	btnSave.onclick = save
	btnOptions.onclick = tglMenu
	tglBug.onclick = toggleBug
	tglLvl.onclick = toggleLevel

	function onChange(_file) 
	{
		file = new Files(_file)
		
		app.innerHTML = ""
		btnSave.classList.remove('hide')

		file.onLoadEnd(function()
		{
			addBros()
			
			component = makeBox("ITEMS & MONEY")
			app.appendChild(component)
			
			addMoney()
			addItems()
		})
	}

	function save(event) 
	{
		if(typeof file == "object" && file.isReady()) {
			component = app.getElementsByTagName('input')
			writeData(component)
			file.save(SAVER) 
		}
		else {
			throw "App.js: file is not load"
		}
	}

	function redraw() {
		app.innerHTML = ""

		addBros()
			
		component = makeBox("ITEMS & MONEY")
		app.appendChild(component)
		
		addMoney()
		addItems()
	}

	function redrawMenu() {
		var bugCheck = DOC.querySelector('.bugCheck')
		var lvlCheck = DOC.querySelector('.lvlCheck')
		
		if (settings.bug) {
			bugCheck.classList.remove('glyphicon-remove')
			bugCheck.classList.add('glyphicon-ok')
		}
		else {
			bugCheck.classList.remove('glyphicon-ok')
			bugCheck.classList.add('glyphicon-remove')
		}

		if (settings.lvl) {
			lvlCheck.classList.remove('glyphicon-remove')
			lvlCheck.classList.add('glyphicon-ok')
		}
		else {
			lvlCheck.classList.remove('glyphicon-ok')
			lvlCheck.classList.add('glyphicon-remove')
		}
	}

	function tglMenu(event) {
		btnOptions.classList.toggle('open')
		DOC.querySelector('.optionsMenu').classList.toggle('open')
		DOC.querySelector('.mainWrapper').classList.toggle('open')
	}

	function toggleBug() {
		settings.bug = !settings.bug
		redrawMenu()
		if (file) {
			redraw()
		}
	}

	function toggleLevel() {
		settings.lvl = !settings.lvl
		redrawMenu()
		if (file) {
			redraw()
		}
	}

	function makeBox(title, classes)
	{
		var div = DOC.createElement('div')
		div.className = 'box black-text '  + (classes ? classes.join(' ') : '')
		var h2 = DOC.createElement('h2')
		h2.innerHTML = title
		div.appendChild(h2)
		return div
	}

	function makeInput(id, value, text, type, event)
	{
		var lvl = false;
		var bro = id.split('-')[0];
		
		if(id.split('-')[1] == "current_xp" && settings.lvl == true) {
			lvl = true;
		}
		
		var div = DOC.createElement("div")
		div.className = "input-group"

		var span = DOC.createElement("span")
		span.className = "input-group-addon black-text border"
		span.appendChild(DOC.createTextNode(text.replace(/\_/g, ' ')))
		span.setAttribute("for", id)

		var input = DOC.createElement("input")
		input.className = "form-control black-text border"
		input.setAttribute("type", type || "number")
		input.setAttribute("id", id)
		input.value = value

		if(lvl) {
			var lvlSpan1 = DOC.createElement("span")
			lvlSpan1.className = "input-group-addon black-text border border-middle"
			lvlSpan1.appendChild(DOC.createTextNode('APPROXIMATE LVL'))

			var lvlSpan2 = DOC.createElement("span")
			lvlSpan2.className = "form-control black-text border"
			lvlSpan2.appendChild(DOC.createTextNode(calcBroLvl(bro, value)))
			lvlSpan2.id = bro + "-approximate_lvl";

			var CURRENT_XP_EVENT = {
				type: "input",
				action: function(e) {
					DOC.querySelector('#' + lvlSpan2.id).textContent = calcBroLvl(bro, e.target.value);
				},
			};

			input.addEventListener(CURRENT_XP_EVENT.type, CURRENT_XP_EVENT.action);
		}

		if(event) {
			input.addEventListener(event.type, event.action)
		}

		div.appendChild(span)
		div.appendChild(input)
		if(lvl) {
			div.appendChild(lvlSpan1)
			div.appendChild(lvlSpan2)
		}

		return div
	}

	function addMoney()
	{
		component = makeInput("money", file.readInt32(OFST["MONEY"]), "MONEY")
		app.appendChild(component)
	}

	function addItems()
	{
		var MAX_ITEMS_EVENT = {
			type: "click",
			action: function()
			{
				var values = ["ITEMS", "COFFEE", "JEANS", "BADGES", "ACCESSORIES", "BEANS"]
				values.forEach(function(value) {
					for (var i = OFST[value]["START"]; i <= OFST[value]["END"]; i++)
						if (settings.bug == false) {
							if (!["170", "231"].includes(itemID)) {
								file.writeInt8(i, 99)
							}
							else {
								file.writeInt8(i, 0)
							}
						}
						else {
							file.writeInt8(i, 99)
						}
				})

				this.classList.remove("blue-bg")
				this.classList.add("green-bg")
				this.classList.add("black-text")
				this.value = "You have all the items :D"
			}
		}
		component = makeInput("max_items", "Click if you want the maximum number of items", "MAX ITEMS", "button", MAX_ITEMS_EVENT)
		app.appendChild(component)

		var items = {};
		var values = ["CONSUMABLES", "COFFEE", "BEANS", "JEANS", "BADGES", "ACCESSORIES", ];
		values.forEach((value) => {
			items[value] = {};
			for (var i = OFST[value]["START"]; i <= OFST[value]["END"]; i++) {
				items[value][i.toString()] = {
					"name": ITEMLIST[i],
					"amount": file.readInt8(i),
				}
			}
		});

		app.appendChild(makeBox('Specific Item Amount'))
		var itemsHolder = DOC.createElement('div')
		itemsHolder.id = 'ITEMS-HOLDER'
		itemsHolder.appendChild(makeBox('Items'))
		var gearHolder = DOC.createElement('div')
		gearHolder.id = 'GEAR-HOLDER'
		gearHolder.appendChild(makeBox('Gear'))
		var itemsClear = DOC.createElement('div')
		itemsClear.className = "clear"

		for (var category in items) {
			var catHolder = DOC.createElement('div');
			catHolder.className = category.toLowerCase() + '-holder';
			catHolder.appendChild(makeBox(category));
			for (var itemID in items[category]) {
				if (!["170", "231"].includes(itemID) || settings.bug) {
					var input = makeInput('ITEMS-' + itemID, items[category][itemID].amount, items[category][itemID].name, 'number');
					catHolder.appendChild(input);
				}
			}
			if (['CONSUMABLES', 'COFFEE', 'BEANS'].includes(category)) {
				itemsHolder.appendChild(catHolder)
			}
			else if (category == 'ACCESSORIES') {
				gearHolder.appendChild(itemsClear.cloneNode())
				gearHolder.appendChild(catHolder)
			}
			else {
				gearHolder.appendChild(catHolder)
			}
		}

		app.appendChild(itemsHolder)
		app.appendChild(itemsClear)
		app.appendChild(gearHolder)

		DOC.querySelector('#ITEMS-HOLDER').querySelectorAll('[class$=-holder]').forEach((category) => {
			category.insertBefore(category.lastChild, category.firstChild.nextElementSibling)
		});
		DOC.querySelector('#GEAR-HOLDER').querySelectorAll('[class$=-holder]').forEach((category) => {
			category.insertBefore(category.lastChild, category.firstChild.nextElementSibling)
		});
	}

	function addBros()
	{
		var Bro = ["MARIO", "LUIGI"]
		Bro.forEach(function(offset)
		{
			var broHolder = DOC.createElement('div')
			broHolder.className = offset.toLowerCase() + '-holder'
			component = makeBox(offset, [offset.toLowerCase()])
			broHolder.appendChild(component)
			for (var stat in OFST[offset])
			{
				var id = offset.toLowerCase() + '-' + stat.toLowerCase()
				var value
				
				if(stat == "CURRENT_XP") {
					value = file.readInt32(OFST[offset][stat]);
				}
				else {
					value = file.readInt16(OFST[offset][stat]);
				}

				component = makeInput(id, value, stat);
				broHolder.appendChild(component)
			}
			app.appendChild(broHolder)
		})
		var clear = DOC.createElement('div')
		clear.setAttribute('style', 'clear: both;')
		app.appendChild(clear);
	}

	function calcBroLvl(bro, xp) {
		var currLvl = 0;
		for(var lvl = 99; lvl > 0; lvl--) {
			xp = parseInt(xp);
			
			if (xp < LVLS[bro][lvl].exp && xp >= LVLS[bro][lvl - 1].exp) {
				currLvl = lvl - 1;
				break;
			}
			else if (xp > LVLS[bro][lvl].exp) {
				currLvl = lvl;
				break;
			}
		}
		return currLvl;
	}

	function writeData(inputs)
	{
		for (var x in inputs)
		{
			if(typeof inputs[x] != "object") {
				break
			}

			var input = inputs[x]
			var id = input.getAttribute("id").toUpperCase()
			var value = input.value

			if(id == "MAX_ITEMS") {
				continue
			}

			if(id == "MONEY") {
				file.writeInt32(OFST[id], value)
			}

			if(id.indexOf("-") > -1) {
				if(id.split('-')[0] == 'ITEMS') {
					file.writeInt8(id.split('-')[1], value)
				}
				else {
					var [offset, stat] = id.split("-")
					if(stat == "CURRENT_XP") {
						file.writeInt32(OFST[offset][stat], value)
					}
					else {
						file.writeInt16(OFST[offset][stat], value)
					}
				}
			}
			else {
				file.writeInt16(OFST[id], value)
			}
		}
	}
})(document, Dropzone, saveAs, OFFSETS, LEVELS, ITEMLIST)