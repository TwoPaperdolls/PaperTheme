/******************************************************************
Site Name:
Author: TPD Desgin House

Javascript: Custom Javascript

This is setup for your to write custom js using the revelaing module pattern 
http://weblogs.asp.net/dwahlin/techniques-strategies-and-patterns-for-structuring-javascript-code-revealing-module-pattern

******************************************************************/

// anonymous wrapper function depends on JQuery being loaded first
(function($){
	/* =======================================================================
		Global Variables
	========================================================================== */
	var globalVar;



	/* =======================================================================
		MODULE FUNCTIONALITY COMMENTS HERE
	========================================================================== */
	// set custom jsModule declaration
	var jsModule = (function($){
		// private jsModule() variables
		var privateVar;

		function jsModule_function(){
			try{
				// **************************
				// code to execute goes here
				// **************************
			}catch(ex){console.log('jsModule_function(): ' + ex);}
		}// end jsModule_function()

		// return jsModule initilaztion method (jsModule.init)
		// to anonymous wrapper function scope
		return{ 
			init: function(){
				jsModule_function();
			}
		};

	 })($);//end jsModule module



	/* =======================================================================
		Initialize Modules
	========================================================================== */
	jsModule.init();


}($));//end anonymous wrapper function