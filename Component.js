jQuery.sap.declare("com.springer.workshopapp.Component");
jQuery.sap.require("com.springer.workshopapp.dev.devapp");
jQuery.sap.require("com.springer.workshopapp.MyRouter");

sap.ui.core.UIComponent.extend("com.springer.workshopapp.Component", {
	metadata: {
		name: "Springer SAP Tech Workshop App",
		version: "1.0", 
		includes: [],
		dependencies: {
			libs: ["sap.m", "sap.ui.layout"],
			components: []
		},

		rootView: "com.springer.workshopapp.view.App",

		config: {
			resourceBundle: "i18n/messageBundle.properties",
			serviceConfig: {
				name: "WORKSHOPAPP_SRV",
				serviceUrl: "/GTS_GATEWAY/sap/opu/odata/SBMC/WORKSHOPAPP_SRV/"
			}
		},

		routing: {
			config: {
				routerClass: com.springer.workshopapp.MyRouter,
				viewType: "XML",
				viewPath: "com.springer.workshopapp.view",
				targetAggregation: "pages",
				clearTarget: false
			},
			routes: [
				{
					pattern: "",
					name: "_welcomeScreen",
					view: "welcomeScreen",
					viewLevel: 0,
					targetAggregation: "pages",
					targetControl: "idAppControl"
				},
				{
					pattern: "otherApp",
					name: "_otherApp",
					view: "appViews/otherApp",
					viewLevel: 1,
					targetAggregation: "pages",
					targetControl: "idAppControl"
				},
				{
					pattern: "VENDORS",
					name: "_vendors",
					view: "AppSplit",
					targetAggregation: "pages",
					targetControl: "idAppControl",
					viewLevel: 1,
                    subroutes: [
                        {
                            pattern : "VENDORS",
                            name: "ven_master",
                            view: "appViews/vendorMaster",
                            targetAggregation : "masterPages",
                            targetControl : "idSplitAppControl",
                            viewLevel: 2,
                            subroutes : [
                                {
                                    pattern : "VENDORS/{entity}/:tab:",
                                    name: "ven_detail",
                                    view: "appViews/vendorDetails",
                                    targetAggregation: "detailPages",
                                    viewLevel: 3
                                }
                            ]
                        }
                    ]
                },
				{
					pattern: "HoT",
					name: "_headOfAccount",
					view: "AppSplit",
					targetAggregation: "pages",
					targetControl: "idAppControl",
					viewLevel: 1,
                    subroutes: [
                        {
                            pattern : "HoT",
                            name: "headOfAccount_master",
                            view: "appViews/HeadOfAccountMaster",
                            targetAggregation : "masterPages",
                            targetControl : "idSplitAppControl",
                            viewLevel: 2,
                            subroutes : [
                                {
                                    pattern : "HoT/{entity}/:tab:",
                                    name: "headOfAccount_detail",
                                    view: "appViews/HeadOfAccountDetails",
                                    targetAggregation: "detailPages",
                                    viewLevel: 3
                                }
                            ]
                        }
                    ]
                },
				{
					pattern: "Consortium",
					name: "_Consortium",
					view: "AppSplit",
					targetAggregation: "pages",
					targetControl: "idAppControl",
					viewLevel: 1,
                    subroutes: [
                        {
                            pattern : "Consortium",
                            name: "Consortium_master",
                            view: "appViews/ConsortiumMaster",
                            targetAggregation : "masterPages",
                            targetControl : "idSplitAppControl",
                            viewLevel: 2,
                            subroutes : [
                                {
                                    pattern : "Consortium/{entity}/:tab:",
                                    name: "Consortium_detail",
                                    view: "appViews/ConsortiumDetails",
                                    targetAggregation: "detailPages",
                                    viewLevel: 3
                                }
                            ]
                        }
                    ]
                },
				{
					pattern: "Institution",
					name: "_Institution",
					view: "AppSplit",
					targetAggregation: "pages",
					targetControl: "idAppControl",
					viewLevel: 1,
                    subroutes: [
                        {
                            pattern : "Institution",
                            name: "Institution_master",
                            view: "appViews/InstitutionMaster",
                            targetAggregation : "masterPages",
                            targetControl : "idSplitAppControl",
                            viewLevel: 2,
                            subroutes : [
                                {
                                    pattern : "Institution/{entity}/:tab:",
                                    name: "Institution_detail",
                                    view: "appViews/InstitutionDetails",
                                    targetAggregation: "detailPages",
                                    viewLevel: 3
                                }
                            ]
                        }
                    ]
                },
				{
					pattern: "Author",
					name: "_Author",
					view: "AppSplit",
					targetAggregation: "pages",
					targetControl: "idAppControl",
					viewLevel: 1,
                    subroutes: [
                        {
                            pattern : "Author",
                            name: "Author_master",
                            view: "appViews/AuthorMaster",
                            targetAggregation : "masterPages",
                            targetControl : "idSplitAppControl",
                            viewLevel: 2,
                            subroutes : [
                                {
                                    pattern : "Author/{entity}/:tab:",
                                    name: "Author_detail",
                                    view: "appViews/AuthorDetails",
                                    targetAggregation: "detailPages",
                                    viewLevel: 3
                                }
                            ]
                        }
                    ]
                },
				{
					pattern: "BPSearch",
					name: "just_BPSearch",
					view: "appViews/just_BPSearch",
					viewLevel: 1,
					targetAggregation: "pages",
					targetControl: "idAppControl"
				},
				{
					pattern: "{all*}",
					name: "catchallDetail",
					view: "NotFound",
					targetAggregation: "pages",
					targetControl: "idAppControl",
					viewLevel: 1
                }
			]
		}
	},

	/**
	 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
	 * In this method, the resource and application models are set and the router is initialized.
	 */
	init: function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("com.springer.workshopapp");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		var oModel;
		var externalURL = com.springer.workshopapp.dev.devapp.externalURL;
		var appContext;
		if (com.springer.workshopapp.dev.devapp.devLogon) {
			appContext = com.springer.workshopapp.dev.devapp.devLogon.appContext;
		}
		if (window.cordova && appContext && !window.sap_webide_companion && !externalURL) {
			var url = appContext.applicationEndpointURL + "/";
			var oHeader = {
				"X-SMP-APPCID": appContext.applicationConnectionId
			};

			if (appContext.registrationContext.user) {
				oHeader.Authorization = "Basic " + btoa(appContext.registrationContext.user + ":" + appContext.registrationContext.password);
			}
			oModel = new sap.ui.model.odata.ODataModel(url, true, null, null, oHeader);
			this._setModel(oModel);
		} else {
			var sServiceUrl = mConfig.serviceConfig.serviceUrl;
			if (externalURL) {
				sServiceUrl = externalURL;
			}

			//This code is only needed for testing the application when there is no local proxy available, and to have stable test data.
			var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
			// start the mock server for the domain model
			if (bIsMocked) {
				this._startMockServer(sServiceUrl);
			}

			var self = this;
			// Create and set domain model to the component
			// only call customized logon dialog when in android companion app to workaround cordova browser for 'basic' auth issue
			if ((window.sap_webide_companion || externalURL) && device) {
				if (device.platform === 'Android') {
					if (window.sap_webide_companion) {
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
						self._setModel(oModel);
					} else {
						this._logon(sServiceUrl, null, null, function() {
							oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
							self._setModel(oModel);
						}, function() {
							self._openLogonDialog(sServiceUrl);
						}, null);
					}
				} else {
					var username = "";
					var password = "";
					this._logon(sServiceUrl, username, password, function() {
						var auth = "Basic " + btoa(username + ":" + password);
						var uHeader = {
							"Authorization": auth
						};
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true, null, null, uHeader);
						self._setModel(oModel);
					}, null, null);
				}
			} else {
				var isSafari = false,
					av = navigator.appVersion;
				if (/AppleWebKit\/(\S+)/.test(av)) {
					if (!/Chrome\/(\S+)/.test(av) && av.indexOf("Safari") >= 0) {
						isSafari = true;
					}
				}
				if (isSafari) {
					self._logon(sServiceUrl, null, null, function() {
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
						self._setModel(oModel);
					}, function() {
						self._openLogonDialog(sServiceUrl);
					}, null);
				} else {
					// Create and set domain model to the component
					oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {
						json: true,
						loadMetadataAsync: true
					});
					this._setModel(oModel);
				}
			}
		}
	},

	/**
	 * perform an ajax asynchronous HTTP request
	 * param{String} url OData service Url
	 * param{String} usr OData service username
	 * param{String} pwd OData service password
	 * param{Object} onLogonSuccess success callback function
	 * param{Object} onUnauthorized authentication error callback function
	 * param{Object} onLogonError general error callback function
	 */
	_logon: function(url, usr, pwd, onLogonSuccess, onUnauthorized, onLogonError) {
		var auth = "Basic " + btoa(usr + ":" + pwd);
		$.ajax({
			type: "GET",
			url: url,
			username: usr,
			password: pwd,
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", auth);
			},
			statusCode: {
				401: onUnauthorized
			},
			error: onLogonError,
			success: onLogonSuccess
		});
	},

	/**
	 * open an authentication dialog to get OData service username and password from user
	 * param{String} sServiceUrl OData service Url
	 */
	_openLogonDialog: function(sServiceUrl) {
		var logonDialog = new sap.m.Dialog();
		logonDialog.setTitle("Basic Authentication");

		var vbox = new sap.m.VBox();
		this._userInput = new sap.m.Input();
		this._userInput.setPlaceholder("Username");
		this._pwdInput = new sap.m.Input();
		this._pwdInput.setPlaceholder("Password");
		this._pwdInput.setType(sap.m.InputType.Password);
		vbox.addItem(this._userInput);
		vbox.addItem(this._pwdInput);
		logonDialog.addContent(vbox);

		var self = this;
		logonDialog.addButton(new sap.m.Button({
			text: "OK",
			press: function() {
				var username = self._userInput.getValue();
				var password = self._pwdInput.getValue();

				self._logon(sServiceUrl, username, password, function() {
					logonDialog.close();
					// Create and set domain model to the component
					var oModel;
					if (username && password) {
						var auth = "Basic " + btoa(username + ":" + password);
						var uHeader = {
							"Authorization": auth
						};
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true, null, null, uHeader);
					} else {
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
					}
					self._setModel(oModel);
				}, function() {
					alert("Username or Password is incorrect!");
					self._userInput.setValue("");
					self._pwdInput.setValue("");
				}, function(e) {
					//alert(e.statusText);
				});
			}
		}));
		logonDialog.addButton(new sap.m.Button({
			text: "Cancel",
			press: function() {
				logonDialog.close();
			}
		}));
		logonDialog.open();
	},

	/**
	 * set UI5 OData model and device model, initialize router
	 * param{Object} oModel application OData model
	 */
	_setModel: function(oModel) {
		this.setModel(oModel);

		// set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch: sap.ui.Device.support.touch,
			isNoTouch: !sap.ui.Device.support.touch,
			isPhone: sap.ui.Device.system.phone,
			isNoPhone: !sap.ui.Device.system.phone,
			listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(oDeviceModel, "device");

		this.getRouter().initialize();
	},

	/**
	 * start application mock server
	 * param{String} sServiceUrl mock server url
	 */
	_startMockServer: function(sServiceUrl) {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: sServiceUrl
		});

		var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
		sap.ui.core.util.MockServer.config({
			autoRespondAfter: iDelay
		});

		oMockServer.simulate("model/metadata.xml", "model/");
		oMockServer.start();

		sap.m.MessageToast.show("Running in demo mode with mock data.", {
			duration: 2000
		});
	}
});
