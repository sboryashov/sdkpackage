/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
 
jQuery.sap.declare("sap.suite.ui.commons.MicroAreaChartRenderer");

/**
 * @class MicroAreaChart renderer. 
 * @static
 */
sap.suite.ui.commons.MicroAreaChartRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.suite.ui.commons.MicroAreaChartRenderer.render = function(oRm, oControl) {
	function fnWriteLbl(oLabel, sId, sClass, sType) {
		var sLabel = oLabel ? oLabel.getLabel() : "";
		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + sId);
		oRm.writeAttributeEscaped("title", sLabel);
		
		if (oLabel) {
			oRm.addClass(oLabel.getColor());
		}
		
		oRm.addClass("sapSuiteMacLbl");
		oRm.addClass(sClass);
		oRm.addClass(sType);
		oRm.writeClasses();
		oRm.write(">");
			oRm.writeEscaped(sLabel);
		oRm.write("</div>");
	};
	
    var sTooltip = oControl.getTooltip_AsString();
    
    var sTopLblType = ((oControl.getFirstYLabel() && oControl.getFirstYLabel().getLabel()) ? "L" : "")
    	+ ((oControl.getMaxLabel() && oControl.getMaxLabel().getLabel()) ? "C" : "")
    	+ ((oControl.getLastYLabel() && oControl.getLastYLabel().getLabel()) ? "R" : "");
    	
    var sBtmLblType = ((oControl.getFirstXLabel() && oControl.getFirstXLabel().getLabel()) ? "L" : "")
    	+ ((oControl.getMinLabel() && oControl.getMinLabel().getLabel()) ? "C" : "")
    	+ ((oControl.getLastXLabel() && oControl.getLastXLabel().getLabel()) ? "R" : "");

	oRm.write("<div");
		oRm.writeControlData(oControl);
		if (sTooltip) {
	        oRm.writeAttributeEscaped("title", sTooltip);
	    }
		oRm.addStyle("width", oControl.getWidth());
        oRm.addStyle("height", oControl.getHeight());
        oRm.writeStyles();
		oRm.addClass("sapSuiteMac");
		if (oControl.hasListeners("press")) {    
			oRm.addClass("sapSuiteUiCommonsPointer");
			oRm.writeAttribute("tabindex", "0");
	    }
		oRm.writeClasses();
		oRm.write(">");
			if (sTopLblType) {
				oRm.write("<div");
				oRm.writeAttribute("id", oControl.getId() + "-top-labels");
				oRm.addClass("sapSuiteMacLabels");
				oRm.addClass("Top");
				oRm.writeClasses();
				oRm.write(">");
					fnWriteLbl(oControl.getFirstYLabel(), "-top-left-lbl", "Left", sTopLblType);
					fnWriteLbl(oControl.getMaxLabel(), "-top-center-lbl", "Center", sTopLblType);
					fnWriteLbl(oControl.getLastYLabel(), "-top-right-lbl", "Right", sTopLblType);				
				oRm.write("</div>");
			}
			
			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-canvas-cont");
            oRm.addClass("sapSuiteMacCanvas");
	        if (sTopLblType) {
				oRm.addClass("topLbls");
			}
			if (sBtmLblType) {
				oRm.addClass("btmLbls");
			}
            oRm.writeClasses();
            oRm.write(">");
				oRm.write("<canvas");
	            oRm.writeAttribute("id", oControl.getId() + "-canvas");
				oRm.addStyle("width", "100%");
		        oRm.addStyle("height", "100%");
		        oRm.writeStyles();
				oRm.write("></canvas>");
			oRm.write("</div>");
			
			if (sBtmLblType) {
				oRm.write("<div");
				oRm.writeAttribute("id", oControl.getId() + "-bottom-labels");
				oRm.addClass("sapSuiteMacLabels");
				oRm.addClass("Btm");
				oRm.writeClasses();
				oRm.write(">");
					fnWriteLbl(oControl.getFirstXLabel(), "-btm-left-lbl", "Left", sBtmLblType);
					fnWriteLbl(oControl.getMinLabel(), "-btm-center-lbl", "Center", sBtmLblType);
					fnWriteLbl(oControl.getLastXLabel(), "-btm-right-lbl", "Right", sBtmLblType);
				oRm.write("</div>");
			}

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-css-helper");
			oRm.addStyle("display", "none");
			oRm.writeStyles();
			oRm.write("></div>");
			
	oRm.write("</div>");
};