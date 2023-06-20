$(function ($) {
    var pageId = 100;
    $('aside .accordion').slimscroll({ height: '100%', size: 4, railVisible: true });
    $('.nav-toggle-admin').click(function () {
        $('aside').toggle();
    });
    $(document).on('click', 'aside .list-item', function () {
        var t = $(this);
        $('aside .list-item').removeClass('actived');
        if (!t.is('actived')) {
            t.addClass('actived');
        }
    }).on('click', '.page-tag .drawer', function () {
        $('body').toggleClass('full');
    }).on('click', 'aside .list-item', function () {
        var url = $(this).data('url');
        if (!url) {
            url = $(this).data('href');
        }
        if (!url) {
            showMsg('该菜单未指定地址');
            return;
        }
        //未设置标题时，默认使用菜单文本
        var title = $(this).data('title');
        if (!title) {
            title = $(this).html().trim();
        }

        openPage(title, url);
    }).on('click', '.page-tag .tag', function () {
        //激活标签
        if (!$(this).is('.actived')) {
            $(this).addClass('actived').siblings().removeClass('actived');
            var _pageid = $(this).attr('pageid');
            $('.page-list .page').filter('[pageid="' + _pageid + '"]').show().siblings().hide();
        }
        var $s = $('.page-tag .tags');
        var offsetLeft = $(this).offsetP().left + $s.scrollLeft();
        $s.animate({ scrollLeft: offsetLeft + $(this).outerWidth() - $s.outerWidth() }, 200);//滚到当前标签全部出现
    }).on('click', '.page-tag .tag i', function (e) {
        e.stopPropagation();
        var tag = $(this).parent();
        //如果关闭的标签是激活状态，激活前一个
        if (tag.is('.actived')) {
            tag.prev().trigger('click');
        }
        var _pageid = tag.attr('pageid');
        tag.remove();
        $('.page-list .page').filter('[pageid="' + _pageid + '"]').remove();
    }).on('click', '.page-tag .clear', function () {
        //关闭全部
        $('.page-tag .tag i').trigger('click');
    }).on('click', 'aside .list-item', function () {
        //小屏时点击菜单后需隐藏
        if ($(window).width() < 768) {
            $('aside').hide();
        }
    }).on('click', '.skin', function () {
        var skin = $(this).data('skin');
        rSetCookie('skin', skin, '/', null, 31104000);
        $('#skin').prop('href', '/lib/rs/skin/' + skin + '.css');
    });
    $('.page-tag .tag').eq(0).trigger('click');
    //打开页面，已打开则激活
    function openPage(title, url) {
        var findedTag = $('.page-tag .tag').filter('[url="' + url + '"]');
        if (findedTag.length > 0) {
            findedTag.eq(0).trigger('click');
        } else {
            createPage(title, url);
        }
    }
    //创建新页面
    function createPage(title, url) {
        pageId++;
        //添加标签
        var newTag = $('<a class="tag" pageid="' + pageId + '" url="'+url+'">' + title + '<i></i></a>');
        $('.page-tag .tags').append(newTag);
        //添加页面
        var newPage = $('<div class="page" pageid="' + pageId + '"><div class="t pd-20 loading">Loading...</div><iframe src="' + url + '" frameborder="0"></iframe></div>');
        $('.page-list').append(newPage);
        //激活新标签
        newTag.trigger('click');
        newPage.find('iframe').on('load', function () {
            newPage.find('.loading').remove();
        });
    }
});