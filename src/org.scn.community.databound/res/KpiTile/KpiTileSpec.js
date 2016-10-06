/**
 * Copyright 2014 Scn Community Contributors
 * 
 * Original Source Code Location:
 *  https://github.com/org-scn-design-studio-community/sdkpackage/
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at 
 *  
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License. 
 */
define([],
function() {

	var spec = {
		id: "KpiTile",
		name: "databound.KpiTile",
		requireName: "databoundkpitile",
		fullComponentName: "org.scn.community.databound.KpiTile",
		fullComponentPackage: "org.scn.community.databound/res/KpiTile",
		script: "org.scn.community.databound/res/KpiTile/KpiTile",
		scriptSpec: "org.scn.community.databound/res/KpiTile/KpiTileSpec",
		min: false
	};

	spec.spec = 
{
  "clickedComponent": {
    "opts": {
      "apsControl": "text",
      "cat": "Internal",
      "desc": "Clicked Component",
      "noAps": true,
      "noZtl": false,
      "tooltip": "Clicked Component",
      "ztlFunction": "-get",
      "ztlType": "String"
    },
    "template": "String",
    "type": "String",
    "value": "",
    "visible": false
  },
  "columnNumber": {
    "opts": {
      "apsControl": "spinner",
      "cat": "Content",
      "desc": "Number of Columns",
      "noAps": false,
      "noZtl": false,
      "tooltip": "Number of Columns",
      "ztlFunction": "",
      "ztlType": "int"
    },
    "template": "int",
    "type": "int",
    "value": 1,
    "visible": true
  },
  "componentsSpec": {
    "opts": {
      "apsControl": "array",
      "arrayDefinition": {"component": {
        "bottom": {
          "desc": "Bottom Position",
          "type": "int"
        },
        "componentType": {
          "desc": "Component Type",
          "type": "String"
        },
        "height": {
          "desc": "Height in Px",
          "type": "int"
        },
        "key": {
          "desc": "Unique Key",
          "type": "String"
        },
        "left": {
          "desc": "Left Position (-1 if right margin is set)",
          "type": "int"
        },
        "property": {
          "dimension": {
            "apsControl": "textfield",
            "desc": "Linked Dimension Key",
            "type": "String"
          },
          "key": {
            "desc": "Property Name",
            "type": "String"
          },
          "parentKey": {
            "desc": "Parent Key",
            "mode": "ztl",
            "type": "String"
          },
          "sequence": "parentKey,key,dimension,value",
          "type": "Array",
          "value": {
            "apsControl": "textarea",
            "desc": "Property Value",
            "type": "String"
          }
        },
        "right": {
          "desc": "Rigth Position",
          "type": "int"
        },
        "sequence": "key,componentType,top,bottom,left,right,width,height,specification,property",
        "specification": {
          "apsControl": "textarea",
          "desc": "Full Specification",
          "type": "String"
        },
        "top": {
          "desc": "Top Position (-1 if bottom margin is set)",
          "type": "int"
        },
        "type": "Array",
        "width": {
          "desc": "Width in Px",
          "type": "int"
        }
      }},
      "arrayMode": "TwoLevelArray",
      "cat": "Content-Components",
      "desc": "Components",
      "tooltip": "List of Components",
      "ztlFunction": "-unique",
      "ztlType": "DoubleArray"
    },
    "type": "String",
    "value": "[{\"parentKey\":\"ROOT\",\"key\":\"HEADER\",\"leaf\":false,\"componentType\":\"Label\",\"top\":\"10\",\"left\":\"10\",\"width\":\"200\",\"height\":\"20\"},{\"parentKey\":\"ROOT\",\"key\":\"TITLE\",\"leaf\":false,\"componentType\":\"Label\",\"top\":\"40\",\"left\":\"10\",\"width\":\"100%\",\"height\":\"20\"},{\"parentKey\":\"ROOT\",\"key\":\"VALUE\",\"leaf\":false,\"componentType\":\"Label\",\"top\":\"60\",\"left\":\"-1\",\"right\":\"10\",\"width\":\"200\",\"height\":\"40\"},{\"parentKey\":\"ROOT\",\"key\":\"FOOTER\",\"leaf\":false,\"componentType\":\"Label\",\"top\":\"-1\",\"bottom\":\"10\"},{\"parentKey\":\"HEADER\",\"key\":\"HEADER/text\",\"leaf\":true,\"value\":\"\",\"dimension\":\"Department\"},{\"parentKey\":\"HEADER\",\"key\":\"HEADER/styleClass\",\"leaf\":true,\"value\":\"scn-pack-KpiTile-Header\"},{\"parentKey\":\"TITLE\",\"key\":\"TITLE/text\",\"leaf\":true,\"value\":\"Title\"},{\"parentKey\":\"TITLE\",\"key\":\"TITLE/styleClass\",\"leaf\":true,\"value\":\"scn-pack-KpiTile-Title\"},{\"parentKey\":\"VALUE\",\"key\":\"VALUE/text\",\"leaf\":true,\"value\":\"\",\"dimension\":\"Sales\"},{\"parentKey\":\"VALUE\",\"key\":\"VALUE/styleClass\",\"leaf\":true,\"value\":\"scn-pack-KpiTile-Value\"},{\"parentKey\":\"VALUE\",\"key\":\"VALUE/textAlign\",\"leaf\":true,\"value\":\"sap.ui.core.TextAlign.Right\"},{\"parentKey\":\"FOOTER\",\"key\":\"FOOTER/text\",\"leaf\":true,\"value\":\"Footer\"}]",
    "visible": true
  },
  "contentHeight": {
    "opts": {
      "apsControl": "spinner",
      "cat": "Content",
      "desc": "Content Height",
      "noAps": false,
      "noZtl": false,
      "tooltip": "Content Height",
      "ztlFunction": "",
      "ztlType": "int"
    },
    "template": "int",
    "type": "int",
    "value": 260,
    "visible": true
  },
  "contentResponsive": {
    "opts": {
      "apsControl": "checkbox",
      "cat": "Content",
      "desc": "Respopnsive Content",
      "noAps": false,
      "noZtl": false,
      "tooltip": "Respopnsive Content",
      "ztlFunction": "",
      "ztlType": "boolean"
    },
    "template": "int",
    "type": "boolean",
    "value": false,
    "visible": true
  },
  "data": {
    "opts": {
      "apsControl": "text",
      "cat": "DataBinding",
      "desc": "Result Set",
      "noAps": true,
      "noZtl": false,
      "tooltip": "Result Set",
      "ztlFunction": "-get",
      "ztlType": "ResultSet"
    },
    "template": "default",
    "type": "ResultSet",
    "value": "",
    "visible": false
  },
  "layoutSpec": {
    "opts": {
      "apsControl": "array",
      "arrayDefinition": {"layout": {
        "key": {
          "desc": "Property Name",
          "type": "String"
        },
        "sequence": "key,value",
        "type": "Array",
        "value": {
          "apsControl": "textarea",
          "desc": "Property Value",
          "type": "String"
        }
      }},
      "arrayMode": "OneLevelArray",
      "cat": "Content-Layout",
      "desc": "Layout Properties",
      "noAps": true,
      "noZtl": true,
      "tooltip": "Layout Properties",
      "ztlFunction": "",
      "ztlType": "SingleArray"
    },
    "type": "String",
    "value": "[]",
    "visible": false
  },
  "onClick": {
    "opts": {
      "apsControl": "text",
      "cat": "Events",
      "desc": "On Click",
      "noAps": true,
      "noZtl": true,
      "tooltip": "On Click"
    },
    "template": "Event",
    "type": "ScriptText",
    "value": "",
    "visible": true
  },
  "onSelect": {
    "opts": {
      "apsControl": "text",
      "cat": "Events",
      "desc": "On Select",
      "noAps": true,
      "noZtl": true,
      "tooltip": "On Select"
    },
    "template": "Event",
    "type": "ScriptText",
    "value": "",
    "visible": true
  },
  "selectedKey": {
    "opts": {
      "apsControl": "text",
      "cat": "Internal",
      "desc": "Selected Key",
      "noAps": true,
      "noZtl": false,
      "tooltip": "Selected Key",
      "ztlFunction": "-get",
      "ztlType": "String"
    },
    "template": "String",
    "type": "String",
    "value": "",
    "visible": false
  }
};

	spec.specInclude = 
{};

	spec.specAbout = 
{
  "description": "Repeatable Kpi Tile",
  "icon": "KpiTile.png",
  "title": "Repeatable Kpi Tile 2.0",
  "topics": [{
    "content": "Repeatable Kpi Tile - Custom Tile Component based on UI5 Specification. Allows you to build own Tiles which can be data bound.",
    "title": "Repeatable Kpi Tile"
  }]
};

	spec.specComp = 
{
  "dataType": "ResultSet",
  "databound": true,
  "extension": "Component",
  "group": "ScnCommunityVisualizations",
  "handlerType": "sapui5",
  "height": "600",
  "id": "KpiTile",
  "modes": "commons m",
  "package": "databound",
  "parentControl": "sap.zen.commons.layout.AbsoluteLayout",
  "require": [
    {
      "id": "common_basics",
      "space": "known"
    },
    {
      "id": "jshashtable",
      "space": "known"
    },
    {
      "id": "numberformatter",
      "space": "known"
    },
    {
      "id": "sap_m_loader",
      "space": "known"
    },
    {
      "id": "sap_suite_loader",
      "space": "known"
    },
    {
      "id": "x2js",
      "space": "known"
    }
  ],
  "title": "Repeatable Kpi Tile 2.0",
  "tooltip": "Repeatable Kpi Tile - Custom KPI Visualization based on Data Source",
  "width": "260"
};

	return spec;
});// End of closure
