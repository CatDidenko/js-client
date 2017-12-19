$(document).ready(function() {
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > $("#articles").height() && !articles.busy) {
        articles.busy = true;
        articles.offset += 15;
        articles.indexAction();
        }
    });
});

$(".sortable").click(function(){
    articles.typeOfSorting = $(this).hasClass('asc') ? 'desc' : 'asc';
    $('.sortable').removeClass('asc').removeClass('desc');
    $(this).addClass(articles.typeOfSorting);
    articles.columnForSorting = $(this).html().toLowerCase();

    articles.posts.sort(articles.Sorting(articles.columnForSorting, articles.typeOfSorting));
    articles.viewTable();
});

ArticleController.prototype.Sorting = function(column, orderBy) {
     var sortOrder = (orderBy=='asc')? 1 : -1;
        return function (a,b) {
            var result = (a[column] < b[column]) ? -1 : (a[column] > b[column]) ? 1 : 0;
            return result * sortOrder;
        }
}

ArticleController.prototype.Search = function(){
    var searchField = $('#search').val();
    var myExp = new RegExp(searchField, 'i');
    var output = '';
    $.each(articles.posts, function(key, value){
        if((value.title.search(myExp)!=-1)||(value.content.search(myExp)!=-1)||value.author.search(myExp)!=-1){
              output += '<tr id="'+ value.id +'">';
                output += '<td>' + value.id + '</td>';
                output += '<td>' + value.title + '</td>';
                output += '<td>' + value.content + '</td>';
                output += '<td>' + value.author + '</td>';
                output += '<td>' + articles.GetTime(value.creation_date) + '</td>';
                output += '<td>'+
                  '<button type="button" class="material-icons" onclick="articles.editAction('+value.id+')">edit</button>' +
                  '<button type="button" class="material-icons" onclick="articles.deleteAction('+value.id+')">delete</button>' +
                  '</td>';
        output += '</tr>';
        }
    });
    $('#articles').html(output);
}



