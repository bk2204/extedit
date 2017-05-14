/*
 * customPrefs wrapper sourced from:
 *   http://qiita.com/sayamada/items/d6d26a3c2e9613854019
 * Thanks sayamada!
 */
var customPrefs = {

	orgPrefs: Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService)
		.getBranch(""),

	copyUnicharPref: function(key, defaultVal) {
		if (defaultVal === undefined) {
			defaultVal = "";
		}
		var val = undefined;
		try {
			val = this.orgPrefs.getComplexValue(key, Components.interfaces.nsISupportsString).data;
		} catch (e) {
			console.log(e);
		}
		if (val !== undefined && val !== "") {
			return val;
		} else {
			return defaultVal;
		}
	},
	setUnicharPref: function(key, val) {
		var str = Components.classes["@mozilla.org/supports-string;1"]
			.createInstance(Components.interfaces.nsISupportsString);
		str.data = val;
		this.orgPrefs.setComplexValue(key, Components.interfaces.nsISupportsString, str);
	},
	getBoolPref: function(key, defaultVal) {
		try {
			var tmpVal = this.orgPrefs.getBoolPref(key);
			if (tmpVal || tmpVal === "true") {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return defaultVal;
		}
	},
	setBoolPref: function(key, val) {
		if (val || val === "true") {
			this.orgPrefs.setBoolPref(key, true);
		} else {
			this.orgPrefs.setBoolPref(key, false);
		}
	},
	getIntPref: function(key, defaultVal) {
		try {
			return this.orgPrefs.getIntPref(key);
		} catch (e) {
			return defaultVal;
		}
	},
	setIntPref: function(key, val) {
		this.orgPrefs.setIntPref(key, val);
	},
};

//-----------------------------------------------------------------------------
var strbundle;
function getLocaleString(aName)
{
	try
	{
		if (!strbundle) {
			var strBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			strbundle = strBundleService.createBundle("chrome://exteditor/locale/exteditor.properties");
		}

		if (strbundle)
			return strbundle.GetStringFromName(aName);
	}
	catch (e) {
		alert("Cannot get the localized string bundle: " + e);
	}

	return null;
}

//-----------------------------------------------------------------------------
function AFgetPrefString(objId) {
	var obj = document.getElementById(objId);
	return obj.getAttribute("prefstring");
}

//-----------------------------------------------------------------------------
function AFreadPref(prefStr, defValue) {
	var typ = customPrefs.mPrefService.getPrefType(prefStr);
	if (typ & 128) {
		return customPrefs.getBoolPref(prefStr, defValue);
	} else if (typ & 64) {
		return customPrefs.getIntPref(prefStr, defValue);
	} else if (typ & 32) {
		return customPrefs.copyUnicharPref(prefStr, defValue);
	} else {
		alert(prefStr + ": " + getLocaleString("PrefTypeNotSupported") + ": " + typ);
	}
}

//-----------------------------------------------------------------------------
function AFreadObjPref(objId, defValue) {
	var obj = document.getElementById(objId);
	var atr = obj.getAttribute("prefattribute");

	if (atr=="") return;

	var val = AFgetObjPref(objId, defValue);
	eval("obj."+atr+"=val");
}

//-----------------------------------------------------------------------------
function AFgetObjPref(objId, defValue) {
	var obj = document.getElementById(objId);
	var typ = obj.getAttribute("preftype");
	var atr = obj.getAttribute("prefattribute");
	var str = obj.getAttribute("prefstring");

	if ((typ=="")||(atr=="")||(str=="")) return;

	var val;
	if (typ=="bool") {
		val=customPrefs.getBoolPref(str, defValue);
	} else if (typ=="int") {
		val=customPrefs.getIntPref(str, defValue);
	} else if (typ=="string") {
		val=customPrefs.copyUnicharPref(str, defValue);
	} else {
		alert(objId + ": " + getLocaleString("PrefTypeNotSupported") + ": " + typ);
		return;
	}
	return val;
}

//-----------------------------------------------------------------------------
function AFwriteObjPref(objId) {
	var obj = document.getElementById(objId);
	var typ = obj.getAttribute("preftype");
	var atr = obj.getAttribute("prefattribute");
	var str = obj.getAttribute("prefstring");

	if ((typ=="")||(atr=="")||(str=="")) return;

	var val;
	eval("val=obj."+atr);

	if (typ=="bool") {
		customPrefs.setBoolPref(str, val);
	} else if (typ=="int") {
		customPrefs.setIntPref(str, val);
	} else if (typ=="string") {
		customPrefs.setUnicharPref(str, val);
	} else {
		alert(objId + ": " + getLocaleString("PrefTypeNotSupported") + ": " + typ);
		return;
	}
}
