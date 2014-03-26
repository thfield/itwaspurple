$(document).ready(function () {
    function test() {
        $("#test").toggleClass("tested");
        // test function goes here, activated by "test" button
        $('#test2').empty();
    };


    //
    // HTML snippits
    //
    var itemHTML = '<div class="card"><div class="card-header"><div class="card-remove hidden">X</div></div><div class="card-content"><div class="displayContent"></div><textarea class="editContent hidden"></textarea></div></div>'
    var itemHTMLedit = '<div class="card"><div class="card-header"><div class="card-remove">X</div></div><div class="card-content"><div class="displayContent hidden"></div><textarea class="editContent"></textarea></div></div>'


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
        var list = $(".cards>.card").get().reverse();
        $(".cards").empty();
        $.each(list, function (i) {
            $(".cards").append(list[i]);
        });
    };

    function reverseListAnimate() {
        $('.cards').fadeOut(400, function () {
            reverseList();
            $('.cards').fadeIn(400);
        });
    };

    function deleteall() {
        $(".cards").empty();
        $('.trashcan>.card').remove();
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
            $(".cards").append(itemHTMLedit);
        } else {
            $(".cards").append(itemHTML);
        }
        console.log(activeEdit);
    };

    function emptytrash() {
        $('.trashcan').children('.card').remove();
    };

    function editModeAnimate() {
        $('.card-content').fadeOut(400, function () {
            editMode();
            $('.card-content').fadeIn(400);
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
        $('#test2').empty();
        var entries = $(".cards>.card").clone();
        $.each(entries, function (i) {
            $("#test2").append(entries[i]);
        });
        entries.length = 0;
        
        $('#test2 .card-content').each(function () {
            $foo = $(this).children('.displayContent').text();
            $(this).children('.editContent').val($foo);
        });
    };



    function populate() {
        var entries = $('#test2>.card').get();
        $(".cards").empty();
        $.each(entries, function (i) {
            $(".cards").append(entries[i]);
        });
    }



});