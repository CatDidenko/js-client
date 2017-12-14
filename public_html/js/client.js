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
    }).done(this.getAllArticles);
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
            author: author
        }
        }).done(this.getAllArticles);
}

ArticleController.prototype.addForm = function(){
     output += '<tr id="'+ data[key].id +'">';
        output += '<td>' + data[key].id + '</td>';
        output += '<td>' + data[key].title + '</td>';
        output += '<td>' + data[key].content + '</td>';
        output += '<td>' + data[key].author + '</td>';
        output += '<td>' + data[key].creation_date + '</td>';
        output += '<td>'+
                  '<button type="button" class="material-icons" onclick="articles.editAction('+data[key].id+')">edit</button>' +
                  '<button type="button" class="material-icons" onclick="articles.deleteAction('+data[key].id+')">delete</button>' +
                  '</td>';
        output += '</tr>';
}

ArticleController.prototype.editForm = function(){

}

ArticleController.prototype.viewTable = function(data){
    var output = '';
    for (var key in data){
        output += '<tr id="'+ data[key].id +'">';
        output += '<td>' + data[key].id + '</td>';
        output += '<td>' + data[key].title + '</td>';
        output += '<td>' + data[key].content + '</td>';
        output += '<td>' + data[key].author + '</td>';
        output += '<td>' + data[key].creation_date + '</td>';
        output += '<td>'+
                  '<button type="button" class="material-icons" onclick="articles.editAction('+data[key].id+')">edit</button>' +
                  '<button type="button" class="material-icons" onclick="articles.deleteAction('+data[key].id+')">delete</button>' +
                  '</td>';
        output += '</tr>';
    }
    articles.posts = data;
    $('#articles').html(output);
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
                output += '<td>' + value.creation_date + '</td>';
                output += '<td>'+
                  '<button type="button" class="material-icons" onclick="articles.editAction('+value.id+')">edit</button>' +
                  '<button type="button" class="material-icons" onclick="articles.deleteAction('+value.id+')">delete</button>' +
                  '</td>';
        output += '</tr>';
        }
    });
    $('#articles').html(output);
}


function ArticleController() {
    this.posts;
    this.indexAction = function() {
        this.getAllArticles();
    };

    this.addAction = function() {
        $('#articleTable').hide();
        $('#addArcticle').show();
        $('#add').click(function(){
            title = $('#title').val();
            content = $('#content').val();
            author = $('#author').val();
            articles.addArticle(title, content, author);
        })
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
        })
    };
}

var articles = new ArticleController();
articles.indexAction();
$('#addArcticle').hide();



