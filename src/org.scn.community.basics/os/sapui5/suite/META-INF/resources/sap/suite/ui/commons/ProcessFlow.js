/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.ProcessFlow");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.ProcessFlow",{metadata:{publicMethods:["getZoomLevel","setZoomLevel","zoomIn","zoomOut","updateModel","getFocusedNode"],library:"sap.suite.ui.commons",properties:{"foldedCorners":{type:"boolean",group:"Misc",defaultValue:false},"scrollable":{type:"boolean",group:"Misc",defaultValue:true},"wheelZoomable":{type:"boolean",group:"Behavior",defaultValue:true}},aggregations:{"connections":{type:"sap.suite.ui.commons.ProcessFlowConnection",multiple:true,singularName:"connection",visibility:"hidden"},"nodes":{type:"sap.suite.ui.commons.ProcessFlowNode",multiple:true,singularName:"node"},"lanes":{type:"sap.suite.ui.commons.ProcessFlowLaneHeader",multiple:true,singularName:"lane"}},events:{"nodeTitlePress":{},"nodePress":{},"headerPress":{},"onError":{}}}});sap.suite.ui.commons.ProcessFlow.M_EVENTS={'nodeTitlePress':'nodeTitlePress','nodePress':'nodePress','headerPress':'headerPress','onError':'onError'};sap.suite.ui.commons.ProcessFlow.prototype._resBundle=null;sap.suite.ui.commons.ProcessFlow.prototype._zoomLevel=sap.suite.ui.commons.ProcessFlowZoomLevel.Two;sap.suite.ui.commons.ProcessFlow.prototype._wheelTimeout=null;sap.suite.ui.commons.ProcessFlow.prototype._wheelTimestamp=null;sap.suite.ui.commons.ProcessFlow.prototype._wheelCalled=false;sap.suite.ui.commons.ProcessFlow.prototype._internalCalcMatrix=false;sap.suite.ui.commons.ProcessFlow.prototype._internalLanes=false;sap.suite.ui.commons.ProcessFlow.prototype._jumpOverElements=5;sap.suite.ui.commons.ProcessFlow.prototype._lastNavigationFocusNode=false;
sap.suite.ui.commons.ProcessFlow.prototype.init=function(){if((sap.ui.Device.os.android||sap.ui.Device.os.blackberry||sap.ui.Device.os.ios||sap.ui.Device.os.windows_phone)&&sap.ui.Device.system.phone){this.setZoomLevel(sap.suite.ui.commons.ProcessFlowZoomLevel.Four)}if(!this._resBundle){this._resBundle=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons")}this._internalLanes=this.getLanes();this.$().on('keydown',jQuery.proxy(this.onkeydown,this))};
sap.suite.ui.commons.ProcessFlow.prototype.exit=function(){if(this.getNodes()){for(var i=0;i<this.getNodes().length;i++){this.getNodes()[i].destroy()}}if(this._internalLanes){for(var i=0;i<this._internalLanes.length;i++){this._internalLanes[i].destroy()}}var a=this.getAggregation("connections");if(a){for(var i=0;i<a.length;i++){a[i].destroy()}}if(this._resizeRegId){sap.ui.core.ResizeHandler.deregister(this._resizeRegId)}if(this._internalCalcMatrix){delete this._internalCalcMatrix}};
sap.suite.ui.commons.ProcessFlow.prototype._handleException=function(e){var t=this._resBundle.getText('PF_ERROR_INPUT_DATA');this.fireOnError({text:t});jQuery.sap.log.error("Error loading data for the process flow with id : "+this.getId());if(e instanceof Array){for(var i=0;i<e.length;i++){jQuery.sap.log.error("Detailed description ("+i+") :"+e[i])}}else{jQuery.sap.log.error("Detailed description  :"+e)}};
sap.suite.ui.commons.ProcessFlow.prototype._updateLanesFromNodes=function(){sap.suite.ui.commons.ProcessFlow.NodeElement.createNodeElementsFromProcessFlowNodes(this.getNodes(),this.getLanes());this._internalLanes=sap.suite.ui.commons.ProcessFlow.NodeElement.updateLanesFromNodes(this.getLanes(),this.getNodes()).lanes};
sap.suite.ui.commons.ProcessFlow.prototype._getOrCreateLaneMap=function(){if(!this._internalLanes||this._internalLanes.length<=0){this._updateLanesFromNodes()}var m=sap.suite.ui.commons.ProcessFlow.NodeElement.createMapFromLanes(this._internalLanes,jQuery.proxy(this.ontouchend,this),this._isHeaderMode()).positionMap;return m};
sap.suite.ui.commons.ProcessFlow.prototype._getOrCreateProcessFlow=function(){if(!this._internalLanes||this._internalLanes.length<=0){this._updateLanesFromNodes()}this.applyNodeDisplayState();var a=this.getNodes();var r=sap.suite.ui.commons.ProcessFlow.NodeElement.createNodeElementsFromProcessFlowNodes(a,this._internalLanes);var e=r.elementForId;var b=r.elementsForLane;sap.suite.ui.commons.ProcessFlow.NodeElement.calculateLaneStatePieChart(b,this._internalLanes,a,this);var c=sap.suite.ui.commons.ProcessFlow.prototype.calculateMatrix(e);c=this.addFirstAndLastColumn(c);for(var i=0;i<c.length;i++){for(var j=0;j<c[i].length;j++){if(c[i][j]instanceof sap.suite.ui.commons.ProcessFlow.NodeElement){c[i][j]=e[c[i][j].nodeid].oNode}}}this._internalCalcMatrix=c;return c};
sap.suite.ui.commons.ProcessFlow.prototype.applyNodeDisplayState=function(){var I=this.getNodes(),n=I?I.length:0,i=0;if(n===0){return}else{while(i<n){I[i]._setRegularState();i++}i=0;while((i<n)&&!I[i].getHighlighted()){i++}if(i<n){i=0;while(i<n){if(!I[i].getHighlighted()){I[i]._setDimmedState()}i++}}}};
sap.suite.ui.commons.ProcessFlow.prototype.addFirstAndLastColumn=function(c){if(!c||c.length<=0){return[]}var o=c.length;for(var i=0;i<o;i++){c[i].unshift(null);c[i].push(null)}return c};
sap.suite.ui.commons.ProcessFlow.prototype.calculateMatrix=function(e){var a,E,s,h,r,b,R;if(!e||(e.length===0)){return[]}a=new sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation(this);R=a.checkInputNodeConsistency(e);E=a.retrieveInfoFromInputArray(e);a.resetPositions();s=a.sortRootElements(E.rootElements);h=E.highestLanePosition+1;r=Object.keys(e).length>3?Object.keys(e).length-1:2;b=a.createMatrix(r,h);for(var i=0;i<s.length;i++){a.posy=s[i].lane;b=a.processCurrentElement(s[i],e,b)}if(R&&b[0][0]&&b[0][0].oNode.setFocused){Object.keys(e).forEach(function(c){var o=e[c];o.oNode.setFocused(false)});b[0][0].oNode.setFocused(true)}b=a.doubleColumnsInMatrix(b);b=a.calculatePathInMatrix(b);b=a.removeEmptyLines(b);return b};
sap.suite.ui.commons.ProcessFlow.NodeElement=function(i,l,n,N){this.nodeid=i;this.lane=l;this.state=n.getState();this.displayState=n._getDisplayState();this.isProcessed=false;if(jQuery.isArray(N)){this.arrayParent=N}else{this.singleParent=N}this.oNode=n};
sap.suite.ui.commons.ProcessFlow.NodeElement.prototype={toString:function(){return this.nodeid},containsChildren:function(t){if(!t){return false}if(!(t instanceof sap.suite.ui.commons.ProcessFlow.NodeElement)){return false}if(this.oNode.getChildren()&&t.oNode.getChildren()&&this.oNode.getChildren().length&&t.oNode.getChildren().length){for(var i=0;i<this.oNode.getChildren().length;i++){if(t.oNode.getChildren().indexOf(this.oNode.getChildren()[i])>=0){return true}}}return false}};
sap.suite.ui.commons.ProcessFlow.NodeElement.initNodeElement=function(i,l,n,N){return new sap.suite.ui.commons.ProcessFlow.NodeElement(i,l,n,N)};
sap.suite.ui.commons.ProcessFlow.NodeElement.calculateLaneStatePieChart=function(e,l,a,p){if(!e||!l||!a){return}for(var i=0;i<a.length;i++){p._bHighlightedMode=a[i].getHighlighted();if(p._bHighlightedMode){break}}var b=0;var n=0;var c=0;var d=0;for(var i=0;i<l.length;i++){var f=l[i];var g=e[f.getLaneId()];if(!g){continue}b=0;n=0;c=0;d=0;for(var j=0;j<g.length;j++){if(!p._bHighlightedMode||(g[j].oNode._getDisplayState()==sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted||g[j].oNode._getDisplayState()==sap.suite.ui.commons.ProcessFlowDisplayState.HighlightedFocused)){switch(g[j].oNode.getState()){case sap.suite.ui.commons.ProcessFlowNodeState.Positive:b++;break;case sap.suite.ui.commons.ProcessFlowNodeState.Negative:n++;break;case sap.suite.ui.commons.ProcessFlowNodeState.Planned:d++;break;case sap.suite.ui.commons.ProcessFlowNodeState.Neutral:c++;break}}};var s=[{state:sap.suite.ui.commons.ProcessFlowNodeState.Positive,value:b},{state:sap.suite.ui.commons.ProcessFlowNodeState.Negative,value:n},{state:sap.suite.ui.commons.ProcessFlowNodeState.Neutral,value:d},{state:sap.suite.ui.commons.ProcessFlowNodeState.Planned,value:c}];f.setState(s)}};
sap.suite.ui.commons.ProcessFlow.NodeElement.updateLanesFromNodes=function(p,I){var c=sap.suite.ui.commons.ProcessFlow.NodeElement.createMapFromLanes(p,null,false);var m=c.positionMap;var a=c.idMap;var n={};var t=p.slice();var P;var b={};var d=0;for(var i=0;i<I.length;i++){n[I[i].getNodeId()]=I[i]}for(var i=0;i<I.length;i++){var e=I[i];var f=e.getChildren()||[];var g=1;var h=null;var k=null;for(var j=0;j<f.length;j++){var l=n[f[j]];if(l&&(e.getLaneId()==l.getLaneId())){h=l.getLaneId()+g;k=a[h];if(!k){var o=a[e.getLaneId()];k=sap.suite.ui.commons.ProcessFlow.NodeElement.createNewProcessFlowElement(o,h,o.getPosition()+g);a[k.getLaneId()]=k;t.splice(k.getPosition(),0,k)}l.setLaneId(k.getLaneId())}sap.suite.ui.commons.ProcessFlow.NodeElement.changeLaneOfChildren(e.getLaneId(),l,n)}if(k){b={};P=false;for(var q in m){if(k.getLaneId()==m[q].getLaneId()){P=true;break};if(parseInt(q)>=k.getPosition()){var r=m[q];b[r.getPosition()+g]=r}}if(!P){for(var w in b){d=parseInt(w);b[d].setPosition(d)}b[k.getPosition()]=k;for(var v=0;v<k.getPosition();v++){b[v]=m[v]}m=b}}};return{lanes:t,nodes:I}};
sap.suite.ui.commons.ProcessFlow.NodeElement.changeLaneOfChildren=function(o,c,n){var a=c.getChildren();if(a){for(var i=0;i<a.length;i++){var b=n[a[i]];if(b.getLaneId()==o){b.setLaneId(c.getLaneId());sap.suite.ui.commons.ProcessFlow.NodeElement.changeLaneOfChildren(o,b,n)}}}};
sap.suite.ui.commons.ProcessFlow.NodeElement.createNewProcessFlowElement=function(o,n,a){var c=new sap.suite.ui.commons.ProcessFlowLaneHeader({laneId:n,iconSrc:o.getIconSrc(),text:o.getText(),state:o.getState(),position:a,zoomLevel:o.getZoomLevel()});return c};
sap.suite.ui.commons.ProcessFlow.NodeElement.createMapFromLanes=function(p,t,h){var l,m={},M={},n=p?p.length:0,i=0;if(!n){return{}}else{while(i<n){l=p[i];if(l instanceof sap.suite.ui.commons.ProcessFlowLaneHeader){m[l.getPosition()]=l;M[l.getLaneId()]=l;if(t){l.attachPress(t)}l._setHeaderMode(h)}i++}return{positionMap:m,idMap:M}}};
sap.suite.ui.commons.ProcessFlow.NodeElement.createNodeElementsFromProcessFlowNodes=function(p,a){var P={},e={},b={},n,N=p?p.length:0,s,l,L=a?a.length:0,c,d=[],f,C,g,h,i,j,E={};if(N===0){return{elementForId:{},elementsForLane:{}}}if(L===0){throw["No lane definition although there is a node definition."]}i=0;while(i<L){l=a[i];c=l.getLaneId();f=l.getPosition();if(P[c]){throw["The lane with id: "+c+" is defined at least twice. (Lane error)"]}P[c]=f;if(jQuery.inArray(f,d)>-1){throw["The position "+f+" is defined at least twice. (Lane error)."]}else{d.push(f)}e[c]=[];i++}i=0;while(i<N){n=p[i];if(n instanceof sap.suite.ui.commons.ProcessFlowNode){s=n.getNodeId();c=n.getLaneId();C=n.getChildren()||[];h=C.length;j=0;while(j<h){g=C[j];b[g]=b[g]||[];b[g].push(s);j++}}i++}i=0;while(i<N){n=p[i];if(n instanceof sap.suite.ui.commons.ProcessFlowNode){s=n.getNodeId();if(!s){throw["There is a node which has no node id defined. (Title="+n.getTitle()+") and array position: "+i]}c=n.getLaneId();f=P[c];if(typeof f!=='number'){throw["For the node "+s+" position (lane) is not defined."]}if(!E[s]){E[s]=sap.suite.ui.commons.ProcessFlow.NodeElement.initNodeElement(s,f,n,b[s]);e[c].push(E[s])}else{throw["The node id "+s+" is used second time."]}}i++}return{elementForId:E,elementsForLane:e}};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation=function(p){this.parentControl=p;this.posx=0;this.posy=0;this.nodePositions={};this.mapChildToNode={}};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.checkInputNodeConsistency=function(e){var r=[],j,c,n,C,E,a=0;Object.keys(e).forEach(function(s){E=e[s];C=E.oNode.getChildren();n=C?C.length:0;if(E.oNode.getFocused()){a++}j=0;while(j<n){c=C[j];if(!e[c]){r.push("Node identificator "+c+" used in children definition is not presented as the node itself. Element : "+E.nodeid)}j++}});if(r.length>0){throw r}return a>1};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.resetPositions=function(){this.posx=0;this.posy=0;delete this.nodePositions;delete this.mapChildToNode;this.nodePositions={};this.mapChildToNode={}};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.createMatrix=function(l){l=parseInt(l,10);var a=new Array(l||0);var i=l;if(arguments.length>1){var b=Array.prototype.slice.call(arguments,1);while(i--){a[l-1-i]=this.createMatrix.apply(this,b)}}return a};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.retrieveInfoFromInputArray=function(e){var h=0,r=[],E;Object.keys(e).forEach(function(s){E=e[s];if(!E.singleParent&&!E.arrayParent){r.push(E)}if(h<E.lane){h=E.lane}});return{'highestLanePosition':h,'rootElements':r}};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.doubleColumnsInMatrix=function(c){var m=0;for(var i=0;i<c.length;i++){m=m>c[i].length?m:c[i].length}var d=new Array(c.length||0);for(var i=0;i<d.length;i++){d[i]=new Array(m*2-1);for(var j=0;j<m;j++){if(c[i][j]){d[i][2*j]=c[i][j]}}}return d};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.removeEmptyLines=function(o){var n=0;for(var i=0;i<o.length;i++){for(var j=0;j<o[i].length;j++){if(o[i][j]){n++;break}}}var r=this.createMatrix(n,o[0].length);for(var i=0;i<n;i++){for(var j=0;j<o[i].length;j++){r[i][j]=null;if(o[i][j]){r[i][j]=o[i][j]}}}return r};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.processCurrentElement=function(c,e,r){var E,a,t=this,m=true;if(c.isProcessed){return r}this.nodePositions[c.nodeid]={'c':c,'x':this.posx,'y':this.posy*2};r[this.posx][this.posy++]=c;E=c.oNode.getChildren();c.isProcessed=true;a=this.sortBasedOnChildren(E,e);if(a){a.forEach(function(C){if(!C.isProcessed){m=false;while(t.posy<C.lane){r[t.posx][t.posy++]=null}r=t.processCurrentElement(C,e,r)}})}if(!E||m){this.posx++;this.posy=0}return r};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.sortRootElements=function(r){return r};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.sortBasedOnChildren=function(e,c){var E={},d,l=null,L,n,N,f=[],s,S,p;if(e){e.forEach(function(C){d=E[c[C].lane];if(!d){E[c[C].lane]=d=[]}d.push(c[C])})}else{return[]}L=new Array();for(l in E){L.push(l);E[l].sort(function(a,b){c[a].oNode.getChildren();n=(a.oNode.getChildren()||[]).length;N=(b.oNode.getChildren()||[]).length;return N-n})}L=L.sort(function(a,b){return b-a});L.forEach(function(l){s=E[l];if(s.length>1){S=[];p=s.shift();while(p){if(S.indexOf(p)<0){S.push(p)}s.forEach(function(o){if(p.containsChildren(o)){S.push(o)}});p=s.shift()}f=f.concat(S)}else{f=f.concat(s)}});return f};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.calculatePathInMatrix=function(o){var c=null;for(var k in this.nodePositions){if(this.nodePositions.hasOwnProperty(k)){c=this.nodePositions[k];var a=c.c.oNode.getChildren();for(var i=0;a&&i<a.length;i++){var p=this.nodePositions[a[i]];o=this.calculateSingleNodeConnection(c,p,c.x,c.y,p.x,p.y,o)}}}return o};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.calculateSingleNodeConnection=function(n,a,p,b,c,d,o){var h=d-b;var v=c-p;if(h<0){var e=["Problem with negative horizontal movement","Parent node is "+n.c.toString(),"Children node is "+a.c.toString(),"Coordinates : '"+p+"','"+b+"','"+c+"','"+d+"'"];throw e}else if(v<-1){var N=this.checkIfHorizontalLinePossible(o,c,b+2,d);var y=d-1;if(N){y=b+1}var x=p;if(N){x=c}o[p][y]=this.createConnectionElement(o[p][y],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.LU,n,a,false);o=this.writeVerticalLine(o,p,c,y,n,a);o[c][y]=this.createConnectionElement(o[c][y],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.UR,n,a,(y==d-1));var s=b+2;var f=d;if(!N){s=b+1;f=y+1}o=this.writeHorizontalLine(o,x,s,f,n,a)}else if(v==-1){o[p][b+1]=this.createConnectionElement(o[p][b+1],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.LU,n,a,false);o[c][b+1]=this.createConnectionElement(o[c][b+1],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.UR,n,a,false);o=this.writeHorizontalLine(o,c,b+2,d,n,a)}else if(v===0){o=this.writeHorizontalLine(o,p,b+1,d,n,a)}else if(v===1){o[p][b+1]=this.createConnectionElement(o[p][b+1],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.LD,n,a,false);o[c][b+1]=this.createConnectionElement(o[c][b+1],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.DR,n,a,(b+1)==(d-1));o=this.writeHorizontalLine(o,c,b+2,d,n,a)}else{o[p][b+1]=this.createConnectionElement(o[p][b+1],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.LD,n,a,false);o=this.writeVerticalLine(o,c,p,b+1,n,a);o[c][b+1]=this.createConnectionElement(o[c][b+1],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.DR,n,a,(b+1)==(d-1));o=this.writeHorizontalLine(o,c,b+2,d,n,a)}return o};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.writeVerticalLine=function(o,f,l,c,n,a){for(var j=f-1;j>l;j--){o[j][c]=this.createConnectionElement(o[j][c],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.DU,n,a,false)}return o};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.checkIfHorizontalLinePossible=function(o,r,f,l){var L=true;for(var i=f;i<l;i++){if(o[r][i]instanceof sap.suite.ui.commons.ProcessFlow.NodeElement){L=false;break}};return L};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.writeHorizontalLine=function(o,r,f,l,n,a){var p=(r==a.x);if(!p){l--}for(var i=f;i<l;i++){o[r][i]=this.createConnectionElement(o[r][i],sap.suite.ui.commons.ProcessFlow.cellEdgeConstants.LR,n,a,(i==(l-1))&&p)}return o};
sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation.prototype.createConnectionElement=function(o,a,i,t,A){var b=o;if(!b){b=new sap.suite.ui.commons.ProcessFlowConnection({})}var d=sap.suite.ui.commons.ProcessFlowDisplayState.Regular;if((t.c.displayState==sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted||t.c.displayState==sap.suite.ui.commons.ProcessFlowDisplayState.HighlightedFocused)&&(i.c.displayState==sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted||i.c.displayState==sap.suite.ui.commons.ProcessFlowDisplayState.HighlightedFocused)){d=sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted}else if(t.c.displayState==sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed||t.c.displayState==sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused||i.c.displayState==sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed||i.c.displayState==sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused){d=sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed}var c={flowLine:a,targetNodeState:t.c.state,displayState:d,hasArrow:A};b.addConnectionData(c);return b};
sap.suite.ui.commons.ProcessFlow.cellEdgeConstants={'LU':'tl','LD':'lb','DU':'tb','LR':'rl','DR':'rt','UR':'rb'};
String.prototype.contains=function(i){return this.indexOf(i)!=-1};
sap.suite.ui.commons.ProcessFlow.prototype.addNode=function(a){return this.addAggregation("nodes",a,false)};
sap.suite.ui.commons.ProcessFlow.prototype.setZoomLevel=function(z){if(!(z in sap.suite.ui.commons.ProcessFlowZoomLevel)){this._handleException("\""+z+"\" is not a valid entry of the enumeration for property zoom level of ProcessFlow");return}this._zoomLevel=z;this.rerender()};
sap.suite.ui.commons.ProcessFlow.prototype.getZoomLevel=function(){return this._zoomLevel};
sap.suite.ui.commons.ProcessFlow.prototype.zoomIn=function(){var c=this.getZoomLevel();var n=c;switch(c){case(sap.suite.ui.commons.ProcessFlowZoomLevel.One):n=sap.suite.ui.commons.ProcessFlowZoomLevel.Two;break;case(sap.suite.ui.commons.ProcessFlowZoomLevel.Two):n=sap.suite.ui.commons.ProcessFlowZoomLevel.Three;break;case(sap.suite.ui.commons.ProcessFlowZoomLevel.Three):n=sap.suite.ui.commons.ProcessFlowZoomLevel.Four;break};this.setZoomLevel(n);return this.getZoomLevel()};
sap.suite.ui.commons.ProcessFlow.prototype.zoomOut=function(){var c=this.getZoomLevel();var n=c;switch(c){case(sap.suite.ui.commons.ProcessFlowZoomLevel.Four):n=sap.suite.ui.commons.ProcessFlowZoomLevel.Three;break;case(sap.suite.ui.commons.ProcessFlowZoomLevel.Three):n=sap.suite.ui.commons.ProcessFlowZoomLevel.Two;break;case(sap.suite.ui.commons.ProcessFlowZoomLevel.Two):n=sap.suite.ui.commons.ProcessFlowZoomLevel.One;break};this.setZoomLevel(n);return this.getZoomLevel()};
sap.suite.ui.commons.ProcessFlow.prototype.updateModel=function(){var n=this.getBindingInfo("nodes");if(!n){this._handleException("The node model is not bound.");return}this.getModel(n.model).refresh();this.rerender()};
sap.suite.ui.commons.ProcessFlow.prototype.ontouchend=function(e){if(!sap.ui.Device.support.touch&&!jQuery.sap.simulateMobileOnDesktop){this.onAfterRendering()}if(e===null||e.oSource===undefined){return false}e.preventDefault();if(this&&this._isHeaderMode()){this._internalLanes=[];this.fireHeaderPress(this)}return false};
sap.suite.ui.commons.ProcessFlow.prototype._isHeaderMode=function(){var n=this.getNodes();return!n||(n.length==0)};
sap.suite.ui.commons.ProcessFlow.prototype._switchCursors=function($,c,C){if($.hasClass(c)){$.removeClass(c)}if(!$.hasClass(C)){$.addClass(C)}};
sap.suite.ui.commons.ProcessFlow.prototype._clearHandlers=function($){var m='contextmenu dblclick';$.on(m,function(e){if(e&&!e.isDefaultPrevented()){e.preventDefault()}if(e&&!e.isPropagationStopped()){e.stopPropagation()}if(e&&!e.isImmediatePropagationStopped()){e.stopImmediatePropagation()}})};
sap.suite.ui.commons.ProcessFlow.prototype.onAfterRendering=function(){var $=this.$(),m=false,s=false,n=0,a=0,b=this.$("scroll-content"),h,w,S,i,g,G,d,t=this;if(b&&b.length){this.$().find('.sapSuiteUiCommonsProcessFlowNode .sapUiIcon').css("cursor","inherit");d="sapSuiteUiDefaultCursorPF";if(sap.ui.Device.browser.msie){g="sapSuiteUiGrabCursorIEPF";G="sapSuiteUiGrabbingCursorIEPF"}else{g="sapSuiteUiGrabCursorPF";G="sapSuiteUiGrabbingCursorPF"}if(this.getScrollable()){h=parseInt($.css("height").slice(0,-2),10);w=parseInt($.css("width").slice(0,-2),10);i=b[0].scrollHeight;S=b[0].scrollWidth;if(i<=h&&S<=w){this._clearHandlers($);this._switchCursors($,g,d)}else{this._switchCursors($,d,g);s=true}}else{this._clearHandlers($);this._switchCursors($,g,d);$.css("overflow","visible");b.css("position","static")}if(s){if(!sap.ui.Device.support.touch&&!jQuery.sap.simulateMobileOnDesktop){var M='contextmenu mousemove mouseleave mousedown mouseup';$.on(M,jQuery.proxy(function(e){if(e&&!e.isDefaultPrevented()){e.preventDefault()}switch(e.type){case'mousemove':if(m){if(sap.ui.getCore().getConfiguration().getRTL()){$.scrollLeftRTL(n-e.pageX)}else{$.scrollLeft(n-e.pageX)}$.scrollTop(a-e.pageY)}break;case'mousedown':this._switchCursors($,g,G);if(sap.ui.getCore().getConfiguration().getRTL()){n=$.scrollLeftRTL()+e.pageX}else{n=$.scrollLeft()+e.pageX}a=$.scrollTop()+e.pageY;m=true;break;case'mouseup':m=false;case'mouseleave':this._switchCursors($,G,g);break}if(e&&!e.isPropagationStopped()){e.stopPropagation()}if(e&&!e.isImmediatePropagationStopped()){e.stopImmediatePropagation()}},this))}else{this._clearHandlers($);$.css("overflow","auto")}}if(t.getWheelZoomable()&&!sap.ui.Device.support.touch&&!jQuery.sap.simulateMobileOnDesktop&&!t._isHeaderMode()){var c=(sap.ui.Device.browser.mozilla)?'DOMMouseScroll MozMousePixelScroll':'mousewheel wheel';$.on(c,function(e){var D=e.originalEvent.wheelDelta||-e.originalEvent.detail;if(e&&!e.isDefaultPrevented()){e.preventDefault();e.originalEvent.returnValue=false}var f=300;var j=function(){var k=new Date()-t._wheelTimestamp;if(k<f){t._wheelTimeout=setTimeout(j,f-k)}else{t._wheelTimeout=null;t._wheelCalled=false}};if(!t._wheelCalled){t._wheelCalled=true;if(D<0){t.zoomIn()}else{t.zoomOut()}}if(!t._wheelTimeout){t._wheelTimestamp=new Date();t._wheelTimeout=setTimeout(j,f)}if(e&&!e.isPropagationStopped()){e.stopPropagation()}if(e&&!e.isImmediatePropagationStopped()){e.stopImmediatePropagation()}})}this._resizeRegId=sap.ui.core.ResizeHandler.register(this,jQuery.proxy(sap.suite.ui.commons.ProcessFlow.prototype._onResize,this))}};
sap.suite.ui.commons.ProcessFlow.prototype._onResize=function(){var a=new Date().getTime();if(!this._iLastResizeEventTime||((a-this._iLastResizeEventTime)<50)){if(!this._iLastResizeHandlingTime||(a-this._iLastResizeHandlingTime>500)){this.onAfterRendering();this._iLastResizeHandlingTime=new Date().getTime()}}else{this._iLastResizeHandlingTime=null}this._iLastResizeEventTime=new Date().getTime()};
sap.suite.ui.commons.ProcessFlow._enumMoveDirection={'LEFT':'left','RIGHT':'right','UP':'up','DOWN':'down',};
sap.suite.ui.commons.ProcessFlow.prototype._setFocusOnMouseClick=function(n){var N=this._lastNavigationFocusNode,o=n;this._lastNavigationFocusNode=o;this.getDomRef().children[0].children[0].focus();this._changeNavigationFocus(N,o)};
sap.suite.ui.commons.ProcessFlow.prototype._changeNavigationFocus=function(n,N){if(n&&N&&(n.getId()!==N.getId)){jQuery.sap.log.debug("Rerendering PREVIOUS node with id '"+n.getId()+"' and title '"+n.getTitle()+"' navigation focus : "+n._getNavigationFocus());n._setNavigationFocus(false);n.rerender();jQuery.sap.log.debug("Rerendering CURRENT node with id '"+N.getId()+"' and title '"+N.getTitle()+"' navigation focus : "+N._getNavigationFocus());N._setNavigationFocus(true);N.rerender();this._onFocusChanged()}};
sap.suite.ui.commons.ProcessFlow.prototype._moveOnePage=function(d,a){d=d||sap.suite.ui.commons.ProcessFlow._enumMoveDirection.UP;a=a||false;var o=0,b=0;var n=0,c=0;var e=0;var N=false;for(var i=0;i<this._internalCalcMatrix.length;i++){for(var j=0;j<this._internalCalcMatrix[i].length;j++){if(this._internalCalcMatrix[i][j]instanceof sap.suite.ui.commons.ProcessFlowNode&&this._internalCalcMatrix[i][j]._getNavigationFocus()){o=i;b=j;break}}}if(a){if(d==sap.suite.ui.commons.ProcessFlow._enumMoveDirection.UP){for(var j=b-1;j>=0&&e<this._jumpOverElements;j--){if(this._internalCalcMatrix[o][j]instanceof sap.suite.ui.commons.ProcessFlowNode&&(!this._bHighlightedMode||this._internalCalcMatrix[o][j].getHighlighted())){e++;n=o;c=j;N=true}}}else if(d===sap.suite.ui.commons.ProcessFlow._enumMoveDirection.DOWN){for(var j=b+1;j<this._internalCalcMatrix[o].length&&e<this._jumpOverElements;j++){if(this._internalCalcMatrix[o][j]instanceof sap.suite.ui.commons.ProcessFlowNode&&(!this._bHighlightedMode||this._internalCalcMatrix[o][j].getHighlighted())){e++;n=o;c=j;N=true}}}}else{if(d==sap.suite.ui.commons.ProcessFlow._enumMoveDirection.UP){for(var i=o-1;i>=0&&e<this._jumpOverElements;i--){if(this._internalCalcMatrix[i][b]instanceof sap.suite.ui.commons.ProcessFlowNode&&(!this._bHighlightedMode||this._internalCalcMatrix[i][b].getHighlighted())){e++;n=i;c=b;N=true}}}else if(d===sap.suite.ui.commons.ProcessFlow._enumMoveDirection.DOWN){for(var i=o+1;i<this._internalCalcMatrix.length&&e<this._jumpOverElements;i++){if(this._internalCalcMatrix[i][b]instanceof sap.suite.ui.commons.ProcessFlowNode&&(!this._bHighlightedMode||this._internalCalcMatrix[i][b].getHighlighted())){e++;n=i;c=b;N=true}}}}if(N){this._internalCalcMatrix[o][b]._setNavigationFocus(false);this._internalCalcMatrix[n][c]._setNavigationFocus(true);this._lastNavigationFocusNode=this._internalCalcMatrix[n][c]}return N};
sap.suite.ui.commons.ProcessFlow.prototype._moveHomeEnd=function(d,c){d=d||sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT;c=c||false;var o=0,a=0;var n=0,b=0;var N=false;for(var i=0;i<this._internalCalcMatrix.length;i++){for(var j=0;j<this._internalCalcMatrix[i].length;j++){if(this._internalCalcMatrix[i][j]instanceof sap.suite.ui.commons.ProcessFlowNode&&this._internalCalcMatrix[i][j]._getNavigationFocus()){o=i;a=j;break}}}if(c){if(d==sap.suite.ui.commons.ProcessFlow._enumMoveDirection.LEFT){for(var i=0;i<o;i++){if(this._internalCalcMatrix[i][a]instanceof sap.suite.ui.commons.ProcessFlowNode&&(!this._bHighlightedMode||this._internalCalcMatrix[i][a].getHighlighted())){n=i;b=a;N=true;break}}}else if(d===sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT){for(var i=this._internalCalcMatrix.length-1;i>o;i--){if(this._internalCalcMatrix[i][a]instanceof sap.suite.ui.commons.ProcessFlowNode&&(!this._bHighlightedMode||this._internalCalcMatrix[i][a].getHighlighted())){n=i;b=a;N=true;break}}}}else{if(d==sap.suite.ui.commons.ProcessFlow._enumMoveDirection.LEFT){for(var j=0;j<a;j++){if(this._internalCalcMatrix[o][j]instanceof sap.suite.ui.commons.ProcessFlowNode&&(!this._bHighlightedMode||this._internalCalcMatrix[o][j].getHighlighted())){n=o;b=j;N=true;break}}}else if(d===sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT){for(var j=this._internalCalcMatrix[o].length-1;j>a;j--){if(this._internalCalcMatrix[o][j]instanceof sap.suite.ui.commons.ProcessFlowNode&&(!this._bHighlightedMode||this._internalCalcMatrix[o][j].getHighlighted())){n=o;b=j;N=true;break}}}}if(N){this._internalCalcMatrix[o][a]._setNavigationFocus(false);this._internalCalcMatrix[n][b]._setNavigationFocus(true);this._lastNavigationFocusNode=this._internalCalcMatrix[n][b]}return N};
sap.suite.ui.commons.ProcessFlow.prototype._moveToNextNode=function(d,s){d=d||sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT;if(sap.ui.getCore().getConfiguration().getRTL()){if(d===sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT){d=sap.suite.ui.commons.ProcessFlow._enumMoveDirection.LEFT}else if(d===sap.suite.ui.commons.ProcessFlow._enumMoveDirection.LEFT){d=sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT}}s=s||1;var f=false;var n=false;var o=0,a=1;if(!this._internalCalcMatrix){return}var p=0,b=0;for(var i=0;i<this._internalCalcMatrix.length;i++){for(var j=0;j<this._internalCalcMatrix[i].length;j++){if(this._internalCalcMatrix[i][j]instanceof sap.suite.ui.commons.ProcessFlowNode&&this._internalCalcMatrix[i][j]._getNavigationFocus()){o=p=i;a=b=j;f=true;break}}if(f){break}}if(d==sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT){for(var i=p;i<this._internalCalcMatrix.length;i++){for(var j=b+1;j<this._internalCalcMatrix[i].length;j++){if(this._internalCalcMatrix[i][j]instanceof sap.suite.ui.commons.ProcessFlowNode){if(f&&(!this._bHighlightedMode||this._internalCalcMatrix[i][j].getHighlighted())){this._internalCalcMatrix[i][j]._setNavigationFocus(true);this._lastNavigationFocusNode=this._internalCalcMatrix[i][j];n=true;break}}}b=0;if(n){break}}}if(d==sap.suite.ui.commons.ProcessFlow._enumMoveDirection.LEFT){for(var i=p;i>=0;i--){for(var j=b-1;j>=0;j--){if(this._internalCalcMatrix[i][j]instanceof sap.suite.ui.commons.ProcessFlowNode){if(f&&(!this._bHighlightedMode||this._internalCalcMatrix[i][j].getHighlighted())){this._lastNavigationFocusNode=this._internalCalcMatrix[i][j]._setNavigationFocus(true);this._lastNavigationFocusNode=this._internalCalcMatrix[i][j];n=true;break}}}if(i>0){b=this._internalCalcMatrix[i-1].length}if(n){break}}}if(d==sap.suite.ui.commons.ProcessFlow._enumMoveDirection.UP){for(var i=p-1;i>=0;i--){var c=0;while(!n){var y=b-c;var e=b+c;if(y>=0&&this._internalCalcMatrix[i][y]instanceof sap.suite.ui.commons.ProcessFlowNode){if(f&&(!this._bHighlightedMode||this._internalCalcMatrix[i][y].getHighlighted())){this._internalCalcMatrix[i][y]._setNavigationFocus(true);this._lastNavigationFocusNode=this._internalCalcMatrix[i][y];n=true;break}}if(e<this._internalCalcMatrix[i].length&&this._internalCalcMatrix[i][e]instanceof sap.suite.ui.commons.ProcessFlowNode){if(f&&(!this._bHighlightedMode||this._internalCalcMatrix[i][e].getHighlighted())){this._internalCalcMatrix[i][e]._setNavigationFocus(true);this._lastNavigationFocusNode=this._internalCalcMatrix[i][e];n=true;break}}if(y<0&&e>this._internalCalcMatrix[i].length){break}c++}}}if(d==sap.suite.ui.commons.ProcessFlow._enumMoveDirection.DOWN){for(var i=p+1;i<this._internalCalcMatrix.length;i++){var c=0;while(!n){var y=b-c;var e=b+c;if(y>=0&&this._internalCalcMatrix[i][y]instanceof sap.suite.ui.commons.ProcessFlowNode){if(f&&(!this._bHighlightedMode||this._internalCalcMatrix[i][y].getHighlighted())){this._lastNavigationFocusNode=this._internalCalcMatrix[i][y]._setNavigationFocus(true);this._lastNavigationFocusNode=this._internalCalcMatrix[i][y];n=true;break}}if(e<this._internalCalcMatrix[i].length&&this._internalCalcMatrix[i][e]instanceof sap.suite.ui.commons.ProcessFlowNode){if(f&&(!this._bHighlightedMode||this._internalCalcMatrix[i][e].getHighlighted())){this._lastNavigationFocusNode=this._internalCalcMatrix[i][e]._setNavigationFocus(true);this._lastNavigationFocusNode=this._internalCalcMatrix[i][e];n=true;break}}if(y<0&&e>this._internalCalcMatrix[i].length){break}c++}}}if(n){this._internalCalcMatrix[o][a]._setNavigationFocus(false)}return n};
sap.suite.ui.commons.ProcessFlow.prototype._bNFocusOutside=false;sap.suite.ui.commons.ProcessFlow.prototype._bHighlightedMode=false;
sap.suite.ui.commons.ProcessFlow.prototype.getFocusDomRef=function(){var d=this.getDomRef().children[0].children[0];jQuery.sap.log.debug("ProcessFlow::getFocusDomRef : Keyboard focus has been changed to element:  id='"+d.id+"' outerHTML='"+d.outerHTML+"'");return d};
sap.suite.ui.commons.ProcessFlow.prototype.onfocusin=function(e){jQuery.sap.log.debug("ProcessFlow::focus in"+(this._lastNavigationFocusNode?this._lastNavigationFocusNode.getTitle():"not defined"));if(this._lastNavigationFocusNode){this._lastNavigationFocusNode._setNavigationFocus(true);this._lastNavigationFocusNode.rerender()}else{var n=false;for(var i=0;i<this._internalCalcMatrix.length;i++){for(var j=0;j<this._internalCalcMatrix[i].length;j++){if(this._internalCalcMatrix[i][j]instanceof sap.suite.ui.commons.ProcessFlowNode){this._internalCalcMatrix[i][j]._setNavigationFocus(true);this._internalCalcMatrix[i][j].rerender();this._lastNavigationFocusNode=this._internalCalcMatrix[i][j];n=true;break}}if(n){break}}}};
sap.suite.ui.commons.ProcessFlow.prototype.onfocusout=function(e){jQuery.sap.log.debug("ProcessFlow::focus out"+(this._lastNavigationFocusNode?this._lastNavigationFocusNode.getTitle():"not defined"));for(var i=0;i<this.getNodes().length;i++){if(this.getNodes()[i]._getNavigationFocus()){this._lastNavigationFocusNode=this.getNodes()[i];this.getNodes()[i]._setNavigationFocus(false);this.getNodes()[i].rerender()}}jQuery.sap.log.info("focus out")};
sap.suite.ui.commons.ProcessFlow.prototype._onFocusChanged=function(){var f=this._lastNavigationFocusNode,$=f?f.$():null,c,s,S,i,d,e,C,g,n,N,p,h,j,k,l,m,o,q=function(a,b){return(a>b)?a:b},r=function(a,b){return(a<b)?a:b},t=750,u=this;if(f&&this.getScrollable()){jQuery.sap.log.debug("The actually focused node is "+f.getId()+" with title "+f.getTitle());n=$.outerWidth();N=$.outerHeight();jQuery.sap.log.debug("Node outer width x height ["+n+" x "+N+"]");p=$.position();jQuery.sap.log.debug("Position of node in the content is ["+p.left+", "+p.top+"]");c=this.$();e=this.$("scroll-content");s=c.innerWidth();S=c.innerHeight();jQuery.sap.log.debug("Scroll container inner width x height ["+s+" x "+S+"]");i=c.scrollLeft();d=c.scrollTop();jQuery.sap.log.debug("Current scroll offset is ["+i+", "+d+"]");C=e.innerWidth();g=e.innerHeight();jQuery.sap.log.debug("Scroll content inner width x height ["+C+" x "+g+"]");h=-i+p.left;k=h+n;j=-d+p.top;l=j+N;if((k>s)||(h<0)||(l>S)||(j<0)){m=Math.round((s-n)/2);m=q(s-C+p.left,m);m=r(p.left,m);o=Math.round((S-N)/2);o=q(S-g+p.top,o);o=r(p.top,o);jQuery.sap.log.debug("Node lies outside the scroll container, scrolling from ["+h+","+j+"] to ["+m+","+o+"]");c.animate({scrollTop:p.top-o,scrollLeft:p.left-m},t,"swing")}else{jQuery.sap.log.debug("Node lies inside the scroll container, no scrolling happens.")}}};
sap.suite.ui.commons.ProcessFlow.prototype.onkeydown=function(e){if(!sap.ui.Device.system.desktop)return;var k=(e.keyCode?e.keyCode:e.which);jQuery.sap.log.debug("ProcessFlow::keyboard input has been catched and action going to start: keycode="+k);var n=false;var r=false;var R=null;var s=e.shiftKey;var c=e.ctrlKey;var a=e.altKey;var f;var p=this._lastNavigationFocusNode;switch(k){case jQuery.sap.KeyCodes.ENTER:case jQuery.sap.KeyCodes.SPACE:for(var i=0;i<this.getNodes().length;i++){if(this.getNodes()[i]._getNavigationFocus()){this.fireNodePress(this.getNodes()[i]);break}}break;case jQuery.sap.KeyCodes.TAB:case jQuery.sap.KeyCodes.F6:if(s)R=this.getDomRef().parentElement.previousElementSibling;else R=this.getDomRef().parentElement.nextElementSibling;r=true;break;case jQuery.sap.KeyCodes.ARROW_RIGHT:n=this._moveToNextNode(sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT);break;case jQuery.sap.KeyCodes.ARROW_LEFT:n=this._moveToNextNode(sap.suite.ui.commons.ProcessFlow._enumMoveDirection.LEFT);break;case jQuery.sap.KeyCodes.ARROW_DOWN:n=this._moveToNextNode(sap.suite.ui.commons.ProcessFlow._enumMoveDirection.DOWN);break;case jQuery.sap.KeyCodes.ARROW_UP:n=this._moveToNextNode(sap.suite.ui.commons.ProcessFlow._enumMoveDirection.UP);break;case jQuery.sap.KeyCodes.PAGE_UP:n=this._moveOnePage(sap.suite.ui.commons.ProcessFlow._enumMoveDirection.UP,a);break;case jQuery.sap.KeyCodes.PAGE_DOWN:n=this._moveOnePage(sap.suite.ui.commons.ProcessFlow._enumMoveDirection.DOWN,a);break;case jQuery.sap.KeyCodes.HOME:n=this._moveHomeEnd(sap.suite.ui.commons.ProcessFlow._enumMoveDirection.LEFT,c);break;case jQuery.sap.KeyCodes.END:n=this._moveHomeEnd(sap.suite.ui.commons.ProcessFlow._enumMoveDirection.RIGHT,c);break;case jQuery.sap.KeyCodes.NUMPAD_PLUS:case jQuery.sap.KeyCodes.PLUS:if(c){this.zoomOut()}break;case jQuery.sap.KeyCodes.NUMPAD_MINUS:case jQuery.sap.KeyCodes.MINUS:if(c){this.zoomIn()}break;case jQuery.sap.KeyCodes.NUMPAD_0:if(c){this.setZoomLevel(sap.suite.ui.commons.ProcessFlowZoomLevel.Two)}break;default:return}e.preventDefault();if(n){this._changeNavigationFocus(p,this._lastNavigationFocusNode)}if(R){R.focus();jQuery.sap.log.debug("keypressdown: Keyboard focus has been changed to element:  id='"+R.id+"' outerHTML='"+R.outerHTML+"'");R=null}};
sap.suite.ui.commons.ProcessFlow.prototype._mergeLaneIdNodeStates=function(l){var p=0;var n=0;var N=0;var P=0;for(var s=0;s<4;s++){for(var i=0;i<l.length;i++){switch(l[i][s].state){case sap.suite.ui.commons.ProcessFlowNodeState.Positive:p=p+l[i][s].value;break;case sap.suite.ui.commons.ProcessFlowNodeState.Negative:n=n+l[i][s].value;break;case sap.suite.ui.commons.ProcessFlowNodeState.Neutral:N=N+l[i][s].value;break;case sap.suite.ui.commons.ProcessFlowNodeState.Planned:P=P+l[i][s].value;break}}}var r=[{state:sap.suite.ui.commons.ProcessFlowNodeState.Positive,value:p},{state:sap.suite.ui.commons.ProcessFlowNodeState.Negative,value:n},{state:sap.suite.ui.commons.ProcessFlowNodeState.Neutral,value:N},{state:sap.suite.ui.commons.ProcessFlowNodeState.Planned,value:P}];return r}
