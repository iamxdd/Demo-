
<template>
  <div class="bigCon">
     <!-- 节点管理头部 -->
     <div class="conHeader">
     	<div class="nodeSearch">
     		 <el-row type="flex" class="elrowcon">
                    <el-col>
			         <span>节点名称：</span> 
			          <el-input class='searchName' v-model="searchInputname" placeholder="请输入名称"  size="small"></el-input>
			        </el-col>
				      <el-col>
				          <span>IP：</span>
				             <el-input v-model="searchInputip1" class="searchInputip1" size="small"></el-input>
				        </el-col>
				          
				        <el-col>
				         <span>端口号：</span> 
				          <el-input v-model="searchInputport"  class='searchport' size="small"></el-input>
				        </el-col>
				        
				        <el-col>
				         <span>状态选择：</span> 
				          <el-select v-model="currentType" placeholder="请选择状态" class="eloption" size="small">
				            <el-option 
				              v-for="type in types"
				              :value="type"
				              :key="type">
					            </el-option>
					          </el-select>
				        </el-col>
				         <el-button type="primary" icon="search"  size="small" class="searchbtn" @click="search" >搜索</el-button>
					 </el-row>
     	</div>
     </div>
     <!-- 节点管理添加刷新部分 -->
     <div class="NodeAdd">
     	<!-- 添加按钮 -->
     	   <el-card class="box-card">
			 <el-button type="primary" @click="handAdd" class="Addbtn" size="small">增加节点</el-button>
			  <el-button type="primary" @click="RefreshStatus"  class="Addbtn" size="small">状态刷新</el-button>
			</el-card>
     </div>
     <!-- 表格部分 -->
	 <div class="innerLayTable">
			<div class='NodeItem'>
				<div class="tabletop">节点列表展示</div>
				<!-- 表格table -->
				<div class="Divtable">
				    <el-table :data="showTable" stripe class="eltable">
				        <el-table-column  label="节点名称">
				        	<template scope="scope">
							    <span :title="scope.row.name" class="limitedWidth">{{scope.row.name}}</span>
							</template>	
				        </el-table-column>
				        <el-table-column  label="创建时间" >
				        	<template scope="scope">
							    <span :title="scope.row.createTime" class="limitedWidth">{{scope.row.createTime}}</span>
							</template>	
				        </el-table-column>
				        <el-table-column label="IP">
				        	<template scope="scope">
							    <span :title="scope.row.ip" class="limitedWidth">{{scope.row.ip}}</span>
							</template>	
				        </el-table-column>
				        <el-table-column  label="端口号">
				        	<template scope="scope">
							    <span :title="scope.row.port" class="limitedWidth">{{scope.row.port}}</span>
							</template>	
				        </el-table-column>
				        <el-table-column label="状态">
				         <template scope="scope">
				          <el-tag :type="scope.row.status === '在线' ? 'primary' : 'success'">{{scope.row.status}}</el-tag>
				         </template>
			            </el-table-column>
                        <el-table-column label="节点描述">
                        	<template scope="scope">
							    <span :title="scope.row.description" class="limitedWidth">{{scope.row.description}}</span>
							</template>	
                        </el-table-column>
				        <el-table-column label="操作" align="center" prop="id" >
					      <template scope='scope'>
					          <el-button type="text" size="mini" @click.native="editNode
					          (scope.$index,scope.row)">修改</el-button>
					          <el-button type="text" size="mini" @click.native="deletNode(scope.$index,scope.row)">删除</el-button>
					      </template>
				        </el-table-column>
				    </el-table>
				    <el-row type="flex" justify="end" style="padding:20px 0; ">
			        <el-pagination
			           @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
				       :page-sizes="[20, 30, 40]"
				       :page-size="pagesize"
				       layout="total, prev, pager, next, sizes, jumper"
				       :total="$store.getters.totalNum">
			        </el-pagination>
                   </el-row>
				</div>
			</div>
			 <!-- 增加弹框 -->
		      <el-dialog title="增加节点"  v-model="dialogFormVisible" class="dialog">
		        <el-form >
		          <el-form-item>
		           <div class="nodemes">
		            <span>节点名称:</span>

		             <el-input  v-model="addInputname"  placeholder="请输入名称"  style="display:inline-block;width:20%" @change="handName(addInputname)" ></el-input>
		               <p>{{pname}}</p>
		            </div>
		            <div class="nodemes">
			             <span>IP:</span>
			             <el-input v-model="addInputip1" placeholder="请输入正确的ip格式" @change="handips(addInputip1)" style="display:inline-block;width:20%"></el-input>
			             <p>{{ipname}}</p>
			          </div>
			          <div class="nodemes">
			          	 <span>端口号:</span>
		                 <el-input v-model="addInputport" style="display:inline-block;width:20%" placeholder="1024到65535"  @change="handPort(addInputport)"></el-input>
		                 <p>{{portname}}</p>
			          </div>
		              <div class="nodemes">
			            <span>节点描述:</span>
		               <el-input
						  type="textarea"
						  :rows="2"
						  placeholder="请输入内容"
						  v-model="textarea"
						   @change="handeditDes(textarea)">
						</el-input>
						<p>{{editdescription}}</p>
					  </div>
		            </el-form-item>
		           </el-form>
		                <span slot="footer" class="dialog-footer">
		                    <el-button type="primary"  @click="handAddSure">确定</el-button>
		                    <el-button  @click="handAddquit">取消</el-button>
		                </span>
		      </el-dialog>
		        <!-- 修改节点 -->
		       <el-dialog title="修改节点"  v-model="dialogFormVisibleEdit" class="dialog">
		        <el-form >
		          <el-form-item>
		           <div class="nodemes">
		            <span>节点名称:</span>
		             <el-input  v-model="editaddInputname"  placeholder="请输入名称"  style="display:inline-block;width:20%" @change="handName(editaddInputname)"  ></el-input>
		               <p>{{editname}}</p>
		            </div>
			           <div class="nodemes">
			            <span>节点描述:</span>
		               <el-input
						  type="textarea"
						  :rows="2"
						  placeholder="请输入内容"
						  v-model="textarea1"
						   @change="handeditDes(textarea1)">
						</el-input>
						<p>{{editdescription}}</p>
					  </div>
		            </el-form-item>
		           </el-form>
		                <span slot="footer" class="dialog-footer">
		                    <el-button  @click="handEditSure">确定</el-button>
		                    <el-button type="primary" @click="handEditquit">取消</el-button>
		                </span>
		      </el-dialog>
	 </div>
	</div>
</template>
<script>
import Vue from 'vue'
import url from '../../url/urls.js'
import global from '../global/global.js'
const nodeUrl=url.nodeMange

export default{
	data(){
        return {
        	  input: '',
        	 
        	  currentType:'',

           
        	  //默认每页数据量
        	  pagesize: 20,
        	  
        	  //当前显示页数
        	  currentPage: 1,
        
              types:['请选择所有','在线','离线','----'],
              dialogFormVisible:false,
              dialogFormVisibleEdit:false,

              //判断name是否正确
              Nflag:true,
              //判断ip是否正确
              flag:true,
              
              //判断端口是否正确
              Pflag:true,
              pname:'',
              editname:'',
              ipname:'',
              portname:'',
              editdescription:'',
              
              // 搜索框
              searchInputname:'',
              searchInputip1:'',
              searchInputport:'',

               
              //增加inputname框
              addInputname:'',
              addInputip1:'',
              addInputport:'',
              textarea:'',
               //修改inputname框
              editaddInputname:'',
              textarea1:'',
              rowId:0
        }
	},

   mounted:function(){
		                 
      	 this.$store.dispatch("getCurrentType",this.currentType);
	   	 var status=this.$store.getters.currentType
	   	 this.$store.dispatch("getPort",this.searchInputport);
	   	 var port=this.$store.getters.Port   
		 this.$nextTick(function(){
		 this.$store.dispatch('getshowTable',{ "params":{
		 "page":{"pageLine":this.pagesize,"pageNum":this.currentPage},
		 "node":{"name":this.searchInputname,"ip":this.searchInputip1,"port":port,"status":status}
		 },
		 "this":this
		  });
		});
   	  }, 
	computed:{
		   showTable(){
				return this.$store.getters.tableData;
		  }
	},
	methods:{
		//判定name输入是否合法
		handName:function(name){
           var pattern=/^[\u4E00-\u9FA5a-zA-Z0-9_]{1,64}$/;
          	if(pattern.test(name)){
               this.Nflag=true;
               this.pname='';
               this.editname='';
          	}else{ 
              this.Nflag=false;
              this.pname="只支持中文，英文，数字，下划线，长度在[1,64]";
              this.editname='只支持中文，英文，数字，下划线，长度在[1,64]'
          	}
		},
		// 判定ip格式否正确
		handips:function(ipaddress){
          var reg=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/			
			if(ipaddress){
				if(reg.test(ipaddress)){
					 this.flag=true;
					 this.ipname='';
				}else{
					 this.flag=false;
					 this.ipname='请输入ip正确的格式,如: 10.2.3.150'

				}
			}
		},
		//验证端口号是否输入正确
		handPort:function(port){
			var reg=/^(102[4-9]|10[3-9]\d{1}|1[1-9]\d{2}|[2-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d{1}|6553[0-5])$/;
			if(port){
				if(reg.test(port)){
					this.Pflag=true;
					this.portname=''
				}else{
					this.Pflag=false;
					this.portname='请输入端口号的正确格式 1024-65535'
				}
			}
		},
		//验证节点描述是否输入正确
		handeditDes:function(val){
			if(val.replace(/\s/g, "").length>256){
				this.editdescription="节点描述长度在[0,256]";
			}else{
				this.editdescription="";
			}
		},
       // 增加节点
		handAdd:function(){		  
	               	this.dialogFormVisible = true;
					this.addInputname='';
					this.addInputip1='';
					this.addInputport='';
					this.textarea='';
					this.pname='';
					this.ipname='';
					this.portname='';
					this.editdescription=''
		},
		//增加确定
		handAddSure:function(){
        	if(this.addInputname.replace(/\s/g, "")==="" && this.addInputip1.replace(/\s/g, "")==="" && this.addInputport.replace(/\s/g, "")==="" && this.textarea.replace(/\s/g, "")===""){
				 this.pname="只支持中文，英文，数字，下划线，长度在[1,64]";
				 this.ipname='请输入ip正确的格式,如: 10.2.3.150';
				 this.portname='请输入端口号的正确格式 1024-65535';
				 this.editdescription='节点描述长度在[0,256]'
               return;
			}
			if(this.Nflag===false || this.addInputname.replace(/\s/g, "")===""){
				this.pname='名称设置不合法'
				this.ipname='';
				this.portname='';
				this.editdescription='';
				return;
			}
			if(this.flag===false || this.addInputip1.replace(/\s/g, "")===""){
				this.ipname='ip设置不合法';
				this.pname='';
				this.portname='';
				this.editdescription='';
				return;
			}
			if(this.Pflag===false || this.addInputport.replace(/\s/g, "")===""){
				this.portname='端口号设置不合法'
				this.pname='';
				this.ipname='';
				this.editdescription=''
              return;
			}
			if(this.textarea1.replace(/\s/g, "").length>256){
			 	this.editdescription="节点描述长度在[0,256]";
			 	this.portname='';
			 	this.pname='';
				this.ipname=''
                 return;
			 }
		 this.$store.dispatch("getCurrentType",this.currentType);
         this.$store.dispatch("getPort",this.searchInputport.replace(/\s/g, ""));
         this.$store.dispatch("getIPnumber",this.addInputip1.replace(/\s/g, ""));

		 var status=this.$store.getters.currentType;
         var port=this.$store.getters.Port;
         var ip=this.$store.getters.ipNumber;
         
         this.$store.dispatch('fullScreen',true);

		 this.$http.post(nodeUrl.nodeAddUrl,{"name": this.addInputname, "ip": ip, "port": +this.addInputport,"status":2,"degree":0,"description":this.textarea.replace(/\s/g, "")},{emulateJSON: false}).then(res=>{
			if(res.body.code===201){
				this.$store.dispatch('fullScreen',false);
				this.$alert(res.body.status, '提示', {
		         confirmButtonText: '确定',
		         type:'error'
		        });
			}else if(res.body.code===200){
				this.$store.dispatch('fullScreen',false);
				this.$alert(res.body.status, '提示', {
		         confirmButtonText: '确定',
		         type:'success',
		         beforeClose: (action, instance, done) =>{                         
                   	this.$store.dispatch('getshowTable',
                   	 { "params":
                     {"page":{"pageLine":this.pagesize,"pageNum":this.currentPage},
        	          "node":{"name":this.searchInputname.replace(/\s/g, ""),"ip":this.searchInputip1.replace(/\s/g, ""),"port":port,"status":status}
                                },
                      "this":this       	                                
    	                 });
		           	 setTimeout(() => {done()},100);
				    }
		        });
			   }	   

	        },(response)=>{
                   this.$store.dispatch('fullScreen',false);
                   global.RequestError(this,"服务器繁忙,请稍后刷新");
		  });

		    this.dialogFormVisible = false;		   
		},
		//取消
		handAddquit:function(){
			this.dialogFormVisible=false;
		},
		
        //编辑节点
		editNode:function(index,row){
			 this.rowId=row.id;
			 this.textarea1=row.description;
			 this.editaddInputname='';
			 this.editname='';
			 this.editdescription='';
			 this.dialogFormVisibleEdit=true;
          
		 },
		 //修改确定
		handEditSure:function(){
			
			 if(this.editaddInputname.replace(/\s/g, "")==="" && this.textarea1.replace(/\s/g, "")===""){
				this.editname='只支持中文，英文，数字，下划线，长度在[1,64]';
				this.editdescription="节点描述长度在[0,256]";
				return;
			 }
			 if(this.Nflag===false || this.editaddInputname.replace(/\s/g, "")===""){
			 	 this.editname='名称设置不合法'
			 	 return;
			 }
			 if(this.textarea1.replace(/\s/g, "").length>256){
			 	this.editdescription="节点描述长度在[0,256]"
                 return;
			 }
			 this.dialogFormVisibleEdit=false;
			 this.$store.dispatch('fullScreen',true);
			 this.$http.post(nodeUrl.nodeEditUrl,{"id": this.rowId,"node":{"name": this.editaddInputname.replace(/\s/g, ""),"description":this.textarea1.replace(/\s/g, "")}},{emulateJSON: false}).then(res=>{
			   if(res.body.code===201){
				this.$store.dispatch('fullScreen',false);
					this.$alert(res.body.status, '提示', {
					confirmButtonText: '确定',
					type:'error'
					})
				}else {
					this.$store.dispatch('fullScreen',false);
					this.$store.dispatch("getCurrentType",this.currentType);
					this.$store.dispatch("getPort",this.searchInputport.replace(/\s/g, ""));
					var status=this.$store.getters.currentType;
					var port=this.$store.getters.Port;
					this.$alert(res.body.status, '提示', {
						confirmButtonText: '确定',
						type:'success',
						beforeClose: (action, instance, done) =>{
					    this.$store.dispatch('getshowTable',{ "params":{
						"page":{"pageLine":this.pagesize,"pageNum":this.currentPage},
						"node":{"name":this.searchInputname.replace(/\s/g, ""),"ip":this.searchInputip1.replace(/\s/g, ""),"port":port,"status":status}
					    },
					   "this":this
					  });
					    setTimeout(() => {
						done();
						},100)
				   }
				 });
				}
			 },(response)=>{
				this.$store.dispatch('fullScreen',false);
				global.RequestError(this,"服务器繁忙,请稍后刷新");
				//console.warn("request error");
				})
		},
		 //修改取消
		 handEditquit:function(){
		 	this.dialogFormVisibleEdit=false;
		 },
	    deletNode:function(index,row){
	      this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass:'canclEdit',
          type: 'warning', 
        }).then(() => {
				this.$store.dispatch('fullScreen',true);
				this.$http.post(nodeUrl.nodeDeletUrl,{ "id": row.id},{emulateJSON: true}).then(res=>{
			if(res.body.code===201){
				this.$store.dispatch('fullScreen',false);
				this.$alert(res.body.status, '提示', {
				confirmButtonText: '确定',
				type:'error'
				});
			}else{
				this.$store.dispatch('fullScreen',false);
				this.$store.dispatch("getCurrentType",this.currentType);
				this.$store.dispatch("getPort",this.searchInputport.replace(/\s/g, ""));
				var status=this.$store.getters.currentType;
				var port=this.$store.getters.Port;
				this.$alert(res.body.status, '提示', {
				confirmButtonText: '确定',
				type:'success',
				beforeClose:(action, instance, done) =>{
				this.$store.dispatch('getshowTable',{ "params":{
				"page":{"pageLine":this.pagesize,"pageNum":this.currentPage},
				"node":{"name":this.searchInputname.replace(/\s/g, ""),"ip":this.searchInputip1.replace(/\s/g, ""),"port":port,"status":status}
				},
				"this":this
				});
				setTimeout(() => {
				done();
				  },100)
			   }
			 });
			}
		 },(response)=>{
			this.$store.dispatch('fullScreen',false);
			global.RequestError(this,"服务器繁忙,请稍后刷新");
			})
        }).catch(() => {});
	   },
	   //搜索
	    search:function(){		
			this.$store.dispatch("getCurrentType",this.currentType);
			this.$store.dispatch("getPort",this.searchInputport.replace(/\s/g, ""));
			var status=this.$store.getters.currentType;
			var port=this.$store.getters.Port;
			this.$store.dispatch('getshowTable',{ "params":{
			"page":{"pageLine":this.pagesize,"pageNum":1},
			"node":{"name":this.searchInputname.replace(/\s/g, ""),"ip":this.searchInputip1.replace(/\s/g, ""),"port":port,"status":status}
			},
			"this":this
			});       			                 
	   },
	   //每页显示数据量变更
	    handleSizeChange: function(val){
    	    this.$store.dispatch("getCurrentType",this.currentType);
            this.$store.dispatch("getPort",this.searchInputport);
			var status=this.$store.getters.currentType;
            var port=this.$store.getters.Port;
            this.pagesize = val;
       
            if(this.currentPage!==1){
             this.currentPage = 1;
            }else{
			this.$store.dispatch('getshowTable',{ "params":{
			"page":{"pageLine":this.pagesize,"pageNum":this.currentPage},
			"node":{"name":this.searchInputname.replace(/\s/g, ""),"ip":this.searchInputip1.replace(/\s/g, ""),"port":port,"status":status}
			},
			"this":this
             });
           }  
        },
        //页码变更
        handleCurrentChange: function(val){
        	 this.$store.dispatch("getCurrentType",this.currentType);
             this.$store.dispatch("getPort",this.searchInputport.replace(/\s/g, ""));
		     var status=this.$store.getters.currentType;
             var port=this.$store.getters.Port;
             this.currentPage = val;
			 this.$store.dispatch('getshowTable',{ "params":{
				"page":{"pageLine":this.pagesize,"pageNum":this.currentPage},
				"node":{"name":this.searchInputname.replace(/\s/g, ""),"ip":this.searchInputip1.replace(/\s/g, ""),"port":port,"status":status}
				},
				"this":this
				});
        }, 
        //状态刷新
        RefreshStatus:function(){
        	this.$store.dispatch('fullScreen',true);
	          this.$http.get(nodeUrl.nodeFreshUrl).then(res=>{
           	if(res.body.code===201){
           	   this.$alert(res.body.status, '提示', {
	           	confirmButtonText: '确定',
	           	 type:'error'
	            });
           	     this.$store.dispatch('fullScreen',false);
           	}else {
				this.$store.dispatch("getCurrentType",this.currentType);
				this.$store.dispatch("getPort",this.searchInputport.replace(/\s/g, ""));
				var status=this.$store.getters.currentType;
				var port=this.$store.getters.Port;
				if(res.body.code===200){
					this.$store.dispatch('fullScreen',false);
					this.$alert(res.body.status, '提示', {
					confirmButtonText: '确定',
					type:'success',
					beforeClose:(action, instance, done) =>{
					this.$store.dispatch('getshowTable',{ "params":{
					"page":{"pageLine":this.pagesize,"pageNum":this.currentPage},
					"node":{"name":this.searchInputname.replace(/\s/g, ""),"ip":this.searchInputip1.replace(/\s/g, ""),"port":port,"status":status}
					},
					"this":this
					});			               	
					setTimeout(() => {done()},100);
					  }
					});
				}else{
					this.$store.dispatch('fullScreen',false);
					this.$alert("刷新失败", '提示', {
					confirmButtonText: '确定',
					type:'error',
					});
				  }
				}
			},(response)=>{
				this.$store.dispatch('fullScreen',false);
				global.RequestError(this,"服务器繁忙,请稍后刷新");
		})     	     
   },
       //离线在线样式设置
       filterTag:function(value, row) {
        return row.status === value;
      }
   }
}
</script>
<style>
 .canclEdit{
 	float: right;
 	margin-left:10px!important;
 }
</style>


  <!-- 新增 -->
   