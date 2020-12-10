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
               <!-- <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>-->
                <el-input v-model="searchValue" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary"  @click="cancelSearch">取消搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
               <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="goodid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="goodname" label="商品名称"></el-table-column>
                <el-table-column prop="goodkind" label="商品种类"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.goodimg"
                                :preview-src-list="[scope.row.goodimg]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsku" label="单位"></el-table-column>
                <el-table-column prop="goodnum" label="数量"></el-table-column>
                <el-table-column prop="unitprice" label="进价"></el-table-column>
                <el-table-column prop="costprice" label="售价"></el-table-column>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="商品ID">
                    <el-input v-model="form.goodid"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="form.goodname"></el-input>
                </el-form-item>
                <el-form-item label="商品种类">
                    <el-input v-model="form.goodkind"></el-input>
                </el-form-item>
                <el-form-item label="商品单位">
                    <el-input v-model="form.goodsku"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goodnum"></el-input>
                </el-form-item>
                <el-form-item label="商品进价">
                    <el-input v-model="form.unitprice"></el-input>
                </el-form-item>
                <el-form-item label="商品售价">
                    <el-input v-model="form.costprice"></el-input>
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
    export default {
        name: 'basetable',
        data() {
            return {
                    address: '',
                    searchValue: '',
                    pageIndex: 1,
                    pageSize: 10,
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getDate();
        },
        methods: {
            // 获取获取数据
            getDate() {
                axios.get('http://localhost:8181/inventory/findAllPage/0/6',).then(resp => {
                    this.tableData = resp.data.content;
                    this.pageTotal = resp.data.totalElements;
                })
            },
            // 每页显示的条数
            handlePageChange(currentPage) {
                let pageNow=currentPage-1;
                axios.get('http://localhost:8181/inventory/findAllPage/'+pageNow+'/6').then(resp=>{
                    this.tableData=resp.data.content;
                    this.pageTotal=resp.data.totalElements;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                console.log(typeof  this.searchValue);
                axios.get('http://localhost:8181/inventory/findByIdLike?goodid='+this.searchValue+'').then(resp=>{
                    console.log(resp);
                    this.tableData=resp.data;
                })
            },
            cancelSearch(){
                this.searchValue='';
                this.getDate();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('删除成功');

                        console.log(this.tableData[index].goodid);
                        console.log(this.tableData);
                         axios.delete('http://localhost:8181/inventory/deleteGood/'+this.tableData[index].goodid+'').then(resp=>{
                             console.log(resp);

                         });
                        this.tableData.splice(index, 1);


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
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;

            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.tableData, this.idx, this.form);
                console.log(this.form);
                axios.patch('http://localhost:8181/inventory/update',this.form).then(resp=>{
                      console.log(resp);
                  });
            },
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
