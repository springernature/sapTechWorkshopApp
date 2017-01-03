jQuery.sap.require("com.springer.workshopapp.util.Formatter");
jQuery.sap.require("com.springer.workshopapp.util.Controller");

com.springer.workshopapp.util.Controller.extend("com.springer.workshopapp.controller.appController.HeadOfAccountMaster", {

	/**
	 * Called when the master list controller is instantiated. 
	 * It sets up the event handling for the master/detail communication and other lifecycle tasks.
	 */ 
	onInit: function() {
		// event after screen objects loaded
		this.getView().addEventDelegate({
			onAfterShow: jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});

		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		var oEventBus = this.getEventBus();
		this.getView().byId("HeadOfAccountMasterList").attachEventOnce("updateFinished", function() {
			this.oInitialLoadFinishedDeferred.resolve();
			oEventBus.publish("HeadOfAccountMaster", "InitialLoadFinished", {
				oListItem: this.getView().byId("HeadOfAccountMasterList").getItems()[0]
			});
		}, this);

		oEventBus.subscribe("HeadOfAccountDetails", "TabChanged", this.onDetailTabChanged, this);

		//on phones, we will not have to select anything in the list so we don't need to attach to events
		if (sap.ui.Device.system.phone) {
			return;
		}

		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

		oEventBus.subscribe("HeadOfAccountDetails", "Changed", this.onDetailChanged, this);
		oEventBus.subscribe("HeadOfAccountDetails", "NotFound", this.onNotFound, this);
	},

	/**
	 * Master view RoutePatternMatched event handler 
	 * @param{sap.ui.base.Event} oEvent router pattern matched event object
	 */
	onRouteMatched: function(oEvent) {
		var sName = oEvent.getParameter("name");

		if (sName !== "headOfAccount_master") {
			return;
		}

		//Load the detail view in desktop
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "com.springer.workshopapp.view.appViews.HeadOfAccountDetails",
			targetViewType: "XML"
		});

		//Wait for the list to be loaded once
		this.waitForInitialListLoading(function() {
			//On the empty hash select the first item
			this.selectFirstItem();
		});

		// bind external odata service

		//var vUrl = "https://www.bloomberg.com/markets/api/comparison/data-bfix?currencies=AUDUSD,USDILS,EURUSD,EURMXN,EURNZD&dateTime=2016-10-28T12:00:00Z";
		$.ajax({
    		crossDomain: true,
    		contentType: "application/json; charset=utf-8",
			url: "http://hub.springer-sbm.com/BLOOMBERG_EXCHANGE_RATES",
			type: "GET", //or POST?
    		jsonpCallback: 'callback',
			data: { currencies: "AUDUSD,USDILS,EURUSD,EURMXN,EURNZD",
					dateTime: "2016-10-28T13:00:00Z" }, 
			dataType: "json",
			xhrFields: {
				withCredentials: false
			},
			beforeSend: function(request) {
				//request.setRequestHeader("Authorization", "Basic U1lTVEVNOiNhbmFWMHJh");
			},
			success: function(dataWeGotViaJsonp) {
				console.log("SUCCESS");
				console.log(dataWeGotViaJsonp);

			},
			error: function(oError) {
				console.log("error");
				console.log(oError);
			}
		});

		/*
				$.ajax({
					url: "https://SYSTEM:#anaV0ra@52.55.195.82:8000/com/springernature/saptech/shrpa/services/SHRPA.xsodata/project?$format=json",
					type: "GET", //or POST?
					dataType: "jsonp",
					success: function(dataWeGotViaJsonp) {
						console.log(dataWeGotViaJsonp);

					},
					error: function() {
						alert("error");

					}
				});
		*/

		/*
						var sAggregationPath = "/WorkshopTestDataSet"; // odata service
				var oListMails = this.getView().byId("listHeadOfAccount");
				oListMails.unbindAggregation("items");
				oListMails.bindAggregation("items", {
					path: sAggregationPath,
					template: sap.ui.xmlfragment("com.springer.workshopapp.view.fragments.listFragment", this)
				});
		*/

	},

	onAfterShow: function() {
		// prüfen ob JSON model geladen ist mit globalen infos
		if (typeof this.jsonAppModel === "undefined") {
			this.jsonAppModel = sap.ui.getCore().getModel("jsonAppModel");
		}
		
		this.jsonAppModel.currentScreen = "HeadOfAccountApp";
		sap.ui.getCore().setModel(this.jsonAppModel, "jsonAppModel");

		this.getView().setBusy(false);
	},

	/**
	 * Detail changed event handler, set selected item
	 * @param{String} sChanel event channel name
	 * @param{String}} sEvent event name
	 * @param{Object}} oData event data object
	 */
	onDetailChanged: function(sChanel, sEvent, oData) {
		var sProductPath = oData.sProductPath;
		//Wait for the list to be loaded once
		this.waitForInitialListLoading(function() {
			var oList = this.getView().byId("HeadOfAccountMasterList");

			var oSelectedItem = oList.getSelectedItem();
			// the correct item is already selected
			if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sProductPath) {
				return;
			}

			var aItems = oList.getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getBindingContext().getPath() === sProductPath) {
					oList.setSelectedItem(aItems[i], true);
					break;
				}
			}
		});
	},

	/**
	 * Detail TabChanged event handler
	 * @param{String} sChanel event channel name
	 * @param{String}} sEvent event name
	 * @param{Object}} oData event data object
	 */
	onDetailTabChanged: function(sChanel, sEvent, oData) {
		this.sTab = oData.sTabKey;
	},

	/**
	 * wait until this.oInitialLoadFinishedDeferred is resolved, and list view updated
	 * @param{function} fnToExecute the function will be executed if this.oInitialLoadFinishedDeferred is resolved
	 */
	waitForInitialListLoading: function(fnToExecute) {
		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
	},

	/**
	 * Detail NotFound event handler
	 */
	onNotFound: function() {
		this.getView().byId("HeadOfAccountMasterList").removeSelections();
	},

	/**
	 * set the first item as selected item
	 */
	selectFirstItem: function() {
		var oList = this.getView().byId("HeadOfAccountMasterList");
		var aItems = oList.getItems();
		if (aItems.length) {
			oList.setSelectedItem(aItems[0], true);
		}
	},

	/**
	 * Event handler for the master search field. Applies current
	 * filter value and triggers a new search. If the search field's
	 * 'refresh' button has been pressed, no new search is triggered
	 * and the list binding is refresh instead.
	 */
	onSearch: function() {
		// add filter for search
		var filters = [];
		var searchString = this.getView().byId("searchField").getValue();

		var searchAttribute = "Attribute1";
		if (this.getView().byId("radA_button_opt2").getSelected() === true) {
			searchAttribute = "Attribute2";
		}

		var searchOperator = sap.ui.model.FilterOperator.EQ;
		if (this.getView().byId("radB_button_opt2").getSelected() === true) {
			searchOperator = sap.ui.model.FilterOperator.Contains;
		}

		if (searchString && searchString.length > 0) {
			filters = [new sap.ui.model.Filter(searchAttribute, searchOperator, searchString)];
		}

		// update list binding
		var list = this.getView().byId("HeadOfAccountMasterList");

		sap.m.MessageToast.show("Search: " + searchOperator + " " + searchAttribute);

		/*
		list.getBinding("items").filter(filters);
		this._selectedItemIdx = list.indexOfItem(list.getSelectedItem());
		*/

	},

	/**
	 * Event handler for the list selection event
	 * @param {sap.ui.base.Event} oEvent the list selectionChange event
	 */
	onSelect: function(oEvent) {
		// Get the list item, either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode).
		this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},

	/**
	 * Shows the selected item on the detail page
	 * On phones a additional history entry is created
	 * @param {sap.m.ObjectListItem} oItem selected Item
	 */
	showDetail: function(oItem) {
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		console.log(oItem.getBindingContext().getPath().substr(1));
		this.getRouter().navTo("headOfAccount_detail", {
			from: "headOfAccount_master",
			entity: oItem.getBindingContext().getPath().substr(1),
			tab: this.sTab
		}, bReplace);
	},
	onNavBack: function() {
		var bReplace = sap.ui.Device.system.phone ? false : true;
		this.getRouter().navTo("_welcomeScreen", {
			currentView: this.getView()
		}, bReplace);
		//window.history.go(-1);
	},
	handleNavToHome: function() {
		var bReplace = sap.ui.Device.system.phone ? false : true;
		this.getRouter().navTo("_welcomeScreen", {
			currentView: this.getView()
		}, bReplace);
	}
});
