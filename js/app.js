(function(DOC, ZONE, SAVER)
{	
	var app = DOC.querySelector("#app")
	var btnSave = DOC.querySelector("#save")
	var uploadDropZone = DOC.querySelector("#uploadDropZone")
	
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

		dictDefaultMessage: '<p>Drop or click to load the file (ML4_001.sav)</p><span class="glyphicon glyphicon-upload"></span>'
	}

	btnSave.onclick = save

	function onChange(_file) 
	{
		file = new Files(_file)
		
		app.innerHTML = ""
		btnSave.classList.remove('hide')

		file.onLoadEnd(function()
		{
			component = makeBox("ITEMS & MONEY")
			app.appendChild(component)

			addMoney()
			addItems()
			addPjs()
		})
	}

	function save(event) 
	{
		if(typeof file == "object" && file.isReady())
		{
			component = app.getElementsByTagName('input')
			writeData(component)
			file.save(SAVER) 
		}

		else
			throw "App.js: file is not load"
			
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
		var div = DOC.createElement("div")
		div.className = "input-group"

		var span = DOC.createElement("span")
		span.className = "input-group-addon black-text border"
		span.appendChild(DOC.createTextNode(text))
		span.setAttribute("for", id)

		var input = DOC.createElement("input")
		input.className = "form-control black-text border"
		input.setAttribute("type", type || "number")
		input.setAttribute("id", id)
		input.value = value

		if(event)
		{
			input.addEventListener(event.type, event.action)
		}

		div.appendChild(span)
		div.appendChild(input)

		return div
	}

	function addMoney()
	{
		component = makeInput("money", file.readInt32(OFFSETS["MONEY"]), "MONEY")
		app.appendChild(component)
	}

	function addItems()
	{
		var MAX_ITEMS_EVENT = {
				type: "click",
				action: function()
				{
					var values = ["ITEMS", "COFFEE", "JEANS", "BADJES", "ACCESSORIES", "BEANS"]
					values.forEach(function(value)
					{
						for (var i = OFFSETS[value]["START"]; i <= OFFSETS[value]["END"]; i++)
							file.writeInt8(i, 99)
					})

					this.classList.remove("blue-bg")
					this.classList.add("green-bg")
					this.classList.add("black-text")
					this.value = "You have all the items :D"
				}
			}
		component = makeInput("max_items", "Click if you want the maximum number of items", "MAX_ITEMS", "button", MAX_ITEMS_EVENT)
		app.appendChild(component)
	}

	function addPjs()
	{
		var PJ = ["MARIO", "LUIGI"]
		PJ.forEach(function(offset)
		{
			component = makeBox(offset, [offset.toLowerCase()])
			app.appendChild(component)
			for (var stat in OFFSETS[offset])
			{
				var id = offset.toLowerCase() + '-' + stat.toLowerCase()
				var value
				if(stat == "CURRENT_XP")
					value = file.readInt32(OFFSETS[offset][stat])
				else
					value = file.readInt16(OFFSETS[offset][stat])
				
				component = makeInput(id, value, stat)
				app.appendChild(component)
			}
		})
	}

	function writeData(inputs)
	{
		for (var x in inputs)
		{
			if(typeof inputs[x] != "object") 
				break

			var input = inputs[x]
			var id = input.getAttribute("id").toUpperCase()
			var value = input.value

			if(id == "MAX_ITEMS") 
				continue

			if(id == "MONEY")
				file.writeInt32(OFFSETS[id], value)

			if(id.indexOf("-") > -1)
			{
				var [offset, stat] = id.split("-")
				if(stat == "CURRENT_XP")
					file.writeInt32(OFFSETS[offset][stat], value)
				else
					file.writeInt16(OFFSETS[offset][stat], value)
			}

			else
				file.writeInt16(OFFSETS[id], value)
		}
	}
})(document, Dropzone, saveAs)