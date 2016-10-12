jQuery.sap.declare("com.springer.workshopapp.util.Formatter");
jQuery.sap.require("com.springer.workshopapp.util.DateHandler");

com.springer.workshopapp.util.Formatter = {
	/**
	 * Upper the first character of giving string
	 * param{String} sStr input string
	 * @returns {String}} the input string with the first uppercase character
	 */
	uppercaseFirstChar: function(sStr) {
		return sStr.charAt(0).toUpperCase() + sStr.slice(1);
	},

	timestampToDate: function(value) {
		var date = new Date(parseInt(value.substr(6))).format('dd.mm.yyyy HH:MM');
		return date;
	},
	overlayTenZero: function(value) {
		value = value + "";
		while (value.length < 10) {
			value = "0" + value;
		}
		return value;
	},
	overlayFourZero: function(value) {
		value = value + "";
		while (value.length < 4) {
			value = "0" + value;
		}
		return value;
	},
	dateSimple: function(value) {
		if (!value || typeof value === "undefined") {
			return value;
		}
		if (!(value instanceof Date) && value.indexOf("Date")) {
			var date = new Date(parseInt(value.substr(6))).format('dd.mm.yyyy');
		} else {
			var date = new Date(value).format('dd.mm.yyyy');
		}
		return date;
	},
	dateTimeSimple: function(value) {
		if (!value || typeof value === "undefined") {
			return value;
		}
		if (!(value instanceof Date) && value.indexOf("Date")) {
			var date = new Date(parseInt(value.substr(6))).format('dd.mm.yyyy HH:MM');
		} else {
			var date = new Date(value).format('dd.mm.yyyy HH:MM');
		}
		return date;
	},
	sapBoolToTrueFalse: function(value) {
		if (!value || typeof value === "undefined") {
			return "false";
		}
		if (value === "X" || value === "x") {
			return "true";
		} else {
			return "false";
		}
	}
	
	/*
	discontinuedStatusState : function(sDate) {
		return sDate ? "Error" : "None";
	},

	discontinuedStatusValue : function(sDate) {
		return sDate ? "Discontinued" : "";
	},

	currencyValue : function (value) {
		return parseFloat(value).toFixed(2);
	}
	*/
};