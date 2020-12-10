<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>
                <!--<el-input  v-model="name" placeholder="用户名" class="handle-input mr10"></el-input>-->
                <div class="block" style="display: inline-block">
                    <el-date-picker
                            v-model="value2"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd hh:mm:ss"
                    >
                    </el-date-picker>
                </div>
                <el-button style="margin-left: 8px" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary"  @click="cancelSearch">取消搜索</el-button>
                <span style="margin-left: 30px">销售额：</span><span>{{sellNum}}</span><span style="margin-left: 10px">利润：</span><span>{{sellProfit}}</span>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="profitid" label="销售ID" width="150" align="center"></el-table-column>
                <el-table-column prop="goodid" label="商品ID"></el-table-column>
                <el-table-column prop="goodname" label="商品名称"></el-table-column>
                <el-table-column prop="profitprice"  label="商品利润" ></el-table-column>
                <el-table-column prop="profittime"  label="售出时间"  width="180"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <!--<el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>-->
    </div>
</template>

<script>
    import axios from 'axios';
    import { fetchData } from '../../api/index';
    import {getStore,getNowDateAfterFormat,ISO8601DateStr2Date} from "../../utils/global";
    export default {
        name: 'basetable',
        data() {
            return {
                sellNum:0,
                sellProfit:0,
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10,
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value2: '',
            };
        },
        created() {


        },
        mounted() {
            this.getOrderDate();
            this.getPrice();
        },
        methods: {
            //获取数据
            getOrderDate() {
                axios.get('http://localhost:8181/profit/findAllPage/0/7',).then(resp=>{
                    this.tableData=resp.data.content;
                    Object.values(resp.data.content).forEach((value,index)=>{
                        let timesss= Date.parse(value.profittime);
                        this.tableData[index].profittime=new Date(parseInt(timesss)).toLocaleString()
                    });
                    /* console.log(resp.data.content);
                     console.log(this.tableData[0].createtime);
                     console.log(ISO8601DateStr2Date(this.tableData[0].createtime));
                     console.log(Date.parse(this.tableData[0].createtime));
                     let times=Date.parse(this.tableData[0].createtime);
                     console.log(typeof times);
                     let timess=new Date(parseInt(times)*1000).toLocaleString().replace(/:\d{1,2}$/,' ');
                     console.log(timess);*/
                });
            },
            // 分页导航
            handlePageChange(currentPage) {
                let pageNow=currentPage-1;
                axios.get('http://localhost:8181/profit/findAllPage/'+pageNow+'/7').then(resp=>{
                    this.tableData=resp.data.content;
                    this.pageTotal=resp.data.totalElements;
                    Object.values(resp.data.content).forEach((value,index)=>{
                        let timesss= Date.parse(value.profittime);
                        this.tableData[index].profittime=new Date(parseInt(timesss)).toLocaleString()
                    });
                });
            },
            //取消搜索
            cancelSearch() {
                this.value2='';
                this.getOrderDate();
            },
            // 触发搜索按钮
            handleSearch() {
                let arr=[];
                arr.push(this.value2[0]);
                arr.push(this.value2[1]);
                console.log(arr[0]);
                console.log(arr[1]);
                /*  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"*/
                axios({
                    methods: "GET",
                    url:'http://localhost:8181/profit/findByDate',
                    contentType: 'application/json;charset=UTF-8',
                    params: {
                        beforeDate: arr[0],
                        afterDate: arr[1],
                    }
                }).then(resp=>{
                    console.log(resp);
                    this.tableData=resp.data;
                    Object.values(resp.data).forEach((value,index)=>{
                        let timesss= Date.parse(value.profittime);
                        this.tableData[index].profittime=new Date(parseInt(timesss)).toLocaleString()
                    });
                })
                axios({
                    methods: "GET",
                    url: 'http://localhost:8181/profit/getDateProfit',
                    contentType: 'application/json;charset=UTF-8',
                    params: {
                        beforeDate: arr[0],
                        afterDate: arr[1],
                    }
                }).then(resp=>{
                    this.sellNum=resp.data[0]
                    this.sellProfit=resp.data[1];

                })
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                        console.log(row.autoid);
                        axios.delete('http://localhost:8181/profit/deleteByid/'+row.autoid+'').then(resp=>{
                            console.log(resp);
                        });
                        this.getPrice();

                    })
                    .catch(() => {});
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            //获取利润和销售
            getPrice() {
                axios.get('http://localhost:8181/profit/getAllProfit').then(resp=>{
                    this.sellNum=resp.data[0]
                    this.sellProfit=resp.data[1];
                })
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
