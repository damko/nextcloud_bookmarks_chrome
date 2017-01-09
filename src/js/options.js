// Saves options to chrome.storage.sync.
function save_options() {

  var serverURL = document.getElementById('serverURL').value;
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  chrome.storage.sync.set({
    serverURL: serverURL,
    username: username,
    password: password
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('optionsStatus');
    status.textContent = 'Options have been saved :-)';
    setTimeout(function() {
      status.textContent = '';
    }, 1200);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    serverURL: 'http://127.0.0.1:80',
    username: 'user',
    password: 'pass',
  }, function(items) {
    document.getElementById('serverURL').value = items.serverURL;
    document.getElementById('username').value = items.username;
    document.getElementById('password').value = items.password;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('saveNextcloud-BookmarksOptions').addEventListener('click',
    save_options);