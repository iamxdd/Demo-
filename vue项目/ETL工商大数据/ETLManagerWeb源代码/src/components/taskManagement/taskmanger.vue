<template>
	<div class="innerLay" v-loading.fullscreen.lock="$store.state.loadingCover" element-loading-text="加载中">
		<div>
			<!-- 左侧 -->
			<div class="leftItem">
				<ul>
					<!-- <li @click="labFirstClick()">
						<router-link to="/taskmanger/strategy" :class="{'grayFirst': clickFirst}">任务配置策略</router-link>  
					</li>
					<li @click="labSecondClick()">
						<router-link to="/taskmanger/manger" :class="{'graySecond': clickSecond}">任务管理</router-link>
					</li>
					<li @click="labThirdClick()">
						<router-link to="/taskmanger/history" :class="{'grayThird': clickThird}">历史任务</router-link>
					</li> -->
					 <li v-for="(item,index) in liData" :class="{graySecond:$route.fullPath==item.label}" ><router-link :to="item.label">{{item.name}}</router-link></li>
				</ul>
			</div>
			<!-- 右侧 -->
			<div class="rightContent">
				<router-view>
					<!-- <strategy></strategy>	 -->
				</router-view>
			</div>
		</div>
	</div>
</template>

<script>

export default{
	data(){
		return {
			clickFirst: true,
			clickSecond: false,
			clickThird: false,
			liData:[
	        {name:"任务配置策略",label:"/taskmanger/strategy"},
	        {name:"任务管理",label:"/taskmanger/manger"},
	        {name:"历史任务",label:"/taskmanger/history"}
	        ]
		}
	},
	created(){
		// let url = window.location.href.split("/");
		// let lastParam = url[url.length - 1];

		// switch(lastParam){
		// 	case "strategy": this.labFirstClick();break;
		// 	case "manger": this.labSecondClick();break;
		// 	case "history": this.labThirdClick();break;
		// }
	},
	
	mounted(){

	},
	methods:{
		labFirstClick(){
			this.clickFirst = true;
			this.clickSecond = false;
			this.clickThird = false;
		},
		labSecondClick(){
			this.clickFirst = false;
			this.clickSecond = true;
			this.clickThird = false;
		},
		labThirdClick(){
			this.clickFirst = false;
			this.clickSecond = false;
			this.clickThird = true;
		}
	}
}

</script>

<style lang="scss" scoped>

	@import url("../../../static/css/taskManger.css");
	@import url("../../../static/common/css/font-awesome.css");
	
</style>