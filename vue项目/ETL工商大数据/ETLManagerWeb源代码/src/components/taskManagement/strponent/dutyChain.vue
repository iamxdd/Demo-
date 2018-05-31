<template>
  <div class="dutyChainDiv">
    <el-dialog :title="dutyType" :visible.sync="$store.state.dutyChain.layShow" size="tiny">
       <!-- 内容 -->
      <el-popover ref="chainPop" placement="top" trigger="click" v-model="chainPopShow" :popper-class="popClass">
        <p class="lastmsg">至少选择一项</p>
      </el-popover>

      <!-- 搜索 -->
      <el-button type="primary" @click="batchDutyChain" size="small" class="dubleChain" v-popover:chainPop>{{confirmsg}}</el-button>

      <span>任务名称：</span>
      <el-input placeholder="请输入" v-model="inputVal" size="small"></el-input> 
      <el-button type="primary" icon="search" @click.stop="searchClick()" size="small" class="searchMargin">搜索</el-button>

      <!-- 表格 -->
      <div class="tableGation">
        <el-table :data="$store.state.dutyData" stripe border tooltip-effect="dark" style="width:100%" @select="selectOneFun" @select-all="selectAllFun" ref="multipleTable" :empty-text="tableEmptyText">

          <el-table-column type="selection" width="0.1"></el-table-column>

          <el-table-column label="任务名称">
             <template scope="scope">
              <span class="limitedWidth" :title="scope.row.name">{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="columnName">
            <template scope="scope">
              <span :class="iconClass" @click="singleDutyChain(scope.row)"></span>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagation">
         <el-pagination layout="total, prev, pager, next, sizes, jumper, pager" :total="$store.state.dutyChain.pagitation.totalItem" :current-page="$store.state.dutyChain.pagitation.currPage" :page-sizes="$store.state.dutyChain.pagitation.pageSizeArr" :page-size="$store.state.dutyChain.pagitation.pageSize" @current-change="handleCurrentChange" @size-change="handleSizeChange">
         </el-pagination>
      </div>

    </el-dialog>
  </div>
</template>

<script>

  import url from '../../../url/urls.js';
  import commonFun from '../common.js';
  //刷新str策略信息
  import refreshStrFun from './strAjax.js';

  const urls = url.taskMange;
  const PostAjax = commonFun.PostAjax;
  const ObjCopy = commonFun.ObjCopy;
  const RequestError = commonFun.RequestError;

  const getRalationDutyData = refreshStrFun.getRelationDutyData;  //url, param

  export default{
    props:['dutyType','strId','strName','tableEmptyText'],
    data(){
      return {
        inputVal:'',
       // dutyData:[],                //只是不做显示
        pageChangeSelectionArr:[],   //翻页时已经被点击的
        newestSelection:[],      //当前页最新被点击的
        oldPage:'',
        newPage: '',
        chainPopShow:false,
        requestUrl:'',   //进入页面请求，地址
        batchSendUrl: '',    //确认后的发送任务信息，地址
        singleSendUrl:'',
        confirmsg:'',   //确认按钮： 关联，解除关联
        notiedmsg:'',   //关联成功、失败
        searchText:'',
       // tableEmptyText:'暂无数据',
        iconClass:'',    //关联的图标和解除关联的图标s
        columnName:'',
        popClass: 'showItem',
        row:{},
      }
    },
    created(){

      //实例化创建的时候页数到 0
      this.$store.dispatch('resetDutyChainPageSize',20);

      this.$store.state.dutyChain.pagitation.currPage !== 1 ? this.$store.dispatch('resetDutyChainCurrPage',1) : '';

      if(this.dutyType === '查看关联'){

          this.requestUrl = urls.queryRelationReq;  //unrelationJobRequest   queryRelationReq
          this.batchSendUrl = urls.batchRelieveJob;  //removeJobReq

          this.singleSendUrl = urls.singleRelieveJob;

          this.iconClass = "fa fa-chain-broken";
          this.columnName = '解除关联';
          this.confirmsg = '批量解除关联';
          this.notiedSuccmsg = "解除关联成功";
          this.notiedEorrmsg = "解除关联失败";
      }else{   
          //关联任务
          this.requestUrl = urls.unrelationJobRequest;
          this.batchSendUrl = urls.batchChainJob;   //sendJobsId

          this.singleSendUrl = urls.singleChainJob;

          this.columnName = '关联';
          this.iconClass = "fa fa-link";
          this.confirmsg = '批量关联';
          this.notiedSuccmsg = "关联成功";
          this.notiedEorrmsg = "关联失败";
      }

      this.row['id'] = this.strId;
      this.row['name'] = this.strName;

    },
    watch:{
      "$store.state.dutyChain.pagitation.currPage":function(newVal,oldVal){
        this.oldPage = oldVal;
        this.newVal = newVal;
      }
    },
    mounted(){
      this.$nextTick(()=>{
        //this.getRalationDutyData();
      })
    },
    updated(){
      //实例更新, 打钩
      if(this.oldPage !== this.newPage){
          this.hasSelectedFun();
      }
    },
    methods:{
      //获取数据
      searchDutyDataError(){
          //没有搜索到相关信息
          
      },
      searchClick(){

        this.searchText = this.inputVal;

        this.$store.dispatch('resetDutyChainCurrPage',1);

        //所有保存数据清空
        this.newestSelection = [];
        this.pageChangeSelectionArr = [];

        getRalationDutyData(this,this.requestUrl,this.row);

      },
      //单选的数据
      selectOneFun(selection,row){
        let exist = selection.every((v,i) => {
            return row.id !== v.id
        });

        let hasSelected = this.pageChangeSelectionArr;

        this.noItem = false

        //true 重复，需要取消
        //false 没有重复，需要删除.
        if(exist){
            //console.log("取消打钩");
            //取消打钩
            for(let i = 0; i < hasSelected.length; i++){
              if(hasSelected[i].id === row.id){
                hasSelected.splice(i,1);
                return;
              }
            }

            this.pageChangeSelectionArr = hasSelected;

          }else{
            //console.log("打钩");
            //当前页打钩
            this.newestSelection = selection;
          }

      },
      //全选
      selectAllFun(selection){
        //将已经存在的移除，直接把现在全选的存入
          //若 selection 为空则就是取消全新
          if(selection.length === 0){

            //取消全选  mangerData 全部取消
           // let hasSelected = this.selectAllCommon();
            let noRepeactSelected = this.selectAllCommon();
            this.newestSelection = [];                     //当前页选择制空

            //防止 undefined 的出现
            noRepeactSelected = noRepeactSelected === undefined ? [] : noRepeactSelected;

            this.pageChangeSelectionArr = noRepeactSelected;

          }else{

            //全选, 删除存在列表的拼接不存在的
            let dutyData = this.$store.state.dutyData;
            let noRepeactSelected = this.selectAllCommon();
            this.newestSelection = [];                     //当前页选择制空

            //防止 undefined 的出现
            noRepeactSelected = noRepeactSelected === undefined ? [] : noRepeactSelected;
            this.pageChangeSelectionArr = dutyData.concat(noRepeactSelected);
          }
      },
      //全选和取消全新公共方法封装
      selectAllCommon(){

        let hasSelected = ObjCopy(this.pageChangeSelectionArr);
        let dutyData = this.$store.state.dutyData;

        for(var i = hasSelected.length - 1; i >= 0; i--){
          for(var j = 0; j < dutyData.length; j++){
              if(hasSelected[i].id == dutyData[j].id){
                hasSelected.splice(i,1);
                break;
              }
          }
        }
        //防止 undefined 的出现
        hasSelected = hasSelected === undefined ? [] : hasSelected;

        return hasSelected;
      },
      //更新页数
      handleCurrentChange(val){


        this.$store.dispatch('resetDutyChainCurrPage',val);
        this.pageChangeSelectionArr = this.pageChangeSelectionArr.concat(this.newestSelection);

        this.newestSelection = [];

        //拼接
        if(val === 1){
          getRalationDutyData(this,this.requestUrl,this.row);
        }else{
          getRalationDutyData(this,this.requestUrl,this.row);

           //getRalationDutyData(this,urls.queryRelationReq,this.row);
        }

      },
      //当前页之前勾选的打钩
      hasSelectedFun(){
        let dutyData = this.$store.state.dutyData;
        let clickCurrPageSelect = this.pageChangeSelectionArr;

        if(clickCurrPageSelect !== undefined){

          if(clickCurrPageSelect.length !== 0){

            clickCurrPageSelect.filter((val,index) => {
              for(let i = 0; i < dutyData.length; i++){
                if(val.id === dutyData[i].id){
                  this.$refs.multipleTable.toggleRowSelection(this.$store.state.dutyData[i]);
                  return;
                }
              }
            })
          }
        }

      },
       /*每页的数量分布*/
      handleSizeChange(val){

        this.$store.dispatch('resetDutyChainPageSize',val);
          
        if(this.$store.state.dutyChain.pagitation.currPage !== 1){

            this.$store.dispatch('resetDutyChainCurrPage',1);//手动刷新到第一页
          // getRalationDutyData(this,this.requestUrl,this.row);

        }else{

          getRalationDutyData(this,this.requestUrl,this.row);
        }

      },
      //批量关联，或解除关联
      batchDutyChain(){
        //发送数据到后台
        this.oldPage = this.newPage;

        this.pageChangeSelectionArr = this.pageChangeSelectionArr.concat(this.newestSelection);

        let param = {strategy:this.strId, jobs: this.pageChangeSelectionArr};
       
        if(this.pageChangeSelectionArr.length === 0){

          this.chainPopShow = false;

          this.popClass = 'showItem';

        }else{

          this.chainPopShow = true;

          this.popClass = 'closeItem';

          this.sendoutChainData(param);

        }
      },
      //单个关联或解除
      singleDutyChain(row){

        let param = {strategy:this.strId, job: row};

        let promise = PostAjax(this.singleSendUrl, param);

        promise.done((res)=>{

          res = typeof(res) === 'string' ? JSON.parse(res) : res;

          let code = res.code;
          let message = res.message;

          if(code === 0){

            this.newestSelection = [];
            this.pageChangeSelectionArr = [];

            this.$confirm(message,'提示',{
                  confirmButonText:'确认',
                  showCancelButton:false,
                  type:'success',
              }).then( ()=> {
                  //刷新页数
                 this.refreshDutyChainData();

              }).catch(()=>{

                //点击 x 关闭窗口
                this.refreshDutyChainData();

              })

          }else{

            //关闭所有的打钩

            RequestError(this,message,this.$refs.multipleTable.clearSelection);
           // this.closeLayer();
           // this.confirmPopBox(errorType,this.notiedEorrmsg,result);
          }

        });
        promise.fail((res)=>{

          this.closeLayer();    //关闭遮罩层

          let message = '服务器异常,请稍后刷新';
          RequestError(this,message);
          //console.warn('request error');
        })

      },
      //发送出去
      sendoutChainData(param){

        let promise = PostAjax(this.batchSendUrl, param);

          promise.done((res)=>{

            res = typeof(res) === 'string' ? JSON.parse(res) : res;

            let code = res.code;
            let successType = 'success';
            let errorType = 'error';
            let result = res.result;
            let message = res.message;

            this.newestSelection = [];   //清空当前页目前的
            this.pageChangeSelectionArr = [];  //清空当前打钩的数据

            if(code === 0){

              this.confirmPopBox(successType,this.notiedSuccmsg,result);

            }else{

              //this.$refs.multipleTable.clearSelection  关闭所有的勾选
              RequestError(this,message,this.$refs.multipleTable.clearSelection); //错误情况下，刷新数据

            }

          });
          promise.fail((res)=>{

            this.closeLayer();    //关闭遮罩层

            let message = '服务器异常,请稍后刷新';
            RequestError(this,message);
            //console.warn('request error');
          })
      },
      //点击确认后弹出框的信息
      confirmPopBox(type, msg, result){

            // let Sflag="";
            // let Flag="";
            // result.succnum>0 ? Sflag=":" : Sflag="";
            // result.failnum>0 ? Flag=":" : Flag="";

            let totalmsg = '总共：' + result.totalnum + '个';

            let succmsg = '成功：' + result.succnum + '个'
             let succmsgs=result.succ.join(",");
            let failmsg = '失败：' + result.failnum + '个'
             let failmsgs= result.fail.join(",");

            const h = this.$createElement;

            this.$msgbox({
              title: "消息",
              message: h('div',null,[
                h('p', null, totalmsg),
                h('p', null, succmsg),
                h('p', {style:'color:#13ce66'}, succmsgs),
                h('p', null, failmsg),
                h('p', {style:'color:#ff4949'}, failmsgs)
              ]),
          confirmButonText: '确认',
          showCancelButton:false,
          // type: type

        }).then(() => {
          //刷新数据

          this.refreshDutyChainData();

            // this.closeLayer();
        }).catch(() => {
           //刷新数据
          this.refreshDutyChainData();

        })
      },
      closeLayer(){
        //关闭遮罩层
        let type = {type: 'close'};
        this.$store.dispatch('dutyChainShow',type);

      },
      refreshDutyChainData(){
        this.$store.state.dutyChain.pagitation.currPage !== 1 ? this.$store.dispatch('resetDutyChainCurrPage',1) : getRalationDutyData(this,this.requestUrl,this.row);
      }
    }
  }
</script>

<style scoped>
  .dutyChain{
    width: 6rem;   /* 关联任务的弹框大小 */
}

/* 关联任务的表格高度 */
.dutyChain .el-table__body-wrapper{
    height: 2rem;
}

/* 分页与确认的距离 */
.dutyChain .pagation{
    margin-bottom: 0.1rem;
}

.dubleChain{
    margin: 0.2rem 0;
    margin-right: 0.5rem;
}

</style>