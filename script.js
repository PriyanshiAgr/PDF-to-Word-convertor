function loadPDF() {
  
  var file = document.getElementById("fileInput").files[0];

  
  var reader = new FileReader();

 
  reader.onload = function(e) {
    var typedarray = new Uint8Array(this.result);

   
    pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {

      
      var numPages = pdf.numPages;

     
      for (var i = 1; i <= numPages; i++) {
        pdf.getPage(i).then(function(page) {
          page.getTextContent().then(function(textContent) {
            var text = "";
            for (var j = 0; j < textContent.items.length; j++) {
              text += textContent.items[j].str + " ";
            }
        
            
            var para = document.createElement("p");
            var node = document.createTextNode(text);
            para.appendChild(node);
            para.classList.add("hidden");

            
            var pdfContainer = document.getElementById("pdfContainer");
            pdfContainer.appendChild(para);
            Export2Word("pdfContainer",'ConvertedPDF')
          });
        });
      }
    });
  };
  reader.readAsArrayBuffer(file);
}

function Export2Word(element, filename = ''){
  var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  var postHtml = "</body></html>";
  var html = preHtml+document.getElementById(element).innerHTML+postHtml;

  var blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
  });
  
  
  var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  
 
  filename = filename?filename+'.doc':'document.doc';
  
  var downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob ){
      navigator.msSaveOrOpenBlob(blob, filename);
  }else{
      
      downloadLink.href = url;
      
    
      downloadLink.download = filename;
      
      
      downloadLink.click();
  }
  
  document.body.removeChild(downloadLink);
}