/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.InfoTileRenderer");sap.suite.ui.commons.InfoTileRenderer={};
sap.suite.ui.commons.InfoTileRenderer.renderTitle=function(r,c){if(c.getTitle()!==""){r.write("<div");r.addClass("sapSuiteInfoTileTitleTxt");r.addClass(c.getState());r.addClass(c.getSize());r.writeClasses();r.writeAttribute("id",c.getId()+"-title-text");r.writeAttributeEscaped("title",c.getTitle());r.write(">");r.renderControl(c._oTitle);r.write("</div>")}};
sap.suite.ui.commons.InfoTileRenderer.renderDescription=function(r,c){if(c.getDescription()!==""){r.write("<div");r.addClass("sapSuiteInfoTileDescTxt");r.addClass(c.getState());r.addClass(c.getSize());r.writeClasses();r.writeAttribute("id",c.getId()+"-description-text");r.writeAttributeEscaped("title",c.getDescription());r.write(">");r.writeEscaped(c.getDescription());r.write("</div>")}};
sap.suite.ui.commons.InfoTileRenderer.renderInnerContent=function(r,c){r.renderControl(c.getContent())};
sap.suite.ui.commons.InfoTileRenderer.renderContent=function(r,c){r.write("<div");r.addClass("sapSuiteInfoTileContent");r.addClass(c.getSize());r.writeClasses();r.writeAttribute("id",c.getId()+"-content");r.write(">");this.renderInnerContent(r,c);r.write("</div>")};
sap.suite.ui.commons.InfoTileRenderer.renderFooterText=function(r,c){if(c.getFooter()!==""){r.writeEscaped(c.getFooter())}};
sap.suite.ui.commons.InfoTileRenderer.renderFooterTooltip=function(r,c){r.writeAttributeEscaped("title",c.getFooter())};
sap.suite.ui.commons.InfoTileRenderer.renderFooter=function(r,c){var s=c.getState();r.write("<div");r.addClass("sapSuiteInfoTileFtrTxt");r.addClass(c.getSize());r.addClass(c.getState());r.writeClasses();r.writeAttribute("id",c.getId()+"-footer-text");if(s==sap.suite.ui.commons.LoadState.Loaded){this.renderFooterTooltip(r,c)}r.write(">");switch(s){case sap.suite.ui.commons.LoadState.Loading:var b=new sap.ui.core.HTML({content:"<div class='sapSuiteInfoTileLoading'><div>"});b.setBusyIndicatorDelay(0);b.setBusy(true);r.renderControl(b);break;case sap.suite.ui.commons.LoadState.Failed:r.renderControl(c._oWarningIcon);r.write("<span");r.writeAttribute("id",c.getId()+"-failed-text");r.addClass("sapSuiteInfoTileFtrFldTxt");r.writeClasses();r.write(">");r.writeEscaped(c._sFailedToLoad);r.write("</span>");break;default:this.renderFooterText(r,c)}r.write("</div>")};
sap.suite.ui.commons.InfoTileRenderer.render=function(r,c){var t=c.getTooltip_AsString();r.write("<div");r.writeControlData(c);if(t){r.writeAttributeEscaped("title",t)}r.addClass("sapSuiteInfoTile");r.addClass(c.getSize());r.addClass(c.getState());r.writeClasses();r.writeAttribute("tabindex","0");r.write(">");this.renderTitle(r,c);this.renderDescription(r,c);this.renderContent(r,c);this.renderFooter(r,c);r.write("</div>")};
