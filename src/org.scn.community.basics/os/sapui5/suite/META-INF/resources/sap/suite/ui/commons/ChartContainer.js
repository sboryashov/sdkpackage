/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.ChartContainer");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.ChartContainer",{metadata:{library:"sap.suite.ui.commons",properties:{"showPersonalization":{type:"boolean",group:"Misc",defaultValue:false},"showFullScreen":{type:"boolean",group:"Misc",defaultValue:false},"fullScreen":{type:"boolean",group:"Misc",defaultValue:false},"showLegend":{type:"boolean",group:"Misc",defaultValue:true},"title":{type:"string",group:"Misc",defaultValue:''},"selectorGroupLabel":{type:"string",group:"Misc",defaultValue:null},"autoAdjustHeight":{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"content",aggregations:{"dimensionSelectors":{type:"sap.m.Select",multiple:true,singularName:"dimensionSelector"},"content":{type:"sap.suite.ui.commons.ChartContainerContent",multiple:true,singularName:"content"},"toolBar":{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"}},events:{"personalizationPress":{},"contentChange":{}}}});sap.suite.ui.commons.ChartContainer.M_EVENTS={'personalizationPress':'personalizationPress','contentChange':'contentChange'};jQuery.sap.declare("sap.suite.ui.commons.ChartContainer");jQuery.sap.require("sap.m.Popover");jQuery.sap.require("sap.m.Button");jQuery.sap.require("sap.m.Select");jQuery.sap.require("sap.m.Dialog");jQuery.sap.require("sap.ui.core.ResizeHandler");jQuery.sap.require("sap.ui.Device");sap.ui.getCore().loadLibrary("sap.viz");
sap.suite.ui.commons.ChartContainer.prototype.init=function(){this._aChartIcons=[];this._selectedChart=null;this._dimSelectorsAll=[];var l=sap.ui.getCore().getConfiguration().getLanguage();this.resBundle=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons",l);this._oFullScreenButton=new sap.m.Button({icon:"sap-icon://full-screen",type:sap.m.ButtonType.Transparent,tooltip:this.resBundle.getText("CHARTCONTAINER_FULLSCREEN"),press:jQuery.proxy(this.toggleFullScreen,this)});this._oPopup=new sap.ui.core.Popup({modal:true,shadow:false,autoClose:false});this._oPopup._applyPosition=function(p){var r=this._$();r.css({left:"0px",top:"0px",right:"0px",bottom:"0px"})};this._oShowLegendButton=new sap.m.Button({icon:"sap-icon://menu",type:sap.m.ButtonType.Transparent,tooltip:this.resBundle.getText("CHARTCONTAINER_LEGEND"),press:jQuery.proxy(this._onLegendButtonPress,this)});this._oShowAllChartButton=new sap.m.Button({type:sap.m.ButtonType.Transparent,press:jQuery.proxy(this._onShowAllChartPress,this)});this._oPhonePopoverButton=new sap.m.Button({icon:"sap-icon://overflow",type:sap.m.ButtonType.Transparent,press:jQuery.proxy(this._onPhonePopoverPress,this)});this._oPersonalizationButton=new sap.m.Button({icon:"sap-icon://person-placeholder",type:sap.m.ButtonType.Transparent,tooltip:this.resBundle.getText("CHARTCONTAINER_PERSONALIZE"),press:jQuery.proxy(this._oPersonalizationPress,this)});this._oActiveChartButton=null;this._oAllChartList=new sap.m.List({mode:sap.m.ListMode.SingleSelectMaster,showSeparators:sap.m.ListSeparators.None,includeItemInSelection:true,width:"20em",select:jQuery.proxy(function(e){var c=e.getParameter("listItem").getCustomData()[0].getValue();this._switchChart(c)},this)});this._oAllIconsList=new sap.m.List({mode:sap.m.ListMode.SingleSelectMaster,showSeparators:sap.m.ListSeparators.None,includeItemInSelection:true,width:"20em",select:jQuery.proxy(function(e){var c=e.getParameter("listItem").getCustomData()[0];this._switchFunctionPhone(c)},this)});this._oShowAllChartPopover=new sap.m.ResponsivePopover({placement:sap.m.PlacementType.Bottom,showHeader:false,content:[this._oAllChartList]});this._oPhonePopover=new sap.m.ResponsivePopover({placement:sap.m.PlacementType.Bottom,showHeader:false,content:[this._oAllIconsList]});this._oSelectedChart=null;this._oChartTitle=new sap.m.Label();this._oViewBy=new sap.m.Button({text:this.resBundle.getText("CHARTCONTAINER_VIEWBY"),type:sap.m.ButtonType.Transparent,press:jQuery.proxy(this._showViewByPopover,this)});this._oViewByPopover=new sap.m.ResponsivePopover(this.getId()+"-viewby_popover",{title:this.resBundle.getText("CHARTCONTAINER_VIEWBY"),placement:sap.m.PlacementType.Bottom,contentHeight:"15rem",contentWidth:"15rem"});this._oToolBar=new sap.m.Toolbar({active:true,design:sap.m.ToolbarDesign.Solid,content:[new sap.m.ToolbarSpacer()]});this.setAggregation("toolBar",this._oToolBar);this._currentRangeName=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;sap.ui.Device.media.attachHandler(this._handleMediaChange,this,sap.ui.Device.media.RANGESETS.SAP_STANDARD)};
sap.suite.ui.commons.ChartContainer.prototype.toggleFullScreen=function(){var f=this.getProperty("fullScreen");if(f){this.closeFullScreen();this.setProperty("fullScreen",false)}else{this.openFullScreen(this,true);this.setProperty("fullScreen",true)}var i=(f?"sap-icon://full-screen":"sap-icon://exit-full-screen");this._oFullScreenButton.setIcon(i)};
sap.suite.ui.commons.ChartContainer.prototype.openFullScreen=function(c,n){if((n!=null)&&(n==true)){this._oScrollEnablement=new sap.ui.core.delegate.ScrollEnablement(c,c.getId()+"-wrapper",{horizontal:true,vertical:true})}this.$content=c.$();if(this.$content){this.$tempNode=jQuery("<div></div>");this.$content.before(this.$tempNode);this._$overlay=jQuery("<div id='"+jQuery.sap.uid()+"'></div>");this._$overlay.addClass("sapCaUiOverlay");this._$overlay.append(this.$content);this._oPopup.setContent(this._$overlay)}else{jQuery.sap.log.warn("Overlay: content does not exist or contains more than one child")}this._oPopup.open(200)};
sap.suite.ui.commons.ChartContainer.prototype.closeFullScreen=function(){if(this._oScrollEnablement!=null){this._oScrollEnablement.destroy();this._oScrollEnablement=null}this.$tempNode.replaceWith(this.$content);this._oPopup.close(200);this._$overlay.remove()};
sap.suite.ui.commons.ChartContainer.prototype.onAfterRendering=function(e){var t=this;if(this.getAutoAdjustHeight()){jQuery.sap.delayedCall(100,this,function(){t._performHeightChanges()})}};
sap.suite.ui.commons.ChartContainer.prototype._performHeightChanges=function(){var t=this.$();var _=t.height()-10;var a=t.find('.sapSuiteUiCommonsChartContainerToolBarArea').children()[0].clientHeight;var i=this.getSelectedChart().getContent();if(i.setHeight()){i.setHeight((_-a)+"px")}};
sap.suite.ui.commons.ChartContainer.prototype.onBeforeRendering=function(e){this._adjustDisplay(e)};
sap.suite.ui.commons.ChartContainer.prototype._onLegendButtonPress=function(e){this.setShowLegend(!this.getShowLegend())};
sap.suite.ui.commons.ChartContainer.prototype._onShowAllChartPress=function(e){this._oShowAllChartPopover.openBy(this._oShowAllChartButton)};
sap.suite.ui.commons.ChartContainer.prototype._onPhonePopoverPress=function(e){this._oPhonePopover.openBy(this._oPhonePopoverButton)};
sap.suite.ui.commons.ChartContainer.prototype._oPersonalizationPress=function(e){this.firePersonalizationPress()};
sap.suite.ui.commons.ChartContainer.prototype._switchChart=function(c){var r=null;for(var i=0;!r&&i<this._aChartIcons.length;i++){if(this._aChartIcons[i].getCustomData()[0].getValue()===c){r=this._aChartIcons[i]}}if(r){if(this._oActiveChartButton){this._oActiveChartButton.removeStyleClass("activeButton")}this._oActiveChartButton=r;this._oActiveChartButton.addStyleClass("activeButton")}var C=this._findChartById(c);this.setSelectedChart(C);if(this._oShowAllChartPopover.isOpen()){this._oShowAllChartPopover.close()}this.fireContentChange({selectedItemId:c});this.rerender()};
sap.suite.ui.commons.ChartContainer.prototype._switchFunctionPhone=function(c){var f=c.getKey();var v=c.getValue();if(f==='chartId'){this._switchChart(v)}else if(f==='function'){if(v==='legend'){this._onLegendButtonPress()}else if(v==='personalization'){this._oPersonalizationPress()}else if(v==='fullscreen'){this.toggleFullScreen()}}if(this._oPhonePopover.isOpen()){this._oPhonePopover.close()}};
sap.suite.ui.commons.ChartContainer.prototype.setTitle=function(v){this._oChartTitle.setText(v);this.setProperty("title",v)};
sap.suite.ui.commons.ChartContainer.prototype.setShowLegend=function(v){this.setProperty("showLegend",v);var c=this.getAggregation("content");if(c){for(var i=0;i<c.length;i++){var a=c[i].getContent();if(a.setVizProperties){a.setVizProperties({legend:{visible:v}});jQuery.sap.log.info("ChartContainer: propagate showLegend to chart id "+a.getId())}else{jQuery.sap.log.info("ChartContainer: chart id "+a.getId()+" is missing the setVizProperties property")}}}};
sap.suite.ui.commons.ChartContainer.prototype.addDimensionSelector=function(o){this.addAggregation("dimensionSelectors",o);this._dimSelectorsAll.push(o)};
sap.suite.ui.commons.ChartContainer.prototype.addContent=function(o){this._onAddingChart(o)};
sap.suite.ui.commons.ChartContainer.prototype.insertContent=function(o,i){this._onAddingChart(o)};
sap.suite.ui.commons.ChartContainer.prototype._onAddingChart=function(o){var i=o.getContent();if(i.setVizProperties){i.setVizProperties({legend:{visible:this.getShowLegend()}})}if(i.setWidth){i.setWidth("100%")}this.addAggregation("content",o);var b=new sap.m.Button({icon:o.getIcon(),type:sap.m.ButtonType.Transparent,tooltip:o.getTitle(),customData:[new sap.ui.core.CustomData({key:'chartId',value:i.getId()})],press:jQuery.proxy(function(e){var c=e.getSource().getCustomData()[0].getValue();this._switchChart(c)},this)});this._aChartIcons.push(b);var s=new sap.m.StandardListItem({icon:b.getIcon(),title:o.getTitle(),customData:[new sap.ui.core.CustomData({key:'chartId',value:i.getId()})]});this._oAllChartList.addItem(s);if(this.getAggregation("content").length==1){this._oAllChartList.setSelectedItem(s);this.setSelectedChart(o);this._oActiveChartButton=b}};
sap.suite.ui.commons.ChartContainer.prototype.setSelectedChart=function(o){var c=o.getContent();this._oChartTitle.setText(o.getTitle());var s=(c instanceof sap.viz.ui5.controls.VizFrame);this._oShowLegendButton.setVisible(s);this._oShowAllChartButton.setIcon(o.getIcon());this._oShowAllChartButton.setTooltip(o.getTitle());this._oSelectedChart=o};
sap.suite.ui.commons.ChartContainer.prototype.getSelectedChart=function(){return this._oSelectedChart};
sap.suite.ui.commons.ChartContainer.prototype._findChartById=function(I){var o=null;var O=this.getAggregation("content");if(O){for(var i=0;!o&&i<O.length;i++){if(O[i].getContent().getId()===I){o=O[i]}}}return o};
sap.suite.ui.commons.ChartContainer.prototype._preparePhonePopup=function(){this._oAllIconsList.removeAllItems();var I=this._oAllChartList.getItems();for(var i=0;i<I.length;i++){var c=I[i].getCustomData()[0].getValue();var s=new sap.m.StandardListItem({icon:I[i].getIcon(),title:I[i].getTitle(),customData:[new sap.ui.core.CustomData({key:'chartId',value:c})]});this._oAllIconsList.addItem(s)}if(this._oShowLegendButton.getVisible()){var p=new sap.m.StandardListItem({icon:this._oShowLegendButton.getIcon(),title:this.resBundle.getText("CHARTCONTAINER_LEGEND"),customData:[new sap.ui.core.CustomData({key:'function',value:'legend'})]});this._oAllIconsList.addItem(p)}var P=new sap.m.StandardListItem({icon:this._oPersonalizationButton.getIcon(),title:this.resBundle.getText("CHARTCONTAINER_PERSONALIZE"),customData:[new sap.ui.core.CustomData({key:'function',value:'personalization'})]});this._oAllIconsList.addItem(P);var o=new sap.m.StandardListItem({icon:this._oFullScreenButton.getIcon(),title:this.resBundle.getText("CHARTCONTAINER_FULLSCREEN"),customData:[new sap.ui.core.CustomData({key:'function',value:'fullscreen'})]});this._oAllIconsList.addItem(o)};
sap.suite.ui.commons.ChartContainer.prototype._adjustIconsDisplay=function(e){var i=sap.ui.Device.system.phone;if(!i){if(this._aChartIcons.length>3){this._oToolBar.addContent(this._oShowAllChartButton)}else{for(var c=0;c<this._aChartIcons.length;c++){this._oToolBar.addContent(this._aChartIcons[c])}}this._oToolBar.addContent(this._oShowLegendButton);if(this.getShowPersonalization()){this._oToolBar.addContent(this._oPersonalizationButton)}if(this.getShowFullScreen()){this._oToolBar.addContent(this._oFullScreenButton)}}else{this._preparePhonePopup();this._oToolBar.addContent(this._oPhonePopoverButton)}};
sap.suite.ui.commons.ChartContainer.prototype._adjustSelectorDisplay=function(e){var d=this._dimSelectorsAll;if(d.length==0){this._oViewBy.setVisible(false);this._oChartTitle.setVisible(true);this._oToolBar.addContent(this._oChartTitle)}else{this._oChartTitle.setVisible(false);if(d.length==1){this._oViewBy.setVisible(false);this._oToolBar.insertContent(d[0],0)}else{if((this._currentRangeName==='Phone')||(this._currentRangeName==='Tablet')||((this._currentRangeName==='Desktop')&&(d.length>3))){this._oViewBy.setVisible(true);this._oToolBar.addContent(this._oViewBy);this._oViewByPopover.removeAllContent();for(var i=0;i<d.length;i++){d[i].setWidth("100%");d[i].setAutoAdjustWidth(false);this._oViewByPopover.addContent(d[i])}}else{this._oViewBy.setVisible(false);for(var i=0;i<d.length;i++){d[i].setAutoAdjustWidth(true);this._oToolBar.insertContent(d[i],i)}}}}};
sap.suite.ui.commons.ChartContainer.prototype._showViewByPopover=function(e){this._oViewByPopover.openBy(this._oViewBy)};
sap.suite.ui.commons.ChartContainer.prototype._adjustDisplay=function(e){this._oToolBar.removeAllContent();this._adjustSelectorDisplay(e);this._oToolBar.addContent(new sap.m.ToolbarSpacer());this._adjustIconsDisplay(e)};
sap.suite.ui.commons.ChartContainer.prototype.setSelectorGroupLabel=function(s){this.setProperty("selectorGroupLabel",s,true);this._oViewBy.setText(s)};
sap.suite.ui.commons.ChartContainer.prototype._handleMediaChange=function(e){this._currentRangeName=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;this._adjustDisplay(e)};
sap.suite.ui.commons.ChartContainer.prototype.exit=function(){sap.ui.Device.media.detachHandler(this._handleMediaChange,this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);if(this._oFullScreenButton){this._oFullScreenButton.destroy();this._oFullScreenButton=undefined}if(this._oPopup){this._oPopup.destroy();this._oPopup=undefined}if(this._oShowLegendButton){this._oShowLegendButton.destroy();this._oShowLegendButton=undefined}if(this._oShowAllChartButton){this._oShowAllChartButton.destroy();this._oShowAllChartButton=undefined}if(this._oPhonePopoverButton){this._oPhonePopoverButton.destroy();this._oPhonePopoverButton=undefined}if(this._oPersonalizationButton){this._oPersonalizationButton.destroy();this._oPersonalizationButton=undefined}if(this._oActiveChartButton){this._oActiveChartButton.destroy();this._oActiveChartButton=undefined}if(this._oAllChartList){this._oAllChartList.destroy();this._oAllChartList=undefined}if(this._oAllIconsList){this._oAllIconsList.destroy();this._oAllIconsList=undefined}if(this._oShowAllChartPopover){this._oShowAllChartPopover.destroy();this._oShowAllChartPopover=undefined}if(this._oPhonePopover){this._oPhonePopover.destroy();this._oPhonePopover=undefined}if(this._oSelectedChart){this._oSelectedChart.destroy();this._oSelectedChart=undefined}if(this._oViewBy){this._oViewBy.destroy();this._oViewBy=undefined}if(this._oViewByPopover){this._oViewByPopover.destroy();this._oViewByPopover=undefined}if(this._oToolBar){this._oToolBar.destroy();this._oToolBar=undefined}};
