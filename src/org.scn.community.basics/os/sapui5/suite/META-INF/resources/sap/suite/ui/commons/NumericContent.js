/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.NumericContent");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.NumericContent",{metadata:{library:"sap.suite.ui.commons",properties:{"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"value":{type:"string",group:"Misc",defaultValue:null},"scale":{type:"string",group:"Misc",defaultValue:null},"valueColor":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileValueColor.Neutral},"indicator":{type:"string",group:"Misc",defaultValue:null},"state":{type:"sap.suite.ui.commons.LoadState",group:"Misc",defaultValue:sap.suite.ui.commons.LoadState.Loaded},"animateTextChange":{type:"boolean",group:"Misc",defaultValue:true},"formatterValue":{type:"boolean",group:"Misc",defaultValue:false},"truncateValueTo":{type:"int",group:"Misc",defaultValue:4},"icon":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"nullifyValue":{type:"boolean",group:"Misc",defaultValue:true},"iconDescription":{type:"string",group:"Misc",defaultValue:null}},events:{"press":{}}}});sap.suite.ui.commons.NumericContent.M_EVENTS={'press':'press'};jQuery.sap.require("sap.ui.core.IconPool");
sap.suite.ui.commons.NumericContent.prototype.init=function(){this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons")};
sap.suite.ui.commons.NumericContent.prototype.onAfterRendering=function(){if(sap.suite.ui.commons.LoadState.Loaded==this.getState()||this.getAnimateTextChange()){jQuery.sap.byId(this.getId()).animate({opacity:"1"},1000)}};
sap.suite.ui.commons.NumericContent.prototype.setIcon=function(i){var v=!jQuery.sap.equal(this.getIcon(),i);if(v){if(this._oIcon){this._oIcon.destroy();this._oIcon=undefined}if(i){this._oIcon=sap.ui.core.IconPool.createControlByURI({id:this.getId()+"-icon-image",src:i,},sap.m.Image);this._oIcon.addStyleClass("sapSuiteUiCommonsNCIconImage")}}return this.setProperty("icon",i)};
sap.suite.ui.commons.NumericContent.prototype.ontap=function(e){if(sap.ui.Device.browser.internet_explorer){this.$().focus()}this.firePress()};
sap.suite.ui.commons.NumericContent.prototype.onkeydown=function(e){if(e.which==jQuery.sap.KeyCodes.ENTER||e.which==jQuery.sap.KeyCodes.SPACE){this.firePress();e.preventDefault()}};
sap.suite.ui.commons.NumericContent.prototype.exit=function(){if(this._oIcon){this._oIcon.destroy()}};
sap.suite.ui.commons.NumericContent.prototype.attachEvent=function(e,d,f,l){sap.ui.core.Control.prototype.attachEvent.call(this,e,d,f,l);if(this.hasListeners("press")){this.$().attr("tabindex",0).addClass("sapSuiteUiCommonsPointer")}return this};
sap.suite.ui.commons.NumericContent.prototype.detachEvent=function(e,f,l){sap.ui.core.Control.prototype.detachEvent.call(this,e,f,l);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapSuiteUiCommonsPointer")}return this};
sap.suite.ui.commons.NumericContent.prototype.getAltText=function(){var v=this.getValue();var s=this.getScale();var e=this.getNullifyValue()?"0":"";var m=this._rb.getText(("SEMANTIC_COLOR_"+this.getValueColor()).toUpperCase());var a="";if(this.getIconDescription()){a=a.concat(this.getIconDescription());a=a.concat("\n")}a=a.concat(v?v+s:e);a=a.concat("\n");if(this.getIndicator()&&this.getIndicator()!=sap.suite.ui.commons.DeviationIndicator.None){a=a.concat(this._rb.getText(("NUMERICCONTENT_DEVIATION_"+this.getIndicator()).toUpperCase()));a=a.concat("\n")}a=a.concat(m);return a};
sap.suite.ui.commons.NumericContent.prototype.getTooltip_AsString=function(){var t=this.getTooltip();var T=this.getAltText();if(typeof t==="string"||t instanceof String){if(t.indexOf("{AltText}")!=-1){T=t.split("{AltText}").join(T)}else{T=t}}return T};
sap.suite.ui.commons.NumericContent.prototype._parseFormattedValue=function(v){return{scale:v.replace(/[^a-z ا-ي]/gi,"").trim(),value:v.replace(/([+-.,\d]*).*/g,"$1").trim()}};
