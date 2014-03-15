$(document).ready(function ( ) {
    findtotal();
    
    // toggle an option on
    $(document).on('click','.itemOption', function(){
        var me=$(this);
        var momdad=me.parent();
        momdad.siblings( ).removeClass('optionActive'); //remove class from the other options  
        momdad.addClass('optionActive');                //make current option active
        optionPrice();                                  //update price field
        findtotal();
    });
    
    // update the price field for current option price 
    // find every '.optionActive' optionContainer 
    // and set its sibling '.itemPrice' to the value of 
    // the child input[name=optionPrice]    
    function optionPrice() {
        $('.optionActive').each(function(){
            var setPrice = $(this).children('input[name=optionPrice]').val();
            $(this).siblings('.itemPrice').text(''+ setPrice);
        });
    };
    
    // activate an item (line)
    $(document).on('click','.itemName', function(){
        $(this).parents('.item').toggleClass('active');
        findtotal();
    });
    
    // get the prices for all active options 
    // find the sum and write to the 'total' div
    function findtotal( ) {
        var subtotal = 0;
        var total = 0;
        var countarray = [];
        var taxrate = $('.taxrate').text();
        $('.active>.itemPrice').each(function() {
            countarray.push(+($(this).text()))
        });
        for (var i = 0, j = countarray.length; i < j; i += 1) {  
            subtotal = subtotal + countarray[i];  
        };
        $('.subtotal').text(subtotal);
        var tax = Math.round((subtotal * taxrate/100) *100)/100;;
        $('.tax').text(tax);
        total = Math.round((tax + subtotal)*100)/100;
       // total = (tax + subtotal);
        $('.total').text(total);
    };
    
    // enter edit mode for an item    
    $(document).on('click','.itemEdit', function(){
        var me = $(this);
        var momdad = me.parent();
        
        //next 2 only needed if there is no value in the html on pageload, keeping in code for reference purposes        
            //read 'itemName' into itemName input value
        var nameContainer = me.siblings('.nameContainer');
        var name = nameContainer.children('.itemName').text();
        nameContainer.children('input[name=newItemName]').attr('value', name);
            //read 'optionName' into inputs
        var options = me.siblings('.optionContainer');
        options.each(function(){
            var optName = $(this).children('.itemOption').text();
            $(this).children('input[name=optionName]').attr('value', optName);
        });
        
        //change '.itemEdit' text() from "edit" to "done" and apply class '.doneEdit' for toggling
        me.text('done').addClass('doneEdit').removeClass('itemEdit');
        //hide class '.view'
        momdad.find('.view').hide(400, function(){
                //show class '.editing'
                momdad.find('.editing').show(200);
        });
    });

    //edit tax rate
    $(document).on('click','.taxEdit',function(){
        $(this).text('done').addClass('fileTax').removeClass('taxEdit');
        var rate = $('.taxrate').text();
        $('.taxEditing').attr('value', rate);
        //hide class '.view' (
        $('.taxView').hide(400, function(){
                //show class '.taxEditing' (input field)
                $('.taxEditing').show(200);
        });
    });
    
    //finish tax rate editing
    $(document).on('click','.fileTax',function(){
        var me =$(this);
        me.text('edit');
        //hide class '.view' (
        $('.taxEditing').hide(400, function(){
                //show class '.taxEditing' (input field)
                $('.taxView').show(200);
        });
        //read input field to html
        var taxRate = Math.round($('.taxEditing').val()*100)/100;;
        $('.taxrate').text(taxRate);
        //change classes
        me.text('edit').addClass('taxEdit').removeClass('fileTax');
        findtotal();
    });
    
// function to update optionName as soon as the input fields are edited
    $(document).on('change','input[name=optionName]',function(){
        var me = $(this);
        var newName = me.val();
        me.siblings('.itemOption').text(''+newName);     
    });
    
//function to update itemName as its input field is edited
    $(document).on('change','input[name=newItemName]',function(){
        var me = $(this);
        var newName = me.val();
        me.siblings('.itemName').text(''+newName);     
    });
      
// exit editing mode for item
    $(document).on('click','.doneEdit', function(){
        var me = $(this);
        var momdad = me.parent();
        //change '.itemEdit' text() from "done" to "edit" and remove class '.doneEdit'
        me.text('edit').removeClass('doneEdit').addClass('itemEdit');
        //hide class '.editing'
        momdad.find('.editing').hide('500', function(){
            //show class '.view'
            momdad.find('.view').show('fast')
        });
        ;
        optionPrice();
    });
    
//add another option to item    
    $(document).on('click','.addOption', function(){
        var optionHTML = '<div class="optionContainer"><div class="itemOption view" style="display: none;">New</div><input class="editing" type="text" name="optionName" value="New" style="display:inherit;" /><input class="itemOption editing" type="number" name="optionPrice" value="0" style="display:inherit;" /></div>';
        var where = $(this);
        $(optionHTML).hide().insertBefore(where).fadeIn();
    });
    
// remove the last option from item    
    $(document).on('click','.removeOption', function(){
        var toRemove = $(this).parent().children('.optionContainer').last();
        toRemove.fadeOut(function(){
            this.remove(); 
        });
    });
    
//add a new item (new row)
    $(document).on('click','.newItem', function(){
        var itemRow = '<div class="item"><div class="itemRemove editing" style="display:inherit;">-</div><div class="nameContainer"><div class="itemName view" style="display:none;">New</div><input class="editing" style="display:inherit;" type="text" name="newItemName" value="New" /></div><div class="itemEdit doneEdit">done</div><div class="optionContainer optionActive"><div class="itemOption view" style="display:none;">New</div><input class="editing" style="display:inherit;" type="text" name="optionName" value="New" /><input class="editing" style="display:inherit;" type="number" name="optionPrice" value="0" /></div><div class="addOption editing" style="display:inherit;">Add</div><div class="removeOption editing" style="display:inherit;">Remove</div><div class="spacer"></div><div class="itemPrice">0</div></div>';
        var where= $(this).parent();
        $(itemRow).hide().insertBefore(where).slideDown(); 
    });
    
//remove an item (remove row)
    $(document).on('click','.itemRemove', function(){
        var itemRow = $(this).parent('.item');
   //     what.hide("drop", { direction: "down" }, "slow");
        itemRow.slideUp('slow', function(){
            itemRow.remove();
        });
    });

//testing button  
//    $(document).on('click','.testButton', function(){
    $( ".testButton" ).click(function() {
        $( '#foo' ).toggle( 'fade' );
    });
});