<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:cr= "http://www.crossref.org/schema/4.3.7"
	exclude-result-prefixes="xs cr"
	version="2.0">
<xsl:output method="xml" indent="yes" omit-xml-declaration="yes"></xsl:output>
	

	<xsl:template match="/">
	<ol>
		<xsl:apply-templates/>
	</ol>
	</xsl:template>

	<xsl:template match="cr:report-paper">
		<xsl:variable name="doi_url" select="concat('https://doi.org/',cr:report-paper_series_metadata/cr:doi_data/cr:doi)"/>
	<li>
		<h3 class="sel">
			<span class="title"><xsl:value-of select="cr:report-paper_series_metadata/cr:titles/cr:title"/></span>
			<span class="subtitle"><xsl:value-of select="cr:report-paper_series_metadata/cr:titles/cr:subtitle"/></span>
		</h3>
		<p><em><xsl:text>(</xsl:text><xsl:value-of select="cr:report-paper_series_metadata/cr:publisher_item/cr:item_number"/><xsl:text>)</xsl:text></em></p>
<p>
	<strong  class="sel"><xsl:value-of select="$doi_url"/></strong>
	<xsl:text> — Klikkbar lenke: </xsl:text>
	
	<xsl:element name="a">
		<xsl:attribute name="href" select="$doi_url"/>
		<xsl:value-of select="$doi_url"/>
</xsl:element>
</p>
</li>
	</xsl:template>

	<xsl:template match="node()">
		<xsl:apply-templates/>
</xsl:template>



</xsl:stylesheet>