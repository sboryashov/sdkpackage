package org.scn.community.defgenerator;

public class ZtlAndAps {

	String functions = "";
	String aps = "";
	String xml = "";
	
	public String getFunctions() {
		if(functions == null) {
			return "";
		}
		return functions;
	}
	public void setFunctions(String functions) {
		this.functions = functions;
	}
	
	public String getAps() {
		if(aps == null) {
			return "";
		}
		return aps;
	}
	public void setAps(String aps) {
		this.aps = aps;
	}
	
	public String getXml() {
		if(xml == null) {
			return "";
		}
		return xml;
	}
	public void setXml(String xml) {
		this.xml = xml;
	}
}
