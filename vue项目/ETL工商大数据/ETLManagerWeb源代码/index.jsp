<%@ page language="java" contentType="text/html; charset=UTF-8"  
    pageEncoding="UTF-8" import="java.util.ResourceBundle"%> 
<!DOCTYPE html>
<html>
	<head>
	  	<title>SDC_ETL</title>
	  	 <base href="/ETLManager/">
        <link  href="${pageContext.request.contextPath}/static/css/app.css" rel=stylesheet>
        <%ResourceBundle res = ResourceBundle.getBundle("conf/config"); %>  
	</head>
	 <body style="min-width: 1366px">
	 
            <div id="app"></div>
                        
	       <script type=text/javascript src="${pageContext.request.contextPath}/static/js/manifest.js"></script>
           <script type=text/javascript src="${pageContext.request.contextPath}/static/js/vendor.js"></script>
           <script type=text/javascript src="${pageContext.request.contextPath}/static/js/app.js"></script>
	</body>
</html>
<script>
       (function (doc, win) {
           var docEl = doc.documentElement,
                recalc = function () {
           var mainWidth = document.getElementsByTagName("body")[0].getBoundingClientRect().width;
                   if(mainWidth<1366)mainWidth = 1366;
                   if(mainWidth>1920)mainWidth = 1920;
             if (!mainWidth) return;
                      docEl.style.fontSize = 100 * (mainWidth / 1366) + 'px';
                  };
              recalc(); 
              win.addEventListener("resize", recalc, false);
              doc.addEventListener('DOMContentLoaded', recalc, false);
          })(document, window);
       
       //隐藏头部
	   	var switchType = '<%=res.getString("switch") %>';
	   	var dom = document.getElementsByTagName('header');
	   	var loading = document.getElementsByClassName('el-loading-mask');
	   	
	   	if(switchType == 'off'){
	   		//关闭
	   		dom[0].style.display = 'none';
	   		loading[0].style.top = 0;
	   	}


    </script>