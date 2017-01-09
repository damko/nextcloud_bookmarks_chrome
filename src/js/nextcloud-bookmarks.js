// document.addEventListener('DOMContentLoaded', function() {
// });

// This is for the keyboard shortcuts (see maniifesto for more information)
/*chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
        if(command == "quickly-add-bookmark"){
            console.log('add current tab as bookmark');
            lastBookmarks();
       }
});*/

function testCorsEnabled(url){
    $.get( url, function( data, textStatus, request) {
        var header = request.getResponseHeader('access-control-allow-origin');

        if(typeof header !== 'undefined') {
             console.log('CORS is not enabled for url: ' + url);
        }
    });
}

function getTagsArrayFromElement(element_id){
    var input_tags = $('#'+element_id).val().split(',');
    var tags = [];
    for (let tag of input_tags) {
        var trimmed_tag = tag.trim();
        if (trimmed_tag) {
            tags.push(trimmed_tag);
        }
    }
    return tags;
}

jQuery.support.cors = true;

$( document ).ready(function(){

    chrome.storage.sync.get('serverURL', function (result) {
        $('#nextcloud-bookmarks-link').attr("href", result.serverURL+ '/index.php/apps/bookmarks/');
    });

    // I want to search for the URL in the database before filling in the form
    // but I don't know yet if the API supports this kind of query
    //CurrentChromeTab(searchForCurrentUrl);

    //For now I replace it with this
    CurrentChromeTab(fillForm);

    // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    //   var target = e.target.attributes.href.value;
    //   $(target +' input').focus();
    // })


    //focuses search-tags input box
    //TODO this does not work
    // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    //     e.preventDefault();
    //     var target = $(e.target).attr("href"); // activated tab
    //     if (target == '#search-bookmarks-tab') {
    //         $('#search-tags').focus();
    //     }
    //     console.log(target);
    // });

    //Searches for tags when the user hits enter and the search-bookmarks-tab input field has focus
    $('#search-tags').keypress(function (e) {
        var key = e.which;
        // the enter key code
        if(key == 13) {
            searchByTags();
            e.preventDefault();
            $('#search-bookmarks-tab').show();
        }
    });   

    $('#search-by-tags-button').click(function (e) {
        searchByTags();
    });

    $('#save-bookmark-button').click(function (e) {
        saveBookmark();
    });

    $('#delete-bookmark-button').click(function (e) {
        deleteBookmark();
    });
});

function searchByTags(){

    chrome.storage.sync.get(['serverURL', 'username', 'password'], function (result) {
        //TODO watch out: after fresh install, before saving the options, "result" could be empty
        var serverEndPointURL = result.serverURL + '/index.php/apps/bookmarks/public/rest/v1/bookmark';
        var tags = getTagsArrayFromElement('search-tags');
        var conjunction = $("input[name='conjunction']:checked"). val();

        searchBookmarks(serverEndPointURL, result.username, result.password,tags,conjunction);

    });
}


function searchBookmarks(url, user, password, tags, conjunction){

    //testCorsEnabled(url);

    var select = ['id','ur','title','tags', 'description'];

    $.ajax({
        url: url,
        method: "GET",
        // This is not necessary because it's @PublicPage
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + password));
        // },
        data: {
            user: user,
            password: password,
            select: select,
            tags: tags,
            conjunction: conjunction
        },
        dataType: 'json',
    })
    .success(function(bookmarks){
        makeBookmarksList(bookmarks, 'bookmarks-list');
    });

    /* TODO handle failure */
}




function fillForm(chromeTab){
    // This fills in the hidden form field "bookmark-url" with tab's URL
    document.getElementById("bookmark-url").value = chromeTab.url;
    //This ifills in the bookmark title with the page title of the current tab
    document.getElementById("bookmark-title").value = chromeTab.title;
}

function saveBookmark(){

    chrome.storage.sync.get(['serverURL', 'username', 'password'], function (result) {

        //TODO watch out: after fresh install, before saving the options, "result" could be empty
        var serverEndPointURL = result.serverURL + '/index.php/apps/bookmarks/public/rest/v1/bookmark';
        var tags = $('#bookmark-tags').val().split(',')

        $.ajax({
            url: serverEndPointURL,
            method: "POST",
            // Uncomment this when you remeove @Public from controller
            // beforeSend: function (xhr) {
            //     xhr.setRequestHeader('Authorization', 'Basic ' + btoa(result.username + ':' + result.password));
            // },
            data: {
                url: $('#bookmark-url').val(),
                title: $('#bookmark-title').val(),
                description: $('#bookmark-description').val(),
                tags: getTagsArrayFromElement('bookmark-tags'),
                is_public: true
            },
            dataType: 'json',
        })
        .success(function(result){
            var bookmark = result.item;
            if(bookmark.id){
                $('#save-bookmark-button').hide();
                $('#delete-bookmark-button').show();
                $('#bookmark-id').val(bookmark.id);
                addNotification('success','Bookmark saved!');
            } else {
                addNotification('error','Bookmark not saved. Please check your settings.');
            }
        });

    });
}

function deleteBookmark(bookmarkId){

    if(!bookmarkId && $('#bookmark-id').val().length == 0) {
        console.log('no bookmark id found');
        return false;
    }

    if(!bookmarkId){
        bookmarkId = $('#bookmark-id').val();
    }

    chrome.storage.sync.get(['serverURL', 'username', 'password'], function (result) {

        var serverEndPointURL = result.serverURL + '/index.php/apps/bookmarks/public/rest/v1/bookmark/' + bookmarkId;

        $.ajax({
            method: "DELETE",
            url: serverEndPointURL,
            data: {
                id: bookmarkId
            },
            dataType: 'json'
        })
        .success(function(result){
            /* TODO these don't work
            $('#bookmark-id').empty();
            $('#bookmark-tags').empty();
            $('#bookmark-description').empty();
            $('#bookmark-additional-info').hide();
            */
            $('#bookmark-' + bookmarkId).hide(); //this hides the deleted bookmark from the bookmark list
            CurrentChromeTab(fillForm);
            $('#delete-bookmark-button').hide();
            $('#save-bookmark-button').text("Add");
            $('#save-bookmark-button').show();
            addNotification('success','bookmark deleted');
        });
        //TODO handle failure
    });
}

function addNotification(type,message){
    var div = document.getElementById('notification-area');
    div.innerHTML = "";

    var p = document.createElement("p");
    p.textContent = message;
    if(type == "success"){
        p.className = "notify";
    }
    if(type == "error") {
        p.className = "alarm";
    }
    div.appendChild(p);
    $('#notification-area').show(0).delay(1500).hide(0);
}

function CurrentChromeTab(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    var chromeTab = chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var chromeTab = {
            url: tab.url,
            title: tab.title
        }
        callback(chromeTab);
    });
}

// function getInfo(chromeTab){
//     console.log(chromeTab);
//     $('#bookmark-url').val(chromeTab.url);
//     $('#bookmark-title').val(chromeTab.title);
// }

// function saveBookmarkOld(){
//     chrome.storage.sync.get(['serverURL', 'username', 'password'], function (result) {

//         var serverEndPointURL = result.serverURL + '/bookmark/save';

//         $.ajax({
//             method: "POST",
//             url: serverEndPointURL,
//             xhrFields: {
//                 withCredentials: true
//             },
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader('Authorization', 'Basic ' + btoa('user:password'));
//             },
//             data: {
//                 url: $('#bookmark-url').val(),
//                 title: $('#bookmark-title').val(),
//                 note: $('#bookmark-note').val(),
//                 tags: $('#bookmark-tags').val(),
//                 userid: '1234567890'
//             },
//             dataType: 'json',
//         })
//         .success(function(bookmark){
//              console.log(bookmark);
//             $('#save-bookmark').hide();
//             $('#delete-bookmark').hide();
//             if(bookmark.id){
//                 $('#bookmark-id').val(bookmark.id);
//                 $('#bookmark-url').val(bookmark.url);
//                 $('#bookmark-title').val(bookmark.title);
//                 $('#bookmark-tags').val(bookmark.tags);
//                 $('#bookmark-note').val(bookmark.note);

//                 $('#bookmark-created_at').text(bookmark.created_at);
//                 $('#bookmark-updated_at').text(bookmark.updated_at);
//                 $('#bookmark-additional-info').show();

//                 //buttons
//                 $('#save-bookmark-button').show();
//                 $('#save-bookmark-button').text("Update");
//                 $('#delete-bookmark-button').show();

//                 addNotification('success','bookmark saved');
//             } else {
//                 $('#bookmark-url').val(chromeTab.url);
//                 $('#bookmark-title').val(chromeTab.title);
//                 $('#save-bookmark').show();
//             }

//         });
//     });
// }
//

// function searchForCurrentUrl(chromeTab){

//     chrome.storage.sync.get(['serverURL', 'username', 'password'], function (result) {
//         //TODO watch out: after fresh install, before saving the options, "result" could be empty

//         // In any case fills in the hidden form field "bookmark-url" with tab's URL
//         document.getElementById("bookmark-url").value = chromeTab.url;

//         var serverEndPointURL = result.serverURL + '/bookmark/search-by-url';

//         $.ajax({
//             method: "GET",
//             url: serverEndPointURL,
//             data: {
//                 userid: '1234567890',
//                 url: chromeTab.url
//             },
//             dataType: 'json',
//         })
//         .done(function(bookmark){
//             if (bookmark ) {
//                 $('#bookmark-additional-info').show();
//                 $('#bookmark-id').val(bookmark.id);
//                 $('#bookmark-title').val(bookmark.title);
//                 $('#bookmark-tags').val(bookmark.tags);
//                 $('#bookmark-note').val(bookmark.note);
//                 $('#bookmark-title').val(bookmark.title);
//                 $('#bookmark-created_at').text(bookmark.created_at);
//                 $('#bookmark-updated_at').val(bookmark.updated_at);

//                 //buttons
//                 $('#save-bookmark-button').show();
//                 $('#save-bookmark-button').text("Update");
//                 $('#delete-bookmark-button').show();

//             } else {
//                 $('#bookmark-title').val(chromeTab.title);
//             }
//         });

//     });
// }