Vue.directive('tip',{
	inserted:function(el,binding){
       var spanHtml=`<span id='TitleTip'>{{binding.value}}</span>`;
       el.appendChild(spanHtml);
       var spanClass=document.getElementById('TitleTip');
       spanClass.position = 'absolute';
	   spanClass.style.border = 'solid 1px #999999';
	   spanClass.style.background = '#EDEEF0';
	   spanClass.style.lineHeight = '18px';
	   spanClass.style.fontSize = '18px';
	   spanClass.style.padding = '2px 5px';
       el.onmouseover = function (e){
          var w = el.offsetWidth;
		  var left=Math.min(e.clientX,document.body.clientWidth-w);
		  spanClass.style.display='block';
		  spanClass.style.left=left;
		  spanClass.top=0;		  
       }
       el.onmouseout = function (){
          spanClass.style.display='none';
       }
	}
})