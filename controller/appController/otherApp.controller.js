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
		if (typeof this.jsonAppModel === "undefined") {
			this.jsonAppModel = sap.ui.getCore().getModel("jsonAppModel");
		}

		this.jsonAppModel.currentScreen = "otherApp";
		sap.ui.getCore().setModel(this.jsonAppModel, "jsonAppModel");

		this.getView().setBusy(false);
	},

	onSubmitForm: function() {
		var oView = this.getView();

		var formPartner = oView.byId("formPartner").getValue();
		var formSalesOrg = oView.byId("formSalesOrg").getValue();
		var formHeadOfAccount = oView.byId("formHeadOfAccount").getValue();
		var formPartnerKind = oView.byId("formPartnerKind").getValue();
		var formTitle = oView.byId("formTitle").getValue();
		var formPartnerName = oView.byId("formPartnerName").getValue();
		var formConsortium = oView.byId("formConsortium").getValue();
		var formInstitution = oView.byId("formInstitution").getValue();
		var formAuthor = oView.byId("formAuthor").getValue();

		var oEntry = {
			"Partner": formPartner,
			"SalesOrg": formSalesOrg,
			"HeadOfAccount": formHeadOfAccount,
			"PartnerKind": formPartnerKind,
			"Title": formTitle,
			"PartnerName": formPartnerName,
			"Consortium": formConsortium,
			"Institution": formInstitution,
			"Author": formAuthor
		};
		var oModel = this.getView().getModel();
		var that = this;
		oModel.create("/WorkshopTestDataSet", oEntry, null,
			function(oData) {
				that.getView().setBusy(false);
				sap.m.MessageToast.show("Partner Created Successfully");
			},
			function(oError) {
				that.getView().setBusy(false);
				sap.m.MessageToast.show("Creation Failed");
				console.log("Creation failed " + oError);
			}
		);

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