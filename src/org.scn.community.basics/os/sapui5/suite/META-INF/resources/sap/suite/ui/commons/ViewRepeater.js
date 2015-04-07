/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.ViewRepeater");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.commons.RowRepeater");sap.ui.commons.RowRepeater.extend("sap.suite.ui.commons.ViewRepeater",{metadata:{library:"sap.suite.ui.commons",properties:{"itemMinWidth":{type:"int",group:"Misc",defaultValue:null},"responsive":{type:"boolean",group:"Misc",defaultValue:false},"defaultViewIndex":{type:"int",group:"Misc",defaultValue:0},"showSearchField":{type:"boolean",group:"Misc",defaultValue:true},"showViews":{type:"boolean",group:"Misc",defaultValue:true},"external":{type:"boolean",group:"Misc",defaultValue:false},"itemHeight":{type:"int",group:"Misc",defaultValue:null},"height":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:'100%'}},aggregations:{"views":{type:"sap.suite.ui.commons.RepeaterViewConfiguration",multiple:true,singularName:"view"}},associations:{"externalRepresentation":{type:"sap.ui.core.Control",multiple:false}},events:{"search":{},"changeView":{}}}});sap.suite.ui.commons.ViewRepeater.M_EVENTS={'search':'search','changeView':'changeView'};
sap.suite.ui.commons.ViewRepeater.prototype.init=function(){var t=this;this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this.addStyleClass("suiteUiVr");sap.ui.commons.RowRepeater.prototype.init.call(this);this._oSegBtn=new sap.ui.commons.SegmentedButton({id:this.getId()+"-segBtn"});this._repopulateViewSelector();this._oSearchField=new sap.ui.commons.SearchField({id:this.getId()+"-searchFld",enableFilterMode:true,enableListSuggest:false,search:function(e){t.fireSearch({query:e.getParameter("query")})}});this.attachFilter(function(e){this._currentFilterId=e.getParameter("filterId")});this.attachSort(function(e){this._currentSorterId=e.getParameter("sorterId")})};
sap.suite.ui.commons.ViewRepeater.prototype.setDefaultViewIndex=function(v){this.setProperty("defaultViewIndex",v);this._selectDefaultView();return this};
sap.suite.ui.commons.ViewRepeater.prototype._selectDefaultView=function(){var v=this.getDefaultViewIndex();if(v===this._currentViewIndex)return;var V=this.getViews()||[];if(V.length>0){if(v>=V.length)v=V.length-1;this.selectView(v);var d=this.getId()+"-"+V[v].getId()+"-triggerBtn";this._oSegBtn.setSelectedButton(d)}};
sap.suite.ui.commons.ViewRepeater.prototype._repopulateViewSelector=function(){var t=this;var r=t._oSegBtn.removeAllAggregation("buttons",true);jQuery.each(r,function(i,b){b.destroy()});var v=this.getViews()||[];for(var i=0;i<v.length;i++){var V=v[i];if(V.getExternal()===true){var e=V.getExternalRepresentation();if(!e.getModel()){e.setModel(this.getModel())}}var o=new sap.ui.commons.Button({id:this.getId()+"-"+V.getId()+"-triggerBtn",text:V.getTitle()||(V.getIcon()?undefined:this._rb.getText("VIEWREPEATER_TAB_DEFAULT_NAME",[(i+1)])),icon:V.getIcon(),iconHovered:V.getIconHovered(),iconSelected:V.getIconSelected(),tooltip:V.getTooltip(),lite:true});t._oSegBtn.addButton(o);o.attachPress(V,function(a,b){t.selectView(b);t._oSegBtn.rerender()})}this._selectDefaultView()};
sap.suite.ui.commons.ViewRepeater.prototype.setModel=function(m,n){sap.ui.base.ManagedObject.prototype.setModel.call(this,m,n);this._repopulateViewSelector();return this};
sap.suite.ui.commons.ViewRepeater.prototype.addView=function(r){this.addAggregation("views",r);this._repopulateViewSelector();return this};
sap.suite.ui.commons.ViewRepeater.prototype.removeAllViews=function(){var r=this.removeAllAggregation("views");this._repopulateViewSelector();return r};
sap.suite.ui.commons.ViewRepeater.prototype.insertView=function(v,i){this.insertAggregation("views",v,i);this._repopulateViewSelector();return this};
sap.suite.ui.commons.ViewRepeater.prototype.removeView=function(v){var r=this.removeAggregation("views",v);this._repopulateViewSelector();return r};
sap.suite.ui.commons.ViewRepeater.prototype.selectView=function(v){var V,a=0;switch(typeof v){case"number":{V=this.getViews()[v];a=v;break}case"object":{var b=this.getViews().length;for(var i=0;i<b;i++){if(v.getId()===this.getViews()[i].getId()){V=v;a=i;break}}}}if(!V){return}var r=V.getResponsive();if(typeof r=="boolean"){this.setResponsive(r)}var I=V.getItemMinWidth();if(typeof I=="number"&&I>0&&I!=this.setItemMinWidth()){this.setItemMinWidth(I)}var c=V.getItemHeight();if(c!=this.getItemHeight()&&c>0){this.setItemHeight(c)}if(V.getNumberOfTiles()>0&&V.getNumberOfTiles()!=this.setNumberOfRows()){this.setNumberOfRows(V.getNumberOfTiles())}var e=V.getExternal();if(e===true){this.setExternal(true);this.setExternalRepresentation(V.getExternalRepresentation())}else{this.setExternal(false);this.setExternalRepresentation(null)}var C=this.getCurrentPage();var p=V.getPath();var t=V.getTemplate();if(p&&t){this.bindRows(p,t);this._applyFilter(this._currentFilterId);this._applySorter(this._currentSorterId)}if(this._currentViewIndex||a!=this._currentViewIndex){this.fireChangeView({newViewIndex:a,oldViewIndex:this._currentViewIndex,filterId:this._currentFilterId,sorterId:this._currentSorterId,page:C})}this._currentViewIndex=a;this._oView=V};
sap.suite.ui.commons.ViewRepeater.prototype._applyFilter=function(f,l){if(f){if(!l){l=this.getBinding("rows")}var F=this.getFilters();var i=F.length;for(var n=0;n<i;n++){if(F[n].getId()===f){var o=F[n];break}}if(o){l.filter(o.getFilters())}}};
sap.suite.ui.commons.ViewRepeater.prototype._applySorter=function(s,l){if(s){if(!l){l=this.getBinding("rows")}var S=this.getSorters();var i=S.length;for(var n=0;n<i;n++){if(S[n].getId()===s){var o=S[n];break}}if(o){l.sort(o.getSorter())}}};
sap.suite.ui.commons.ViewRepeater.prototype.onBeforeRendering=function(){if(this.getResponsive()&&this.getShowMoreSteps()==0){if(!this._bInit){this.setNumberOfRows(0)}}else if(this._oView&&this._oView.getNumberOfTiles()>0&&this._oView.getNumberOfTiles()!=this.getNumberOfRows()&&!this.getResponsive()){this.setNumberOfRows(this._oView.getNumberOfTiles())}this._bInit=false};
sap.suite.ui.commons.ViewRepeater.prototype._updateBodyPosition=function(){var v=jQuery("#"+this.getId()+">div.suiteUiVrViewSwHolder").outerHeight();var p=jQuery("#"+this.getId()+">div.sapUiRrPtb").outerHeight();var s=jQuery("#"+this.getId()+">div.sapUiRrStb").outerHeight();var f=jQuery("#"+this.getId()+">div.sapUiRrFtr").outerHeight();var b=jQuery.sap.byId(this.getId()+"-body");b.css("top",v+p+s+3);b.css("bottom",f)};
sap.suite.ui.commons.ViewRepeater.prototype.onAfterRendering=function(){this._computeWidths(true);sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);if(this.getResponsive()){if(this.getShowMoreSteps()==0){jQuery("#"+this.getId()+">div.sapUiRrFtr").hide()}jQuery.sap.delayedCall(100,this,function(){this._sResizeListenerId=sap.ui.core.ResizeHandler.register(jQuery.sap.domById(this.getId()+"-body"),jQuery.proxy(this._handleResize,this));if(this.getShowMoreSteps()==0){this._updateBodyPosition()}})}};
sap.suite.ui.commons.ViewRepeater.prototype._handleResize=function(){if(!this.getDomRef()){return}this._computeWidths();if(this.getResponsive()&&this.getShowMoreSteps()==0){var b=jQuery.sap.byId(this.getId()+"-body");var B=b.height();var n=this._itemsPerRow;var N=Math.floor(B/(this.getItemHeight()+3));var i=N*n;if(i!=this.getNumberOfRows()){this._bInit=true;this.setNumberOfRows(i)}else{jQuery("#"+this.getId()+">div.sapUiRrFtr").show()}}};
sap.suite.ui.commons.ViewRepeater.prototype._computeWidths=function(i){var t=this;var T=this.$();var I=t.getItemMinWidth();var n=(this.getResponsive()===true)?Math.floor(T.width()/I):1;var p=Math.floor(100/n);if(T.width()*p/100<I){n--;p=Math.floor(100/n)}if(i||t._height!=T.height()||t._itemsPerRow!=n){jQuery("#"+this.getId()+" .sapUiRrBody").css("width","100%");var o=100-(n*p);var w;jQuery("#"+this.getId()+" .sapUiRrBody li").each(function(a){w=p;if(a%n<o)w++;jQuery(this).css("width",w+"%");jQuery(this).css("margin","0")});t._height=T.height();t._itemsPerRow=n;t._percentWidth=p}};
sap.suite.ui.commons.ViewRepeater.prototype.startPagingAnimation=function(){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);var c=sap.ui.getCore(),r=c.getRenderManager(),I=this.getId(),p=this.iPreviousPage,P=this.getCurrentPage(),N=this.getNumberOfRows(),s=(P-1)*N,R=this.getRows(),C=this._getRowCount()>N*P?N:this._getRowCount()-N*(P-1),l=Math.ceil(this._getRowCount()/N),n,i,w,b=this.getBinding("rows");var d,j=jQuery(jQuery.sap.domById(I+"-page_"+p)),D=jQuery.sap.domById(I+"-body"),J=jQuery(D);J.css("height",J.outerHeight());var a;if(sap.ui.getCore()&&sap.ui.getCore().getConfiguration()&&sap.ui.getCore().getConfiguration().getRTL()){a=(P<p)?"left":"right"}else{a=(P<p)?"right":"left"}if(b){this._bSecondPage=!this._bSecondPage;this.updateRows(true);R=this.getRows();s=(this._bSecondPage?1:0)*N}var S="\"top:-"+j.outerHeight(true)+"px;"+a+":"+j.outerWidth(true)+"px;\"";jQuery("<ul id=\""+I+"-page_"+P+"\" class=\"sapUiRrPage\" style="+S+"/>").appendTo(D);var o=D.lastChild;var e=jQuery(o);var O=100-(this._itemsPerRow*this._percentWidth);for(n=s,i=0;n<s+C;n++,i++){w=this._percentWidth;if(i%this._itemsPerRow<O)w++;jQuery("<li id=\""+I+"-row_"+n+"\" style=\"width:"+w+"%\" class=\"sapUiRrRow\"/>").appendTo(o);d=o.lastChild;r.render(R[n],d)}if(a==="right"){j.animate({right:-j.outerWidth(true)},"slow");e.animate({right:0},"slow")}else{j.animate({left:-j.outerWidth(true)},"slow");e.animate({left:0},"slow")}J.animate({height:e.outerHeight(true)},"slow",jQuery.proxy(this.endPagingAnimation,this))};
sap.suite.ui.commons.ViewRepeater.prototype.endPagingAnimation=function(){sap.ui.commons.RowRepeater.prototype.endPagingAnimation.call(this);this._sResizeListenerId=sap.ui.core.ResizeHandler.register(jQuery.sap.domById(this.getId()+"-body"),jQuery.proxy(this._handleResize,this))};
sap.suite.ui.commons.ViewRepeater.prototype.exit=function(){this._oSegBtn.destroy();this._oSearchField.destroy();sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId)};
