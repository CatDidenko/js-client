//var Article = function(title, content, author, created_date){
//    this.title = title;
//    this.content = content;
//    this.author = author;
//    this.created_date = created_date;
//
//}

ArticleController.prototype.getAllArticles = function(){

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://dcodeit.net/didenko_ekaterina/api/posts', true);
    xhr.onreadystatechange = function(){
          if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var items = JSON.parse(xhr.responseText);
            var output = '';
            for (var key in items){
                output += '<tr>';
                output += '<td>' + items[key].id + '</td>';
                output += '<td>' + items[key].title + '</td>';
                output += '<td>' + items[key].content + '</td>';
                output += '<td>' + items[key].author + '</td>';
                output += '<td>' + items[key].creation_date + '</td>';
                output += '<td>'+
                '<a href="#"><i class="material-icons">edit</i></a>' +
                '<a href="#" class="col-lg-1"><i class="material-icons">delete</i></a>' +
                '</td>';
                output += '</tr>'
            }
            document.getElementById('articles').innerHTML = output;
        };
    };
    xhr.send();
}

function ArticleController() {
    this.indexAction = function() {
    this.getAllArticles();
    };
};

var articles = new ArticleController();
articles.indexAction();
//
//Article.prototype.addArticle = function(){
//
//}
//
//Article.prototype.editArticle = function(id){
//
//}
//
//Article.prototype.removeArticle = function(id){
//
//}
//
////Article.prototype.getArticleById = function(){
////    var xhr = new XMLHttpRequest();
////    xhr.open('GET', 'http://dcodeit.net/didenko_ekaterina/api/post/27', true);
////    xhr.setRequestHeader('Authorization', 'Basic' + btoa('admin:admin'));
////    xhr.send();
////}
//
//var Articles = function(){
//    var articles = [];
//}



//function getAllArticles(){
//    var xhr = new XMLHttpRequest();
//    xhr.open('GET', 'http://dcodeit.net/didenko_ekaterina/api/posts', true);
//    xhr.onreadystatechange = function(){
//          if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//            var items = JSON.parse(xhr.responseText);
//            var output = '';
//            for (var key in items){
//                output += '<tr>';
//                output += '<td>' + items[key].id + '</td>';
//                output += '<td>' + items[key].title + '</td>';
//                output += '<td>' + items[key].content + '</td>';
//                output += '<td>' + items[key].author + '</td>';
//                output += '<td>' + items[key].creation_date + '</td>';
//                output += '<td>'+
//                '<a href="#"><i class="material-icons">edit</i></a>' +
//                '<a href="#" class="col-lg-1"><i class="material-icons">delete</i></a>' +
//                '</td>';
//                output += '</tr>'
//            }
//            document.getElementById('articles').innerHTML = output;
//        };
//    };
//    xhr.send();
//}
//
//createArticle();

