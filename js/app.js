$(document).ready(function () {
    function test() {
        $("#test").toggleClass("tested");
        // test function goes here, activated by "test" button
        animateSwap();
    };

    function test2() {
        reverseList();
    };
    var itemHTML = '<div class="portlet"><div class="portlet-header"></div><div class="portlet-content"><div class="displayContent"></div><textarea class="editContent hidden"></textarea></div></div>'
    var itemHTMLedit = '<div class="portlet"><div class="portlet-header"></div><div class="portlet-content"><div class="displayContent hidden"></div><textarea class="editContent"></textarea></div></div>'

    //
    // jquery and jquery-ui commands
    //
    $(".holder").sortable({
        connectWith: ".holder",
        handle: ".portlet-header",
        placeholder: "portlet-placeholder"
    });

    //
    // called on scriptload to copy value from .edit to .display
    //
    $('.portlet-content').each(function () {
        $foo = $(this).children('.displayContent').text();
        $(this).children('.editContent').val($foo);
    });
    
    //
    // button-function bindings
    //
    $(document).on('click', '#tester', function () {
        test();
    });
    $(document).on('click', '#tester2', function () {
        test2();
    });
    $(document).on('click', '#reverse', function () {
        reverseList();
    });

    $(document).on('click', '#delete', function () {
        deleteall();
    });

    $(document).on('click', '#new', function () {
        newentry();
    });

    $(document).on('click', '#remove', function () {
        emptytrash();
    });

    $(document).on('click', '#edit', function () {
        editMode();
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

    function animateSwap() {
        var list = $(".portlets>.portlet").get();
        $(list).toggle("slide", 600);
    };

    function deleteall() {
        $(".portlets").empty();
    };

    function newentry() {
        if ( activeEdit == true) {
            $(".portlets").append(itemHTMLedit);
        } else {
            $(".portlets").append(itemHTML);
        }
    };

    function emptytrash() {
        $(".trashcan").children('.portlet').remove();
    };    

    function editMode() {
        activeEdit = !activeEdit;
        $('.portlet-content').each(function () {
            $foo = $(this).children('.editContent').val();
            $(this).children('.displayContent').text($foo);
        });
        $('.editContent').toggleClass("hidden");
        $('.displayContent').toggleClass('hidden');
    };



});