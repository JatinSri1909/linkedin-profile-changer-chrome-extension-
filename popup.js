let selectedFile;
let previewImage = document.getElementById('previewImage');

document.getElementById('imageUpload').addEventListener('change', function() {
  selectedFile = this.files[0];
  
  // Image Preview
  let reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
  };
  reader.readAsDataURL(selectedFile);
});

document.getElementById('saveButton').addEventListener('click', function() {
  if (selectedFile) {
    // Loading Indicator
    this.textContent = 'Saving...';
    this.disabled = true;

    const reader = new FileReader();
    reader.onloadend = function() {
      // Error Handling
      if (reader.error) {
        alert('An error occurred while reading the file.');
        return;
      }

      const img = document.createElement('img');
      img.src = reader.result;
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set the canvas dimensions to the desired size
        canvas.width = 100;
        canvas.height = 100;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get the data URL of the canvas with reduced quality
        const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.5);
        
        // Save the resized image
        chrome.storage.sync.set({newImageUrl: resizedImageUrl}, function() {
          console.log('Image URL saved');

          // Inject content script and send reload message
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
              target: {tabId: tabs[0].id},
              files: ['contentScript.js']
            }).then(() => {
              setTimeout(function() {
                chrome.tabs.sendMessage(tabs[0].id, {action: "reloadPage"});
              }, 2000);
            });
          });

          // Provide Feedback to User
          alert('Image saved successfully! The page will now reload.');

          // Reset the save button
          document.getElementById('saveButton').textContent = 'Save';
          document.getElementById('saveButton').disabled = false;
        });
      };
    }
    reader.readAsDataURL(selectedFile);
  }
});
