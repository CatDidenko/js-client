    $(window).scroll(function() {
        if($(window).scrollTop() == $(document).height() - $(window).height() && !controller.busy) {
            controller.busy = true;
            controller.offset += 15;
            controller.indexAction();
        }
    });

    var controller = new ArticleController();
    controller.indexAction();
    setInterval('ArticleController.list.UpdateTime()', 7000);
