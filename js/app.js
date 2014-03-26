$(document).ready(function () {
    function test() {
        $("#test").toggleClass("tested");
        // test function goes here, activated by "test" button
        $('#test2').empty();
    };


    //
    // HTML snippits
    //
    var itemHTML = '<div class="portlet"><div class="portlet-header"><div class="portlet-remove hidden">X</div></div><div class="portlet-content"><div class="displayContent"></div><textarea class="editContent hidden"></textarea></div></div>'
    var itemHTMLedit = '<div class="portlet"><div class="portlet-header"><div class="portlet-remove">X</div></div><div class="portlet-content"><div class="displayContent hidden"></div><textarea class="editContent"></textarea></div></div>'


    //
    // jquery and jquery-ui commands
    //
    $(".holder").sortable({
        connectWith: ".holder",
        handle: ".portlet-header",
        placeholder: "portlet-placeholder"
    });

    //
    // called on pageload to copy values from .edit to .display
    //
    $('.portlet-content').each(function () {
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
        editMode();
    });
    $(document).on('click', '.editanimate', function () {
        editModeAnimate();
    });
    $(document).on('click', '.reverse', function () {
        reverseList();
    });
    $(document).on('click', '.reverseanimate', function () {
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
        var list = $(".portlets>.portlet").get().reverse();
        $(".portlets").empty();
        $.each(list, function (i) {
            $(".portlets").append(list[i]);
        });
    };

    function reverseListAnimate() {
        $('.portlets').fadeOut(400, function () {
            reverseList();
            $('.portlets').fadeIn(400);
        });
    };

    function deleteall() {
        $(".portlets").empty();
    };

    function deleteLast() {
        $('.portlets>.portlet:last-of-type').fadeOut(400, function () {
            $(this).appendTo('.trashcan');
            $(this).fadeIn(400);
        });
    };

    // deleteThis
    $(".portlets").on("click", ".portlet-remove", function (event) { // .portlet-remove button binding is added to .portlets div so newly created portlets still have function
        $(this).parents('.portlet').fadeOut(400, function () {
            $(this).appendTo('.trashcan');
            $(this).fadeIn(400);
            //$(this).toggleClass('trashcan');
            //TODO change to use trashcan instead of $(this).remove() to keep portlet in DOM, so 'undelete' can happen
        });
    });

    function newentry() {
        if (activeEdit == true) {
            $(".portlets").append(itemHTMLedit);
        } else {
            $(".portlets").append(itemHTML);
        }
        console.log(activeEdit);
    };

    function emptytrash() {
        $(".trashcan").children('.portlet').remove();
    };

    function editModeAnimate() {
        $('.portlet-content').fadeOut(400, function () {
            editMode();
            $('.portlet-content').fadeIn(400);
        });
    };

    function editMode() {
        activeEdit = !activeEdit;
        var $bar = $('.portlet-content');
        $bar.each(function () {
            $foo = $(this).children('.editContent').val();
            $(this).children('.displayContent').text($foo);
        });

        $bar.children('.editContent').toggleClass('hidden');
        $bar.children('.displayContent').toggleClass('hidden');
        $('.portlet-remove').toggleClass('hidden');
    };

    //
    // file system functions 
    //
    function collect() {
        $('#test2').empty();
        var entries = $(".portlet").clone();
        $.each(entries, function (i) {
            $("#test2").append(entries[i]);
        });
        entries.length = 0;
        
        $('#test2 .portlet-content').each(function () {
            $foo = $(this).children('.displayContent').text();
            $(this).children('.editContent').val($foo);
        });
    };



    function populate() {
        var entries = $('#test2>.portlet').get();
        $(".portlets").empty();
        $.each(entries, function (i) {
            $(".portlets").append(entries[i]);
        });
    }



});