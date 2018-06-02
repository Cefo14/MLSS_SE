function Files(file) 
{
	if (typeof window.FileReader != "function") 
		throw "Files.js: Browser doesn't support FileReader"

	if (typeof file == "object" && file.name && file.size) 
	{
		this._file = file
		this._fileName = file.name
		this._fileType = file.type
		this._littleEndian = true
		this._fileReader = new FileReader()
	}

	else
		throw "Files.js: Invalid File"
}

Files.prototype.onLoadEnd = function(callBack) 
{
	this._fileReader.addEventListener("loadend", function()
	{
		this.dataView = new DataView(this.result)
		delete this._file
		callBack()
	})

	this._fileReader.readAsArrayBuffer(this._file) 
}

Files.prototype.isReady = function() 
{
	return this._fileReader.readyState == 2
}

Files.prototype.save = function(saveAs) 
{
	var data;
	data = new Blob([this._fileReader.dataView], { type: this._fileType });
	saveAs(data, this._fileName)
}


Files.prototype.readInt8 = function(offset)
{
	return this._fileReader.dataView.getUint8(offset, this._littleEndian)
}

Files.prototype.readInt16 = function(offset)
{
	return this._fileReader.dataView.getUint16(offset, this._littleEndian)
}

Files.prototype.readInt32 = function(offset)
{
	return this._fileReader.dataView.getUint32(offset, this._littleEndian)
}

Files.prototype.writeInt8 = function(offset, value)
{
	return this._fileReader.dataView.setUint8(offset, value, this._littleEndian)
}

Files.prototype.writeInt16 = function(offset, value)
{
	this._fileReader.dataView.setUint16(offset, value, this._littleEndian)
}

Files.prototype.writeInt32 = function(offset, value)
{
	this._fileReader.dataView.setUint32(offset, value, this._littleEndian)
}

