<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="商品ID">
                        <el-input v-model="form.goodid"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goodname"></el-input>
                    </el-form-item>
                    <el-form-item label="种类">
                        <el-select v-model="form.goodkind" placeholder="请选择">
                            <el-option key="bbk" label="饮料" value="饮料"></el-option>
                            <el-option key="xtc" label="酒水" value="酒水"></el-option>
                            <el-option key="imoo" label="糕点" value="糕点"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品单位">
                        <el-input v-model="form.goodsku"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goodnum"></el-input>
                    </el-form-item>
                    <el-form-item label="商品单价">
                        <el-input v-model="form.unitprice"></el-input>
                    </el-form-item>
                    <el-form-item label="商品售价">
                        <el-input v-model="form.costprice"></el-input>
                    </el-form-item>
                    <el-form-item label="商品图片">
                        <el-input v-model="form.goodimg"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
export default {
    name: 'baseform',
    data() {
        return {
            form: {
                goodid: 0,
                goodname: '',
                goodkind: '',
                goodsku: '',
                goodnum: 0,
                unitprice:0,
                costprice:0,
                goodimg: '',
            }
        };
    },
    methods: {
        onSubmit() {
            axios.post('http://localhost:8181/inventory/addGood',this.form).then(resp=>{
                console.log(resp);
                console.log(this.form);
            });
            console.log(this.form);


        }
    }
};
</script>
