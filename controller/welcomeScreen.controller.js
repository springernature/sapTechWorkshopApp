jQuery.sap.require("com.springer.workshopapp.util.Formatter");
jQuery.sap.require("com.springer.workshopapp.util.Controller");

com.springer.workshopapp.util.Controller.extend("com.springer.workshopapp.controller.welcomeScreen", {

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
		
		// get the App JSON model to transfer data to all screens
		this.jsonAppModel = sap.ui.getCore().getModel("jsonAppModel");
		// when model not initialized redirect to initial screen
		if(typeof this.jsonAppModel === "undefined") {
			this.jsonAppModel = new sap.ui.model.json.JSONModel();
		}
		var vDevice;
		switch (true) {
			case sap.ui.Device.system.desktop:
				vDevice = "Desktop";
				break;
			case sap.ui.Device.system.tablet && sap.ui.Device.os.android:
				vDevice = "Android Tablet";
				break;
			case sap.ui.Device.os.android:
				vDevice = "Android";
				break;
			case sap.ui.Device.os.ios && sap.ui.Device.system.tablet:
				vDevice = "iPhone Tablet";
				break;
			case sap.ui.Device.os.ios:
				vDevice = "iPhone";
				break;
			case sap.ui.Device.system.phone:
				vDevice = "Phone";
				break;
			default:
				vDevice = "undefined";
		}
		this.jsonAppModel.device = vDevice;
		sap.ui.getCore().setModel(this.jsonAppModel, "jsonAppModel");
	},

	onRouteMatched: function(evt) {
		// check that the called view name is like expected
		if (evt.getParameter("name") !== "_welcomeScreen") {
			return;
		}
		this.i18model = this.getView().getModel("i18n").getResourceBundle();
	},

	onAfterShow: function() {
		// prüfen ob JSON model geladen ist mit globalen infos
		this.jsonAppModel = sap.ui.getCore().getModel("jsonAppModel");
		if (typeof this.jsonAppModel.currentScreen !== "undefined") {
			this.getView().byId("footerMessage").setText("Last Screen: "+this.jsonAppModel.currentScreen);
		}
		this.getView().setBusy(false);
	},
	
	onVendors: function() {
		this.getRouter().navTo("ven_master", {
			currentView: this.getView()
		}, this.bReplace);
	},
	
	onOtherApp: function() {
		this.getRouter().navTo("_otherApp", {
			currentView: this.getView()
		}, this.bReplace);
	},
	
	onHeadOfAccountPress: function() {
		this.getRouter().navTo("headOfAccount_master", {
			currentView: this.getView()
		}, this.bReplace);
	},
	
	onConsortium: function() {
		this.getRouter().navTo("Consortium_master", {
			currentView: this.getView()
		}, this.bReplace);
	},
	onInstitution: function() {
		this.getRouter().navTo("Institution_master", {
			currentView: this.getView()
		}, this.bReplace);
	},
	onAuthor: function() {
		this.getRouter().navTo("Author_master", {
			currentView: this.getView()
		}, this.bReplace);
	},
	onBPSearch: function() {
		this.getRouter().navTo("just_BPSearch", {
			currentView: this.getView()
		}, this.bReplace);
	},
	
	
	onAnotherApp: function() {
		sap.m.MessageToast.show(this.i18model.getText("NotImplementedYet"));
		/*
		this.getRouter().navTo("", {
			currentView: this.getView()
		}, this.bReplace);
		*/
	}
	
});