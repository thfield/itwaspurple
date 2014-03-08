  $(document).ready(function () {
      function test() {
          $("#test").toggleClass("tested");
      }; /* */

      $(".column").sortable({
          connectWith: ".holder",
          handle: ".portlet-header",
          cancel: ".portlet-toggle",
          placeholder: "portlet-placeholder ui-corner-all"
      });

      $(".portlet")
          .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
          .find(".portlet-header")
          .addClass("ui-widget-header ui-corner-all");
      
      $(document).on('click', '#tester', function () {
          test();
      });
      $(document).on('click', '#reverse', function () {
          reverse();
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

      function reverse() {
          var list = $(".portlets>.portlet").get().reverse();
          $(".portlets").empty();
          $.each(list, function (i) {
              $(".portlets").append(list[i]);
          });
      };

      function deleteall() {
          $(".portlets").empty();
      };

      function newentry() {
          $(".portlets").append(itemHTML);
      };

      function emptytrash() {
          $(".trashcan").children('.portlet').remove();
      };

      var itemHTML = '<div class="portlet"><div class="portlet-header unselectable">New</div><div class="portlet-content">123456789 </div></div>'

  });