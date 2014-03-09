(function() {
  define(["VMM", "trace"], function(VMM, trace) {
    return VMM.FileExtention = {
      googleDocType: function(url) {
        var fileExtension, fileName, flag, i, validFileExtensions;

        fileName = url.replace(/\s\s*$/, "");
        fileExtension = "";
        validFileExtensions = ["DOC", "DOCX", "XLS", "XLSX", "PPT", "PPTX", "PDF", "PAGES", "AI", "PSD", "TIFF", "DXF", "SVG", "EPS", "PS", "TTF", "XPS", "ZIP", "RAR"];
        flag = false;
        fileExtension = fileName.substr(fileName.length - 5, 5);
        i = 0;
        while (i < validFileExtensions.length) {
          if (fileExtension.toLowerCase().match(validFileExtensions[i].toString().toLowerCase()) || fileName.match("docs.google.com")) {
            flag = true;
          }
          i++;
        }
        return flag;
      }
    };
  });

}).call(this);
