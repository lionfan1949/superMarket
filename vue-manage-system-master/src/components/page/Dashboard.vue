<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="16" style="padding-left: 0px">
                <div class="grid-content bg-purple" >
                    <van-tabs >
                        <van-tab title="所有">
                            <van-grid :column-num="6" gutter="5px">
                                <van-grid-item @click="addToCart (value)"  v-for="value in inventory"  :key="value.goodId" :icon="value.goodimg" :text="value.goodname+value.unitprice"/>
                            </van-grid>

                        </van-tab>
                        <van-tab v-for="index in 17" :title="'标签 ' + index">
                            内容 {{ index }}
                        </van-tab>
                        <el-pagination
                                background
                                @current-change="handlePageChange"
                                layout="total, prev, pager, next"
                                :current-page="pageIndex"
                                :page-size="pageSize"
                                :total="pageTotal"
                        ></el-pagination>
                    </van-tabs>
                </div>
            </el-col>
            <el-col :span="8" style="padding-left:0px;padding-right: 0px ;height: 550px"    >
                <div class="grid-content bg-purple">
                    <div class="current-cart">
                        <div class="current-cart-header">当前所购商品</div>
                        <!--购物车-->
                        <el-table
                                :data="tableData"
                                height="520"
                                border
                                style="width: 100%; height:80%"
                                type="index"
                         >
                            <el-table-column
                                    prop="goodid"
                                    label="序号"
                                    width="50"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="goodname"
                                    label="名称"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="costprice"
                                    label="单价"
                                    width="50">
                            </el-table-column>
                            <el-table-column
                                    label="数量"
                                    prop=goodnum
                                    width="50"
                            >
                            </el-table-column>
                            <el-table-column label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button
                                            type="text"
                                            icon="el-icon-edit"
                                            @click="handleEdit(scope.$index, scope.row)"
                                    >编辑</el-button>
                                    <el-button
                                            type="text"
                                            icon="el-icon-delete"
                                            class="red"
                                            @click="handleDelete(scope.$index,scope.row)"
                                    >删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <van-submit-bar :price=totalPrice button-text="提交订单" @submit="settlement" />
             </el-col>
        </el-row>
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="数量">
                    <el-input v-model="form.num"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import {mapMutations,mapState} from 'vuex'
import {getStore, getTimeNum, getNowDateAfterFormat, removeStore} from "../../utils/global";

export default {
    name: 'dashboard',
    data() {
        return {
            pageIndex: 1,
            pageSize: 24,
            name: localStorage.getItem('ms_username'),
            kind:[],
            value:1,
            inventory:[],
            tableData: [],
            pageTotal:null,
            form: {},
            idx: -1,
            editVisible: false,
        };
    },
    components: {
    },
    created() {
        this.getDate();
    },
    mounted() {
       /*  axios.get('http://localhost:8181/inventory/findAll',this.query).then(resp=>{
             this.inventory=resp.data;
             this.pageTotal=resp.data.length;
        });*/
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        },
        totalPrice(){
            let totalPrice = 0;
            Object.values(this.shopCart).forEach((goods,index)=>{
                totalPrice += goods.costprice * goods.goodnum;
            });
            return totalPrice*100;
        },

        ...mapState(['shopCart','profit']),
    },
    methods: {
        ...mapMutations(["ADD_GOODS","INIT_SHOP_CART","REDUCE_CART","CHANGE_NUM","PUSH_PROFIT"]),
        //分页
        getDate() {
            axios.get('http://localhost:8181/inventory/findAllPage/0/24',).then(resp=>{
                this.inventory=resp.data.content;
                //console.log(resp.data.content);
                this.pageTotal=resp.data.totalElements;
            });
        },
        // 每页显示的条数
        handlePageChange(currentPage) {
            let pageNow=currentPage-1;
            axios.get('http://localhost:8181/inventory/findAllPage/'+pageNow+'/24').then(resp=>{
                this.inventory=resp.data.content;
                this.pageTotal=resp.data.totalElements;
            });
        },
        // 编辑操作
        handleEdit(index,row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            console.log(this.tableData[index].id);
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            let goodId=this.tableData[this.idx].id;
            let num =parseInt(this.form.num)
            this.CHANGE_NUM({
                goodid:goodId,
                num:num,
            });
        },
        //加入购物车
        addToCart(goods){
            this.ADD_GOODS({
                goodid:goods.goodid,
                goodname:goods.goodname,
                goodimg:goods.goodimg,
                costprice:goods.costprice,
                unitprice:goods.unitprice,
            });
            let cartArr=getStore('shopCart');
            let arr=JSON.parse(cartArr);
            let arr1=[];
            //对象转数组
            Object.values(arr).forEach((goods,index)=>{
              arr1.push(goods);
            });
            this.tableData=arr1;
            let sellElement={
                profitid:parseInt(getTimeNum()),
                goodid:goods.goodid,
                goodname:goods.goodname,
                goodimg:goods.goodimg,
                profitprice:goods.costprice-goods.unitprice,
                costprice:goods.costprice,
                profittime: new Date(),
            };
            this.PUSH_PROFIT(sellElement);
            console.log(this.profit);
        },
        //删除
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                    let goodid=row.id;
                    this.REDUCE_CART({goodid});
                })
                .catch(() => {});
        },
        //结算
        settlement() {
            let cartArr=getStore('shopCart');
            let arr=JSON.parse(cartArr);
            console.log(arr);
            if(arr !== null){
                let time=parseInt(getTimeNum());
                let timed=new Date().getTime();
                //console.log(timed);
                let order={orderid:time,allmoney: 0,allnum: 0,createtime: timed};
                Object.values(this.shopCart).forEach((goods,index)=>{
                    order.allmoney += goods.costprice * goods.goodnum;
                    order.allnum +=goods.goodnum;
                });
                //console.log(order);
                let arr1=[];
                Object.values(arr).forEach((value,index)=>{
                    value['orderid']=time;
                    value['createtime']=timed;
                    arr1.push(value);
                });
                //console.log(arr1);
                //订单表
                axios.post('http://localhost:8181/order/saveOrderMaster',order).then(resp=>{
                    console.log(resp);
                });
                //订单详情表
                axios.post('http://localhost:8181/orderDetail/saveOrderDetail',arr1).then(resp=>{
                    console.log(resp);
                });
                let newList=[];
                Object.values(this.profit).forEach((value,index)=>{
                    newList.push(value);

                });
                console.log(newList);
                axios.post('http://localhost:8181/profit/saveProfit',newList).then(resp=>{
                    console.log(resp);
                });

            }
            this.tableData=[];
            console.log(this.shopCart);
            removeStore('shopCart');
            location.reload();
        },

     }
};
</script>
<style scoped>
    .current-cart{
        width: 100%;
        height: 550px;
        border: 1px solid #666666;
    }
    .current-cart .current-cart-header{
        width: 100%;
        height: 40px;
        background: #d0d0d0;
        text-align: center;
        font-size: 18px;
        line-height: 40px;
    }
    /deep/ .grid-content {
        height: auto  !important;
        align-items: initial !important;
    }
   /deep/ .van-icon__image{
       width: 2.5em;
       height: 2.2em;
       object-fit: contain;

    }
/*/deep/   .el-pagination{
    text-align: center;
}*/
.el-row {
    margin-bottom: 20px;
}
    .van-submit-bar{
        position: relative;
    }

/deep/ .van-tabs--line .van-tabs__wrap  {
    height: 60px;
}
.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
