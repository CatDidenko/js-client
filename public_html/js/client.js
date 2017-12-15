//var Article = function(title, content, author, created_date){
//    this.title = title;
//    this.content = content;
//    this.author = author;
//    this.created_date = created_date;
//
//}

ArticleController.prototype.getAllArticles = function(){
    var url = 'http://dcodeit.net/didenko_ekaterina/api/posts';
    $.ajax({
        url : url,
        method : 'GET',
        dataType: 'json',
        username: 'admin',
        password: 'admin',
        success: articles.viewTable
    });
}

ArticleController.prototype.addArticle = function(title, content, author){
    var url = 'http://dcodeit.net/didenko_ekaterina/api/post';
    $.ajax({
        url : url,
        method : 'POST',
        username: 'admin',
        password: 'admin',
        data: {
            title:title,
            content: content,
            author: author
        }
    }).done(this.indexAction);
}

ArticleController.prototype.deleteArticle = function(id){
    var url = 'http://dcodeit.net/didenko_ekaterina/api/post/'+ id;
    $.ajax({
        url : url,
        method : 'DELETE',
        username: 'admin',
        password: 'admin'
        }).done(this.getAllArticles);
}

ArticleController.prototype.editArticle = function(id,title, content, author){
    var url = 'http://dcodeit.net/didenko_ekaterina/api/post/'+ id;
    $.ajax({
        url : url,
        method : 'PUT',
        username: 'admin',
        password: 'admin',
        data: {
            title:title,
            content: content,
            author: author,
        }
        }).done(this.indexAction);
}

ArticleController.prototype.viewTable = function(data){
    var output = '';
    for (var key in data){
        output += '<tr id="'+ data[key].id +'">';
        output += '<td>' + data[key].id + '</td>';
        output += '<td>' + data[key].title + '</td>';
        output += '<td>' + data[key].content + '</td>';
        output += '<td>' + data[key].author + '</td>';
        output += '<td>' + articles.UpdateTime(data[key].creation_date) + '</td>';
        output += '<td>'+
                  '<button type="button" class="material-icons" onclick="articles.editAction('+data[key].id+')">edit</button>' +
                  '<button type="button" class="material-icons" onclick="articles.deleteAction('+data[key].id+')">delete</button>' +
                  '</td>';
        output += '</tr>';
    }
    $('#articles').html(output);
    articles.posts = data;
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

ArticleController.prototype.UpdateTime = function(creation_date){

    var seconds = Math.floor(((new Date().getTime()/1000) - creation_date)),
    interval = Math.floor(seconds / 31536000);

    if (interval > 1) return interval + "yers ago";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " month ago";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " days ago";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hours ago";

    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
}


function ArticleController() {
    this.posts;
    this.indexAction = function() {
        $('#addArcticle').hide();
        $('#articleTable').show();
        articles.getAllArticles();
    };

    this.addAction = function() {
        $('#articleTable').hide();
        $('#addArcticle').show();
        $('#add').click(function(){
            title = $('#title').val();
            content = $('#content').val();
            author = $('#author').val();
            articles.addArticle(title, content, author);
        });
    };

    this.deleteAction = function(id) {
        this.deleteArticle(id);
    };

    this.editAction = function(id) {
        $('#articleTable').hide();
        $('#addArcticle').show();

        var article = document.getElementById(''+id);
        $('#title').val("" + article.cells[1].innerHTML);
        $('#content').val("" + article.cells[2].innerHTML);
        $('#author').val("" + article.cells[3].innerHTML);
        id = article.cells[0].innerHTML;
        $('#add').click(function(){
            title = $('#title').val();
            content = $('#content').val();
            author = $('#author').val();
            articles.editArticle(id, title, content, author);
        });
    };
}

var articles = new ArticleController();
articles.indexAction();

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



