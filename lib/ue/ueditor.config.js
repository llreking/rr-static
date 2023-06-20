(function () {
	var URL = window.UEDITOR_HOME_URL || getUEBasePath();
    window.UEDITOR_CONFIG = {
        UEDITOR_HOME_URL: URL
        , serverUrl: "/ueditor/handler"
        , toolbars: [[
            'source', '|',
            'bold', 'italic', 'underline','fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat',  'pasteplain', '|', 'forecolor', 'backcolor', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'fontsize', '|',
            'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'link', 'unlink', '|',
            'simpleupload','insertvideo', '|',
            'horizontal','spechars','|','inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|', 'drafts', 'cleardoc','|','135editor'
        ]],
        //, toolbars: [[
        //    'source', '|',
        //    'bold', 'italic', 'underline','fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat',  'pasteplain', '|', 'forecolor', 'backcolor', '|',
        //    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
        //    'fontsize', '|',
        //    'indent', '|',
        //    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
        //    'link', 'unlink', '|',
        //    'simpleupload', 'scrawl', 'attachment','insertimage', 'insertvideo', '|',
        //    'horizontal','spechars','|','inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|', 'drafts', 'cleardoc','|','135editor'
        //]],
        fontsize:[12,13, 14,15, 16, 18,20,22,24]
        , allowDivTransToP: false,
        autoClearEmptyNode: false,
        allHtmlEnabled: true
		,xssFilterRules: true
		,inputXssFilter: true
		, catchRemoteImageEnable: false//是否抓取远程图片
		, retainOnlyLabelPasted: false
		, pasteplain: false
		, outputXssFilter: true
        , zIndex: 1
        , scaleEnabled: false
        ,minFrameWidth:520
        , minFrameHeight: 300
        ,autoHeightEnabled: false
    };
	function getUEBasePath(docUrl, confUrl) {
		return getBasePath(docUrl || self.document.URL || self.location.href, confUrl || getConfigFilePath());
    }
    function getConfigFilePath() {
        var configPath = document.getElementsByTagName('script');
        return configPath[ configPath.length - 1 ].src;
    }
    function getBasePath(docUrl, confUrl) {
        var basePath = confUrl;
        if (/^(\/|\\\\)/.test(confUrl)) {
            basePath = /^.+?\w(\/|\\\\)/.exec(docUrl)[0] + confUrl.replace(/^(\/|\\\\)/, '');
        } else if (!/^[a-z]+:/i.test(confUrl)) {
            docUrl = docUrl.split("#")[0].split("?")[0].replace(/[^\\\/]+$/, '');
            basePath = docUrl + "" + confUrl;
        }
        return optimizationPath(basePath);
    }
    function optimizationPath(path) {
        var protocol = /^[a-z]+:\/\//.exec(path)[ 0 ],
            tmp = null,
            res = [];
        path = path.replace(protocol, "").split("?")[0].split("#")[0];
        path = path.replace(/\\/g, '/').split(/\//);
        path[ path.length - 1 ] = "";
        while (path.length) {
            if (( tmp = path.shift() ) === "..") {
                res.pop();
            } else if (tmp !== ".") {
                res.push(tmp);
            }

        }
        return protocol + res.join("/");
    }
    window.UE = {
        getUEBasePath: getUEBasePath
    };
})();
