$(document).ready(function () {
    function test() {
        $("#test").toggleClass("tested");
        // test function goes here, activated by "test" button
    };

    function testanimate() {
        animateSwap();
    };
    
    var itemHTML = '<div class="portlet"><div class="portlet-header"><div class="portlet-remove hidden">X</div></div><div class="portlet-content"><div class="displayContent"></div><textarea class="editContent hidden"></textarea></div></div>'
    var itemHTMLedit = '<div class="portlet"><div class="portlet-header"><div class="portlet-remove">X</div></div><div class="portlet-content"><div class="displayContent hidden"></div><textarea class="editContent"></textarea></div></div>'
    var tweetHTML= '<div>tweet</div>'
    
    //
    // jquery and jquery-ui commands
    //
    $(".holder").sortable({
        connectWith: ".holder",
        handle: ".portlet-header",
        placeholder: "portlet-placeholder"
    });

    //
    // called on scriptload to copy values from .edit to .display
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
    $(document).on('click', '#testanimate', function () {
        animateSwap();
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
    $(document).on('click', '#editanimate', function () {
        editModeAnimate();
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
        $(list).fadeOut(400, function () {
            reverseList();
            $(list).fadeIn(400);
        });
    };

    function deleteall() {
        $(".portlets").empty();
    };
    
    $( ".portlet-remove" ).click(function() {
    //    $(this).toggleClass('tested');
        $(this).parents('.portlet').fadeOut(400,function(){
            $(this).remove();
        });
    });
    
    function newentry() {
        if (activeEdit == true) {
            $(".portlets").append(itemHTMLedit);
        } else {
            $(".portlets").append(itemHTML);
        }
    };

    function emptytrash() {
        $(".trashcan").children('.portlet').remove();
    };

    function editModeAnimate() {
        activeEdit = !activeEdit;
        var $bar = $('.portlet-content');
        $bar.each(function () {
            $foo = $(this).children('.editContent').val();
            $(this).children('.displayContent').text($foo);
        });
        $bar.parent().fadeOut(400, function () {
            $bar.children('.editContent').toggleClass("hidden");
            $bar.children('.displayContent').toggleClass('hidden');
            $('.portlet-remove').toggleClass('hidden');
            $bar.parent().fadeIn(400)
        });
    };

    function editMode() {
        activeEdit = !activeEdit;
        var $bar = $('.portlet-content');
        $bar.each(function () {
            $foo = $(this).children('.editContent').val();
            $(this).children('.displayContent').text($foo);
        });

        $bar.children('.editContent').toggleClass("hidden");
        $bar.children('.displayContent').toggleClass('hidden');
        $('.portlet-remove').toggleClass('hidden');
    };


});