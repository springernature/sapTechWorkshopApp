jQuery.sap.require("com.springer.workshopapp.util.Formatter");
jQuery.sap.require("com.springer.workshopapp.util.Controller");

com.springer.workshopapp.util.Controller.extend("com.springer.workshopapp.controller.appController.otherApp", {

	vDevice: "unset",
	bReplace: false,
	jsonAppModel: {},
	i18model: {},

	onInit: function() {
		// event after screen objects loaded
		this.getView().addEventDelegate({
			onAfterShow: jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});
		
		// router
		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched: function(evt) {
		// check that the called view name is like expected
		if (evt.getParameter("name") !== "_otherApp") {
			return;
		}
		this.i18model = this.getView().getModel("i18n").getResourceBundle();
	},

	onAfterShow: function() {
		// prüfen ob JSON model geladen ist mit globalen infos
		if(typeof this.jsonAppModel === "undefined") {
			this.jsonAppModel = sap.ui.getCore().getModel("jsonAppModel");
		}
		
		this.jsonAppModel.currentScreen = "otherApp";
		sap.ui.getCore().setModel(this.jsonAppModel, "jsonAppModel");
		
		this.getView().setBusy(false);
	},
	
	onPress: function() {
		sap.m.MessageToast.show("Button Press");
	},
	
	onNavBack: function() {
		this.getRouter().navTo("_welcomeScreen", {
			currentView: this.getView()
		}, this.bReplace);
	}
	
});