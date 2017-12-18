$(".sortable").click(function(){
    var o = $(this).hasClass('asc') ? 'desc' : 'asc';
    $('.sortable').removeClass('asc').removeClass('desc');
    $(this).addClass(o);

    var colIndex = $(this).prevAll().length;
    var tbod = $(this).closest("table").find("tbody");
    var rows = tbod.find("tr");

    rows.sort(function(a,b){
        var A = $(a).find("td").eq(colIndex).text();
        var B = $(b).find("td").eq(colIndex).text();

        if (!isNaN(A)) A = Number(A);
        if (!isNaN(B)) B = Number(B);

        return o == 'asc' ? A > B : B > A;
    });

    $.each(rows, function(index, ele){
        tbod.append(ele);
    });
});

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
                output += '<td>' + articles.UpdateTime(value.creation_date) + '</td>';
                output += '<td>'+
                  '<button type="button" class="material-icons" onclick="articles.editAction('+value.id+')">edit</button>' +
                  '<button type="button" class="material-icons" onclick="articles.deleteAction('+value.id+')">delete</button>' +
                  '</td>';
        output += '</tr>';
        }
    });
    $('#articles').html(output);
}

