$(document).ready(function () {
    function test() {
        $("#test").toggleClass("tested");
        // test function goes here, activated by "test" button
        $('#staging').empty();
    };


    //
    // HTML snippits
    //
    var itemHTML = '<div class="card"><div class="card-header"><img src="images/delete-small.png" class="card-remove hidden"/></div><div class="card-content"><div class="displayContent"></div><textarea class="editContent hidden"></textarea></div></div>'
    var itemHTMLedit = '<div class="card"><div class="card-header"><img src="images/delete-small.png" class="card-remove"/></div><div class="card-content"><div class="displayContent hidden"></div><textarea class="editContent"></textarea></div></div>'


    //
    // jquery and jquery-ui commands
    //
    $(".holder").sortable({
        connectWith: ".holder",
        handle: ".card-header",
        placeholder: "card-placeholder"
    });

    //
    // called on pageload to copy values from .edit to .display
    //
    $('.card-content').each(function () {
        $foo = $(this).children('.displayContent').text();
        $(this).children('.editContent').val($foo);
    });

    //
    // button-function bindings
    //
    $(document).on('click', '.add', function () {
        newentry();
    });
    $(document).on('click', '.edit', function () {
        editModeAnimate();
    });
    
    $(document).on('click', '.reverse', function () {
        reverseListAnimate();
    });
    
    $(document).on('click', '.delete', function () {
        deleteall();
    });
    $(document).on('click', '.tester', function () {
        test();
    });
    $(document).on('click', '.remove', function () {
        emptytrash();
    });
    $(document).on('click', '.subtract', function () {
        deleteLast();
    });
    $(document).on('click', '.save', function () {
        collect();
    });
    $(document).on('click', '.load', function () {
        populate();
    });

    //
    // control functions      
    //
    var activeEdit = false;

    function reverseList() {
        var list = $(".cards>.card").get().reverse();
        //$(".cards").empty();
        $.each(list, function (i) {
            $("#cardsEnd").before(list[i]);
        });
    };

    function reverseListAnimate() {
        $('.cards').fadeOut(400, function () {
            reverseList();
            $('.cards').fadeIn(400);
        });
    };

    function deleteall() {
        /*$(".cards>.card").remove();
        $('.trashcan>.card').remove();*/
        $('.card').remove();
        filenameInput.value = '';
    };

    function deleteLast() {
        $('.cards>.card:last-of-type').fadeOut(400, function () {
            $(this).appendTo('.trashcan');
            $(this).fadeIn(400);
        });
    };

    // deleteThis
    $(".cards").on("click", ".card-remove", function (event) { // .card-remove button binding is added to .cards div so newly created cards still have function
        $(this).parents('.card').fadeOut(400, function () {
            $(this).appendTo('.trashcan');
            $(this).fadeIn(400);
            //$(this).toggleClass('trashcan');
            //TODO change to use trashcan instead of $(this).remove() to keep card in DOM, so 'undelete' can happen
        });
    });

    function newentry() {
        if (activeEdit == true) {
            $("#cardsEnd").before(itemHTMLedit);
        } else {
            $("#cardsEnd").before(itemHTML);
        };
        
    };

    function emptytrash() {
        $('.trashcan').children('.card').remove();
    };

    function editModeAnimate() {
        var $bar = $('.card-content');
        $bar.fadeOut(400, function () {
            editMode();
            $bar.fadeIn(400);
        });
    };

    function editMode() {
        activeEdit = !activeEdit;
        var $bar = $('.card-content');
        $bar.each(function () {
            $foo = $(this).children('.editContent').val();
            $(this).children('.displayContent').text($foo);
        });

        $bar.children('.editContent').toggleClass('hidden');
        $bar.children('.displayContent').toggleClass('hidden');
        $('.card-remove').toggleClass('hidden');
    };


    //
    // file system functions 
    //
    function collect() {
        $('#staging').empty();
        var entries = $(".cards>.card").clone();
        $.each(entries, function (i) {
            $("#staging").append(entries[i]);
        });
        entries.length = 0;
        $('#staging .card-content').each(function () {
            $foo = $(this).children('.displayContent').text();
            $(this).children('.editContent').val($foo);
        });
    };

    function populate() {
        var entries = $('#staging>.card').get();
        $(".cards").empty();
        $.each(entries, function (i) {
            $(".cards").append(entries[i]);
        });
        filenameInput.value = '';
    }

    // ADAPTED FROM http://blog.teamtreehouse.com/building-an-html5-text-editor-with-the-filesystem-apis

    // Allow for vendor prefixes.
    window.requestFileSystem = window.requestFileSystem ||
        window.webkitRequestFileSystem;

    // Create a variable that will store a reference to the FileSystem.
    var filesystem = null;

    // Get references to the page elements.
    var form = document.getElementById('file-form');
    var filenameInput = document.getElementById('filename');
    var contentText = document.getElementById('staging');
    var fileList = document.getElementById('file-list');
    var messageBox = document.getElementById('messages');

    // A simple error handler to be used throughout this demo.
    function errorHandler(error) {
        var message = '';

        switch (error.code) {
        case FileError.SECURITY_ERR:
            message = 'Security Error';
            break;
        case FileError.NOT_FOUND_ERR:
            message = 'Not Found Error';
            break;
        case FileError.QUOTA_EXCEEDED_ERR:
            message = 'Quota Exceeded Error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            message = 'Invalid Modification Error';
            break;
        case FileError.INVALID_STATE_ERR:
            message = 'Invalid State Error';
            break;
        default:
            message = 'Unknown Error';
            break;
        }
        console.log(message);
    }

    // Request a FileSystem and set the filesystem variable.
    function initFileSystem() {
        navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5,
            function (grantedSize) {
                // Request a file system with the new size.
                window.requestFileSystem(window.PERSISTENT, grantedSize, function (fs) {
                    // Set the filesystem variable.
                    filesystem = fs;
                    // Setup event listeners on the form.
                    setupFormEventListener();
                    // Update the file browser.
                    listFiles();
                }, errorHandler);
            }, errorHandler);
    }

    function loadFile(filename) {
        filesystem.root.getFile(filename, {}, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    // Update the form fields.
                    filenameInput.value = filename;
                    //contentText.value = this.result;
                    contentText.innerHTML = this.result;
                };
                reader.readAsText(file);
            }, errorHandler);
        }, errorHandler);
    }

    function displayEntries(entries) {
        // Clear out the current file browser entries.
        fileList.innerHTML = '';
        entries.forEach(function (entry, i) {
            var li = document.createElement('li');

            var link = document.createElement('input');
            link.type = 'radio';
            link.name = 'files';
            link.className = 'edit-file';
            li.appendChild(link);

            var namelink = document.createElement('a');
            namelink.innerHTML = entry.name;
            namelink.className = 'name-file';
            li.appendChild(namelink);

            var delLink = document.createElement('img');
            delLink.src = 'images/delete-small.png';
            delLink.className = 'delete-file';
            li.appendChild(delLink);

            fileList.appendChild(li);

            // Setup an event listener that will load the file when the link
            // is clicked.
            link.addEventListener('click', function (e) {
                e.preventDefault();
                loadFile(entry.name);
            });

            // Setup an event listener that will delete the file when the delete link
            // is clicked.
            delLink.addEventListener('click', function (e) {
                e.preventDefault();
                deleteFile(entry.name);
            });
        });
    }


    function listFiles() {
        var dirReader = filesystem.root.createReader();
        var entries = [];

        var fetchEntries = function () {
            dirReader.readEntries(function (results) {
                if (!results.length) {
                    displayEntries(entries.sort().reverse());
                } else {
                    entries = entries.concat(results);
                    fetchEntries();
                }
            }, errorHandler);
        };

        fetchEntries();
    }

 

    // Save a file in the FileSystem.
    function saveFile(filename, content) {
        filesystem.root.getFile(filename, {
            create: true
        }, function (fileEntry) {

            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function (e) {
                    // Update the file browser.
                    listFiles();

                    // Clean out the form field.
                    filenameInput.value = '';
                    //contentText.value = '';
                    contentText.innerHTML = '';

                    // Show a saved message.
                    messageBox.innerHTML = 'File saved!';
                };

                fileWriter.onerror = function (e) {
                    console.log('Write error: ' + e.toString());
                    alert('An error occurred and your file could not be saved!');
                };

                var contentBlob = new Blob([content], {
                    type: 'text/plain'
                });

                fileWriter.write(contentBlob);

            }, errorHandler);

        }, errorHandler);
    }


    function deleteFile(filename) {
        filesystem.root.getFile(filename, {
            create: false
        }, function (fileEntry) {

            fileEntry.remove(function (e) {
                // Update the file browser.
                listFiles();

                // Show a deleted message.
                messageBox.innerHTML = 'File deleted!';
            }, errorHandler);

        }, errorHandler);
    }

    // Add event listeners on the form.
    function setupFormEventListener() {

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // write the cards to the staging area
            collect();
            // Get the filename data.
            var filename = filenameInput.value;
            // Get the content
            var content = contentText.innerHTML;

            // Save the file.
            saveFile(filename, content);

        });

    }

    // Start the app by requesting a FileSystem (if the browser supports the API)
    if (window.requestFileSystem) {
        initFileSystem();
    } else {
        alert('Sorry! Your browser doesn\'t support the FileSystem API :(');
    }

    //end fs
    //
});