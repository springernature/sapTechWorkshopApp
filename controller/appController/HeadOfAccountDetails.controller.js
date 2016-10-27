jQuery.sap.require("com.springer.workshopapp.util.Formatter");
jQuery.sap.require("com.springer.workshopapp.util.Controller");

com.springer.workshopapp.util.Controller.extend("com.springer.workshopapp.controller.appController.HeadOfAccountDetails", {

	/**
	 * Called when the detail list controller is instantiated. 
	 */
	onInit: function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if (sap.ui.Device.system.phone) {
			//don't wait for the master on a phone
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			this.getView().setBusy(true);
			this.getEventBus().subscribe("HeadOfAccountMaster", "InitialLoadFinished", this.onMasterLoaded, this);
		}
		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
	},

	/**
	 * Master InitialLoadFinished event handler
	 * @param{String} sChanel event channel name
	 * @param{String}} sEvent event name
	 * @param{Object}} oData event data object
	 */
	onMasterLoaded: function(sChannel, sEvent, oData) {
		if (oData.oListItem) {
			this.bindView(oData.oListItem.getBindingContext().getPath());
			this.getView().setBusy(false);
			this.oInitialLoadFinishedDeferred.resolve();
		}
	},

	/**
	 * Detail view RoutePatternMatched event handler 
	 * @param{sap.ui.base.Event} oEvent router pattern matched event object
	 */
	onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();
		
		// when detail navigation occurs, update the binding context
		if (oParameters.name !== "headOfAccount_detail") {
			return;
		}

// binding the clicked item from the list to the detail screen
// and take care of Tab data
		var sEntityPath = "/" + oParameters.arguments.entity;
		this.bindView(sEntityPath);

// check which tab should be selected ->  select the detail tab 
		this.sTabKey = oParameters.arguments.tab;
		if (typeof this.sTabKey === "undefined") {
			this.sTabKey = "HeadOfAccountMailsSet";
		}
		this.getEventBus().publish("HeadOfAccountDetails", "TabChanged", {
			sTabKey: this.sTabKey
		});

		var oView = this.getView();
		var oIconTabBar = oView.byId("idIconTabBar");
		if (oIconTabBar.getSelectedKey() !== this.sTabKey) {
			oIconTabBar.setSelectedKey(this.sTabKey);
		}
		this.getView().setBusy(false);
	},

	/**
	 * Binds the view to the object path.
	 * @param {string} sEntityPath path to the entity
	 */
	bindView: function(sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		if (typeof this.sTabKey === "undefined") {
			this.sTabKey = "HeadOfAccountDetails";
		}

		switch (this.sTabKey) {
			case "HeadOfAccountDetails":
				var sAggregationPath = "/CompanyCodesSet"; // odata service
				var oListMails = this.getView().byId("listHeadOfAccount");
				oListMails.unbindAggregation("items");
				oListMails.bindAggregation("items", {
					path: sAggregationPath,
					template: sap.ui.xmlfragment("com.springer.workshopapp.view.fragments.listFragment", this)
				});
				break;
			case "HeadOfAccountMore":
				
				sap.m.MessageToast.show(this.i18model.getText("NotImplementedYet"));
				
				break;
			default:
		}
	},

	/**
	 * display NotFound view
	 */
	showEmptyView: function() {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "com.springer.workshopapp.view.NotFound",
			targetViewType: "XML"
		});
	},

	/**
	 * publish Detail Changed event
	 */
	fireDetailChanged: function(sEntityPath) {
		this.getEventBus().publish("HeadOfAccountDetails", "Changed", {
			sEntityPath: sEntityPath
		});
	},

	/**
	 * publish Detail NotFound event
	 */
	fireDetailNotFound: function() {
		this.getEventBus().publish("HeadOfAccountDetails", "NotFound");
	},

	/**
	 * Navigates back to vendor master view
	 */
	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("headOfAccount_master");
	},

	/**
	 * Detail view icon tab bar select event handler
	 */
	onDetailSelect: function(oEvent) {
		this.sTabKey = oEvent.getParameter("selectedKey");
		sap.ui.core.UIComponent.getRouterFor(this).navTo("headOfAccount_detail", {
			entity: oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: this.sTabKey
		}, true);
	}

});