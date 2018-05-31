<template>
	<div class="innerLay">
		<iframe  :src="Newurl" frameborder="0"></iframe>
	</div>
</template>
<script>
import url from '../../url/urls.js'
import global from '../global/global.js'
const desUrl=url.designer
	export default{
		data(){
			return {
				Newurl:'/ETLManager/qw'
			}
		},
		created(){
			 this.$store.dispatch('fullScreen',true);
			 this.$http.get(desUrl.desurl).then(res=>{
			 	  this.$store.dispatch('fullScreen',false);
			 	  let oldurl= res.body;
			 	  this.Newurl=oldurl.url;
			 },(response)=>{
              this.$store.dispatch('fullScreen',false);
              global.RequestError(this,"服务器繁忙,请稍后刷新");
	          //console.warn("request error");
				})
			
		}
	}

</script>