    /**
    * Article entity
    */
    var Article = function(){
        this.id;
        this.title;
        this.content;
        this.author;
        this.creation_date;
    }
    /*
     * Work with article list
     */
    var ArticlesList = function(){
        var posts = [];

            this.getAllArticles = function(offset, callback){
            var url = 'http://dcodeit.net/didenko_ekaterina/api/posts/'+ offset;
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
                        article.creation_date = data[key].creation_date;

                       posts.push(article);
                    }
                }
            }).done(callback);
        };

        this.getArticleList = function(){
            return posts;
        };

        this.addArticle = function(title, content, author, callback){
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
                        article.creation_date = data.creation_date;

                        posts.push(article);
                }
            }).done(callback);
        };

        this.viewTable = function(){
            $('#addArcticle').hide();
            $('#articleTable').show();
            var output = '';
            for (var key in posts){
                output += '<tr id="'+ posts[key].id +'">';
                output += '<td>' + posts[key].id + '</td>';
                output += '<td>' + posts[key].title + '</td>';
                output += '<td>' + posts[key].content + '</td>';
                output += '<td>' + posts[key].author + '</td>';
                output += '<td>' + this.GetTime(posts[key].creation_date) + '</td>';
                output += '<td>'+
                          '<button type="button" class="material-icons" onclick="controller.showEdit('+posts[key].id+')">edit</button>' +
                          '<button type="button" class="material-icons" onclick="controller.deleteAction('+posts[key].id+')">delete</button>' +
                          '</td>';
                output += '</tr>';
            }
            $('#articles').html(output);
        };

        this.deleteArticle = function(id, callback){
            var url = 'http://dcodeit.net/didenko_ekaterina/api/post/'+ id;
            $.ajax({
                url : url,
                method : 'DELETE',
                username: 'admin',
                password: 'admin',
                  success: function() {
                    for (var key in posts){
                        if(posts[key].id == id){
                            delete posts[key];
                        }
                    }
                }
                }).done(callback);
        };

        this.editArticle = function(id,title, content, author, callback){
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
                            for (var key in posts){
                                if(posts[key].id == id){
                                    posts[key].title = title;
                                    posts[key].content = content;
                                    posts[key].author = author;
                                }
                            }
                        }
                }).done(callback);
            }
        };

    /*
     * Date format
     */
    ArticlesList.prototype.GetTime = function(creation_date){
        var seconds = Math.floor(((new Date().getTime()/1000) - creation_date));
        interval = Math.floor(seconds / 31536000);

        if (interval > 1) return interval + "yers ago";

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + " month ago";

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " days ago";

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hours ago";

        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " minutes ago";

        return Math.abs(seconds) + " seconds ago";
    }

    /*
     * Update datetime every 7 seconds
     */
    ArticlesList.prototype.UpdateTime = function(){
        for (var key in articles){
            var time = this.GetTime(articles[key].creation_date);
            $('td', $('#'+articles[key].id)).eq(4).html(time);
        }
    }

    /*
     * Sorting article list
     */
    ArticlesList.prototype.Sorting = function(column, orderBy) {
         var sortOrder = (orderBy=='asc')? 1 : -1;
            return function (a,b) {
                var result = (a[column] < b[column]) ? -1 : (a[column] > b[column]) ? 1 : 0;
                return result * sortOrder;
            }
    }

    ArticleController.list = new ArticlesList();
    var articles = ArticleController.list.getArticleList();

    /*
     * Controller for work with articles
     */
    function ArticleController(){
        this.busy = false;
        this.offset = 0;
        this.columnForSorting = 'id';
        this.typeOfSorting = 'asc';

        var post_id;

        this.indexAction = function() {
            ArticleController.list.getAllArticles(controller.offset, function(){
               articles.sort(ArticleController.list.Sorting(controller.columnForSorting, controller.typeOfSorting));
                ArticleController.list.viewTable();
            });
        };
    };

    /*
     * Add new article in db
     */
    ArticleController.prototype.addAction = function(id) {
        title = $('#title').val();
        content = $('#content').val();
        author = $('#author').val();
        if(controller.checkForm(title, content, author)){
            ArticleController.list.addArticle(title, content, author, function(){
                articles.sort(ArticleController.list.Sorting(controller.columnForSorting, controller.typeOfSorting));
                ArticleController.list.viewTable();
            });
        } else {
            controller.addAction();
        }
    }

    /*
     * Edit article
     */
    ArticleController.prototype.editAction = function() {
        title = $('#title').val();
        content = $('#content').val();
        author = $('#author').val();
        if(controller.checkForm(title, content, author)){
            ArticleController.list.editArticle(post_id, title, content, author, function(){
                articles.sort(ArticleController.list.Sorting(controller.columnForSorting, controller.typeOfSorting));
                 ArticleController.list.viewTable();
            });
        } else {
            controller.editAction(post_id);
        }
    }
    /*
     * Delete article
     */
    ArticleController.prototype.deleteAction = function(id) {
        ArticleController.list.deleteArticle(id, function(){
            articles.sort(ArticleController.list.Sorting(controller.columnForSorting, controller.typeOfSorting));
            ArticleController.list.viewTable();
        });
    };

    /*
     * Live search
     */
    ArticleController.prototype.Search = function() {
        var searchField = $('#search').val();
        var myExp = new RegExp(searchField, 'i');
        var output = '';
        $.each(articles, function(key, value){
            if((value.title.search(myExp)!=-1)||(value.content.search(myExp)!=-1)||value.author.search(myExp)!=-1){
                  output += '<tr id="'+ value.id +'">';
                    output += '<td>' + value.id + '</td>';
                    output += '<td>' + value.title + '</td>';
                    output += '<td>' + value.content + '</td>';
                    output += '<td>' + value.author + '</td>';
                    output += '<td>' + ArticleController.list.GetTime(value.creation_date) + '</td>';
                    output += '<td>'+
                      '<button type="button" class="material-icons" onclick="controller.showEdit('+value.id+')">edit</button>' +
                      '<button type="button" class="material-icons" onclick="controller.deleteAction('+value.id+')">delete</button>' +
                      '</td>';
            output += '</tr>';
            }
        });
        $('#articles').html(output);
    };

    /*
     * Check the form for correctness
     * of the entered data
     */
    ArticleController.prototype.checkForm = function(title, content, author) {
        if((title === "") || (content === "") || (author === "")){
            alert("Заполните корректно форму");
            return false;
        }
        return true;
    }

     /*
     * Show a form for adding
     */
    ArticleController.prototype.showAdd = function() {
        $('#articleTable').hide();
        $('#edit').hide();
        $('#add').show();
        $('#addArcticle').show();
        document.getElementById("addArcticle").reset();
    };

    /*
     * Show a form for edit
     */
    ArticleController.prototype.showEdit = function(id) {
        post_id = id;
        $('#articleTable').hide();
        $('#add').hide();
        $('#edit').show();
        $('#addArcticle').show();
        var article = document.getElementById(''+id);

        $('#title').val("" + article.cells[1].innerHTML);
        $('#content').val("" + article.cells[2].innerHTML);
        $('#author').val("" + article.cells[3].innerHTML);
    };

    /*
     * Sorting a table by clicking on a column
     */
    $(".sortable").click(function() {
        controller.typeOfSorting = $(this).hasClass('asc') ? 'desc' : 'asc';
        $('.sortable').removeClass('asc').removeClass('desc');
        $(this).addClass(controller.typeOfSorting);
        controller.columnForSorting = $(this).html().toLowerCase();

        articles.sort(ArticleController.list.Sorting(controller.columnForSorting, controller.typeOfSorting));
        ArticleController.list.viewTable();
    });





