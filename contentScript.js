let newImageUrl;

// Function to replace profile pictures
function replaceProfilePictures() {
  const profilePictures = document.querySelectorAll('.update-components-actor__avatar-image.evi-image.lazy-image.ember-view, .ivm-image-view-model__circle-img');
  profilePictures.forEach((img) => {
    if (!img.src.startsWith('data:image/jpeg;base64') && img.width === 48 && img.height === 48) {
      img.src = newImageUrl;
    }
  });
}

// Get the image URL from the storage
chrome.storage.sync.get('newImageUrl', function(data) {
  if (data.newImageUrl) {
    newImageUrl = data.newImageUrl;
    console.log(`New image URL: ${newImageUrl}`);
    replaceProfilePictures();
  } else {
    console.log('No new image URL found');
  }
});

// Set up a MutationObserver to handle dynamically loaded content
const observer = new MutationObserver(replaceProfilePictures);
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Listen for the "reloadPage" message from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "reloadPage") {
    location.reload();
  }
});
