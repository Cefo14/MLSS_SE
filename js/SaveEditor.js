var OFFSETS = {
	"MONEY": "0x50", //int32
	
	"MARIO": {
		"CURRENT_HP" : "0x00", // int16
		"CURRENT_BP" : "0x02", // int16
		"CURRENT_XP" : "0x1C", // int32

		"CURRENT_BONUS_HP"     : "0x06", // int16
		"CURRENT_BONUS_BP"     : "0x0A", // int16
		"CURRENT_BONUS_POW"    : "0x0E", // int16
		"CURRENT_BONUS_DEF"    : "0x12", // int16
		"CURRENT_BONUS_SPEED"  : "0x16", // int16
		"CURRENT_BONUS_STACHE" : "0x1A", // int16
	},

	"LUIGI" : {
		"CURRENT_HP" : "0x28", // int16
		"CURRENT_BP" : "0x2A", // int16
		"CURRENT_XP" : "0x44", // int32

		"CURRENT_BONUS_HP"     : "0x2E", // int16
		"CURRENT_BONUS_BP"     : "0x32", // int16
		"CURRENT_BONUS_POW"    : "0x36", // int16
		"CURRENT_BONUS_DEF"    : "0x3A", // int16
		"CURRENT_BONUS_SPEED"  : "0x3E", // int16
		"CURRENT_BONUS_STACHE" : "0x42", // int16
	},

	"ITEMS" : {
		"START" : "0x54", // int8
		"END"   : "0x66", // int8
	},

	"COFFEE" : {
		"START" : "0x67", // int8
		"END"   : "0x6D", // int8
	},

	"JEANS" : {
		"START" : "0x74", // int8
		"END"   : "0xAA", // int8
	},

	"BADJES" : {
		"START" : "0xAC", // int8
		"END"   : "0xE7", // int8
	},

	"ACCESSORIES" : {
		"START" : "0xE8", // int8
		"END"   : "0xF5", // int8
	},

	/*"KEY_ITEMS" : 
	{
		"START" : "0xF8",  // int8 // mini-map
		"END"   : "0xFF",  // int8 ?? ++
	},*/

	"BEANS" : {
		"START" : "0x130",  // int8
		"END"   : "0x133",  // int8
	},
}