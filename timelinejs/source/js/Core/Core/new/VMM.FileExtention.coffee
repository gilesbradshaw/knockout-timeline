#	* File Extention
#================================================== 
define ["VMM", "trace"], (VMM, trace)->
	VMM.FileExtention = googleDocType: (url) ->
		fileName = url.replace(/\s\s*$/, "")
		fileExtension = ""
		validFileExtensions = [
			"DOC"
			"DOCX"
			"XLS"
			"XLSX"
			"PPT"
			"PPTX"
			"PDF"
			"PAGES"
			"AI"
			"PSD"
			"TIFF"
			"DXF"
			"SVG"
			"EPS"
			"PS"
			"TTF"
			"XPS"
			"ZIP"
			"RAR"
		]
		flag = false
		fileExtension = fileName.substr(fileName.length - 5, 5)
		i = 0

		while i < validFileExtensions.length
			flag = true    if fileExtension.toLowerCase().match(validFileExtensions[i].toString().toLowerCase()) or fileName.match("docs.google.com")
			i++
		flag