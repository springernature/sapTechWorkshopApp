jQuery.sap.declare("com.springer.workshopapp.dev.devlogon");

sap.ui.base.ManagedObject.extend("com.springer.workshopapp.dev.devlogon", {
	appContext: null,

	/********************************************************************
	 * constructor
	 ********************************************************************/
	constructor: function() {
		if (typeof com.springer.workshopapp.dev.devlogon.__instance === "object") {
			return com.springer.workshopapp.dev.devlogon.__instance;
		}
		com.springer.workshopapp.dev.devlogon.__instance = this;
	},

	/********************************************************************
	 * Initialize the application
	 * In this case, it will check first of the application has already
	 * registered with the SMP server. If not, it will register the app
	 * then proceed to manage the logon process.
	 * @param{Object} context SMP/HCPms logon input context
	 * @param{String} appId SMP/HCPms application ID
	 ********************************************************************/
	doLogonInit: function(context, appId) {
		//Init needs to happen before anything else.
		console.log("Entering doLogonInit");

		//Is there a host address populated?
		if (context.serverHost.length < 1) {
			//If not, nothing we can do now
			console.log("You must set a SMP/HCPms Server host before you can initialize the server connection.");
			return;
		}
		//Make call to Logon's Init method to get things registered and all setup
		this.startApp = true;
		var that = this;
		if (window.sap_webide_companion) {
			sap.Logon.initPasscodeManager(
				function(ctx) {
					that.onLogonInitSuccess(ctx);
				},
				function(err) {
					that.onLogonError(err);
				}, appId);
		} else {
			sap.Logon.init(
				function(ctx) {
					that.onLogonInitSuccess(ctx);
				},
				function(err) {
					that.onLogonError(err);
				}, appId, context);
		}
		console.log("Leaving doLogonInit");
	},

	/********************************************************************
	 * Success Callback function for logon
	 * @param{Object} context the returned context 
	 ********************************************************************/
	onLogonInitSuccess: function(context) {
		console.log("Entering LogonInitSuccess");
		//Make sure Logon returned a context for us to work with
		if (context) {
			if (this.startApp) {
				//Store the context away to be used later if necessary
				this.appContext = context;
				//start UI5 application
				startApp();
				this.startApp = false;
			}
		} else {
			//Something went seriously wrong here, context is not populated
			console.error("context null");
		}
		console.log("Leaving LogonInitSuccess");
	},

	/********************************************************************
	 * Error Callback function
	 * @param{Object} errObj the returned error object 
	 ********************************************************************/
	onLogonError: function(errObj) {
		//Generic error function, used as a callback by several of the methods
		console.error("Entering logonError");
		//write the contents of the error object to the console.
		console.error(JSON.stringify(errObj));
		console.error("Leaving logonError");
	},

	/********************************************************************
	 * Delete the application's registration information
	 * Disconnects the app from the SMP server
	 ********************************************************************/
	doDeleteRegistration: function() {
		console.log("Entering doDeleteRegistration");
		var that = this;
		if (this.appContext) {
			//Call logon's deleteRegistration method
			sap.Logon.core.deleteRegistration(
				function(res) {
					that.onDeleteRegistrationSuccess(res);
				},
				function(err) {
					that.onLogonError(err);
				});
		} else {
			//nothing to do here, move along...
			var msg = "The application is not initialized, cannot delete context";
			console.log(msg);
		}
		console.log("Leaving doDeleteRegistrationU");
	},

	/********************************************************************
	 * Success Callback function for sap.Logon.core.deleteRegistration()
	 * @param{Object} res the returned information object 
	 ********************************************************************/
	onDeleteRegistrationSuccess: function(res) {
		console.log("Entering unregisterSuccess");
		console.log("Unregister result: " + JSON.stringify(res));
		//Set appContext to null so the app will know it's not registered
		this.appContext = null;
		//reset the app to its original packaged version
		//(remove all updates retrieved by the AppUpdate plugin)
		sap.AppUpdate.reset();
		console.log("Leaving unregisterSuccess");
	},

	/********************************************************************
	 * Lock the DataVault
	 ********************************************************************/
	doLogonLock: function() {
		console.log("Entering doLogonLock");
		//Everything here is managed by the Logon plugin, there's nothing for
		//the developer to do except to make the call to lock to
		//Lock the DataVault
		var that = this;
		sap.Logon.lock(
			function(ctx) {
				that.onLogonLockSuccess(ctx);
			},
			function(err) {
				that.onLogonError(err);
			});
		console.log("Leaving doLogonLock");
	},

	/********************************************************************
	 * Success Callback function for sap.Logon.lock()
	 ********************************************************************/
	onLogonLockSuccess: function() {
		console.log("Entering logonLockSuccess");
		console.log("Leaving logonLockSuccess");
	},

	/********************************************************************
	 * Unlock the DataVault
	 ********************************************************************/
	doLogonUnlock: function() {
		console.log("Entering doLogonUnlock");
		//Everything here is managed by the Logon plugin, there's nothing for
		//the developer to do except to make the call to unlock.
		//we'll be using the same success callback as
		//with init as the signatures are the same and have the same functionality
		var that = this;
		sap.Logon.unlock(
			function(ctx) {
				that.onLogonInitSuccess(ctx);
			},
			function(err) {
				that.onLogonError(err);
			});
		console.log("Leaving doLogonUnlock");
	},

	/********************************************************************
	 * Show the application's registration information
	 ********************************************************************/
	doLogonShowRegistrationData: function() {
		console.log("Entering doLogonShowRegistrationData");
		//Everything here is managed by the Logon plugin, there's nothing for
		//the developer to do except to make a call to showRegistratioData
		sap.Logon.showRegistrationData(this.onShowRegistrationSuccess, this.onShowRegistrationError);
		console.log("Leaving doLogonShowRegistrationData");
	},

	/********************************************************************
	 * Success Callback function for sap.Logon.showRegistrationData()
	 ********************************************************************/
	onShowRegistrationSuccess: function() {
		console.log("Entering showRegistrationSuccess");
		//Nothing to see here, move along...
		console.log("Leaving showRegistrationSuccess");
	},

	/********************************************************************
	 * Error Callback function for sap.Logon.showRegistrationData()
	 * @param{Object} errObj the returned error object
	 ********************************************************************/
	onShowRegistrationError: function(errObj) {
		console.log("Entering showRegistrationError");
		console.error(JSON.stringify(errObj));
		console.log("Leaving showRegistrationError");
	},

	/********************************************************************
	 * Update the DataVault password for the user
	 ********************************************************************/
	doLogonChangePassword: function() {
		console.log("Entering doLogonChangePassword");
		//Everything here is managed by the Logon plugin, there's nothing for
		//the developer to do except to make the call to changePassword
		sap.Logon.changePassword(this.onPasswordSuccess, this.onPasswordError);
		console.log("Leaving doLogonChangePassword");
	},

	/********************************************************************
	 * Change the DataVaule passcode
	 ********************************************************************/
	doLogonManagePasscode: function() {
		console.log("Entering doLogonManagePassword");
		//Everything here is managed by the Logon plugin, there's nothing for
		//the developer to do except to make the call to managePasscode
		sap.Logon.managePasscode(this.onPasswordSuccess, this.onPasswordError);
		console.log("Leaving doLogonManagePassword");
	},

	/********************************************************************
	 * Success Callback function
	 ********************************************************************/
	onPasswordSuccess: function() {
		console.log("Entering passwordSuccess");
		//Nothing to see here, move along...
		console.log("Leaving passwordSuccess");
	},

	/********************************************************************
	 * Error Callback function
	 * @param{Object} errObj the returned error object
	 ********************************************************************/
	onPasswordError: function(errObj) {
		console.error("Entering passwordError");
		console.error("Password/passcode error");
		console.error(JSON.stringify(errObj));
		console.error("Leaving passwordError");
	},

	/********************************************************************
	 * Write values from the DataVault
	 * @param{String} theKey the key to store the provided object on
	 * @param{Object} theValue the object to be set on the given key. Must be JSON serializable (cannot contain circular references).
	 ********************************************************************/
	doLogonSetDataVaultValue: function(theKey, theValue) {
		console.log("Entering doLogonSetDataVaultValue");
		//Make sure we have both a key and a value before continuing
		//No sense writing a blank value to the DataVault
		if (theKey !== "" && theValue !== "") {
			console.log("Writing values to the DataVault");
			//Write the values to the DataVault
			sap.Logon.set(this.onDataVaultSetSuccess, this.onDataVaultSetError, theKey, theValue);
		} else {
			//One of the input values is blank, so we can't continue
			console.error("Key and/or value missing.");
		}
		console.log("Leaving doLogonSetDataVaultValue");
	},

	/********************************************************************
	 * Success Callback function for sap.Logon.set()
	 ********************************************************************/
	onDataVaultSetSuccess: function() {
		console.log("Entering dataVaultSetSuccess");
		//Clear out the input fields
		//Cordova alerts are asynchronous, so this code will likely clear the input
		//fields before the alert dialog displays
		console.log("Leaving dataVaultSetSuccess");
	},

	/********************************************************************
	 * Error Callback function
	 * @param{Object} errObj the returned error object
	 ********************************************************************/
	onDataVaultSetError: function(errObj) {
		console.error("Entering dataVaultSetError");
		console.error("Error writing to the DataVault");
		console.error("Leaving dataVaultSetError");
	},

	/********************************************************************
	 * Read values from the DataVault
	 * @param{String}} theKey the key with which to query the DataVault.
	 ********************************************************************/
	doLogonGetDataVaultValue: function(theKey) {
		console.log("Entering doLogonGetDataVaultValue");
		//Make sure we have a key before continuing
		if (theKey !== "") {
			console.log("Reading value for " + theKey + " from the DataVault");
			//Read the value from the DataVault
			sap.Logon.get(this.onDataVaultGetSuccess, this.onDataVaultGetError, theKey);
		} else {
			//One of the input values is blank, so we can't continue
			console.error("Value for key missing.");
		}
		console.log("Leaving doLogonGetDataVaultValue");
	},

	/********************************************************************
	 * Success Callback function for sap.Logon.get()
	 ********************************************************************/
	onDataVaultGetSuccess: function(value) {
		console.log("Entering dataVaultGetSuccess");
		console.log("Received: " + JSON.stringify(value));
		console.log("Leaving dataVaultGetSuccess");
	},

	/********************************************************************
	 * Error Callback function
	 * @param{Object} errObj the returned error object
	 ********************************************************************/
	onDataVaultGetError: function(errObj) {
		console.error("Entering dataVaultGetError");
		console.error(JSON.stringify(errObj));
		console.error("Leaving dataVaultGetError");
	}
});