var Article = function(id = null, title = null, content = null, author = null, creating_date = null,){
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.creating_date = creating_date;
}

ArticleController.prototype.getAllArticles = function(){
    var url = 'http://dcodeit.net/didenko_ekaterina/api/posts';
    $.ajax({
        url : url,
        method : 'GET',
        dataType: 'json',
        username: 'admin',
        password: 'admin',
        success: function (data){
             for (var key in data){
                var article = new Article();
                article.id = data[key].id;
                article.title = data[key].title;
                article.content = data[key].content;
                article.author = data[key].author;
                article.creating_date = data[key].creation_date;
                articles.posts.push(article);
            }
        }
    }).done(this.viewTable);
}

ArticleController.prototype.addArticle = function(title, content, author){
    var url = 'http://dcodeit.net/didenko_ekaterina/api/post';
    $.ajax({
        url : url,
        method : 'POST',
        username: 'admin',
        password: 'admin',
        dataType: 'json',
        data: {
            title:title,
            content: content,
            author: author
        },
        success: function(data) {
            var article = new Article();
                article.id = data.id;
                article.title = title;
                article.content = content;
                article.author = author;
                article.creating_date = data.creation_date;
                articles.posts.push(article);
        }
    }).done(this.viewTable);
}

ArticleController.prototype.deleteArticle = function(id){
    var url = 'http://dcodeit.net/didenko_ekaterina/api/post/'+ id;
    $.ajax({
        url : url,
        method : 'DELETE',
        username: 'admin',
        password: 'admin',
          success: function() {
            for (var key in articles.posts){
                if(articles.posts[key].id == id){
                    delete articles.posts[key];
                }
            }
        }
        }).done(this.viewTable);
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
        },
        success: function() {
                    for (var key in articles.posts){
                        if(articles.posts[key].id == id){
                            articles.posts[key].title = title;
                            articles.posts[key].content = content;
                            articles.posts[key].author = author;
                        }
                    }
                }
        }).done(articles.viewTable);
}

ArticleController.prototype.viewTable = function(){
    $('#addArcticle').hide();
    $('#articleTable').show();
    var data = articles.posts;
    var output = '';
    for (var key in data){
        output += '<tr id="'+ data[key].id +'">';
        output += '<td>' + data[key].id + '</td>';
        output += '<td>' + data[key].title + '</td>';
        output += '<td>' + data[key].content + '</td>';
        output += '<td>' + data[key].author + '</td>';
        output += '<td>' + articles.UpdateTime(data[key].creating_date) + '</td>';
        output += '<td>'+
                  '<button type="button" class="material-icons" onclick="articles.editAction('+data[key].id+')">edit</button>' +
                  '<button type="button" class="material-icons" onclick="articles.deleteAction('+data[key].id+')">delete</button>' +
                  '</td>';
        output += '</tr>';
    }
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
    this.posts = [];
    this.post_id;
    
    this.indexAction = function() {
        articles.getAllArticles();
    };

    this.addAction = function() {
        $('#articleTable').hide();
        $('#edit').hide();
        $('#add').show();
        $('#addArcticle').show();
        document.getElementById("addArcticle").reset();
    };

    this.editAction = function(id) {
        this.post_id = id;
        $('#articleTable').hide();
        $('#add').hide();
        $('#edit').show();
        $('#addArcticle').show();
        var article = document.getElementById(''+id);

        $('#title').val("" + article.cells[1].innerHTML);
        $('#content').val("" + article.cells[2].innerHTML);
        $('#author').val("" + article.cells[3].innerHTML);
    };

    this.deleteAction = function(id) {
        this.deleteArticle(id);
    };

    $('#add').click(function(){
        title = $('#title').val();
        content = $('#content').val();
        author = $('#author').val();
        articles.addArticle(title, content, author);
    });

    $('#edit').click(function(){
        title = $('#title').val();
        content = $('#content').val();
        author = $('#author').val();
        articles.editArticle(articles.post_id, title, content, author);
    });
}

var articles = new ArticleController();
articles.indexAction();

$(document).ready(function() {

$(window).scroll(function() {
    if ($(window).scrollTop() + $(window).height() > $("#articles").height() && !busy) {
    busy = true;
    articles.indexAction(offset);
    }
});
});



