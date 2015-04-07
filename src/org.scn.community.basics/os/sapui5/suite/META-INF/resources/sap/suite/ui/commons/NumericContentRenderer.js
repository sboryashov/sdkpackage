/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.NumericContentRenderer");sap.suite.ui.commons.NumericContentRenderer={};
sap.suite.ui.commons.NumericContentRenderer.render=function(r,c){var e=c.getNullifyValue()?"0":"";var s=c.getSize();var v=c.getValue();var i=c.getIndicator();var S=c.getScale();var a=c.getState();var C=c.getValueColor();var I=sap.suite.ui.commons.DeviationIndicator.None!=i&&""!=v;var o=c._oIcon;if(c.getFormatterValue()){var f=c._parseFormattedValue(v);S=f.scale;v=f.value}var b=S&&v;r.write("<div");r.writeControlData(c);r.writeAttributeEscaped("title",c.getTooltip_AsString());if(c.getAnimateTextChange()){r.addStyle("opacity","0.25");r.writeStyles()}r.addClass(s);r.addClass("sapSuiteUiCommonsNC");if(c.hasListeners("press")){r.writeAttribute("tabindex","0");r.addClass("sapSuiteUiCommonsPointer")}r.writeClasses();r.write(">");r.write("<div");r.addClass("sapSuiteUiCommonsNCInner");r.addClass(s);r.writeClasses();r.write(">");if(I||b){r.write("<div");r.addClass("sapSuiteUiCommonsNCIndScale");r.addClass(s);r.addClass(a);r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-indicator");r.addClass("sapSuiteUiCommonsNCIndicator");r.addClass(s);r.addClass(i);r.addClass(a);r.addClass(C);r.writeClasses();r.write("></div>");if(b){r.write("<div");r.writeAttribute("id",c.getId()+"-scale");r.addClass("sapSuiteUiCommonsNCScale");r.addClass(s);r.addClass(a);r.addClass(C);r.writeClasses();r.write(">");r.writeEscaped(S.substring(0,3));r.write("</div>")}r.write("</div>")}if(o){o.addStyleClass(s);o.addStyleClass(a);r.renderControl(o);o.removeStyleClass(s);o.removeStyleClass(a)}r.write("<div");r.writeAttribute("id",c.getId()+"-value");r.addClass("sapSuiteUiCommonsNCValue");r.addClass(C);r.addClass(s);r.addClass(a);r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-value-scr");r.addClass("sapSuiteUiCommonsNCValueScr");r.addClass(s);r.writeClasses();r.write(">");var d=c.getTruncateValueTo();if(v.length>=d&&(v[d-1]==="."||v[d-1]===",")){r.writeEscaped(v.substring(0,d-1))}else{r.writeEscaped(v?v.substring(0,d):e)}r.write("</div>");r.write("</div>");r.write("</div>");r.write("</div>")};
