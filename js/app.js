$(document).ready(function () {
    function test() {
        $("#test").toggleClass("tested");
        // test function goes here, activated by "test" button
         $('#test2').empty();
    };

    /*    function testanimate() {
        animateSwap();
    };
*/
    
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
        $('.portlet:last-of-type').fadeOut(400,function() {
            $(this).remove();
        });
    };

    // portlet-remove button binding is added to .portlets div so newly created portlets still have function
    $(".portlets").on("click", ".portlet-remove", function (event) {
        // deleteportlet();
        //$(this).toggleClass('tested');
        //$(this).parents('.portlet').remove();
        $(this).parents('.portlet').fadeOut(400, function () {
            $(this).remove();
            //$(this).toggleClass('trashcan');
            // use instead of .remove() to keep portlet in DOM, so 'undelete' can happen
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

    function collect() {
        $('#test2').empty();
        var entries = $(".displayContent").clone();
        $.each(entries, function (i) {
            $("#test2").append(entries[i]);
        }); 
        entries.length=0;/**/
        //$('#test2').text(entries);
        
    };
    
    
    //
    // file system functions 
    //
        

});