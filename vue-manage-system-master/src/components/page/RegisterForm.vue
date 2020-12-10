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
                    <el-form-item label="用户名字">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户电话">
                        <el-input v-model="form.num"></el-input>
                    </el-form-item>
                    <el-form-item label="职位">
                        <el-select v-model="form.position" placeholder="请选择">
                            <el-option key="bbk" label="收银员" value="收银员"></el-option>
                            <el-option key="xtc" label="仓库员" value="仓库员"></el-option>
                            <el-option key="imoo" label="老板" value="老板"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户密码">
                        <el-input v-model="form.password"></el-input>
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
                    name: '',
                    num: '',
                    position: '',
                    password: '',

                }
            };
        },
        methods: {
            onSubmit() {
                axios.post('http://localhost:8181/user/save',this.form).then(resp=>{
                    console.log(resp);
                    console.log(this.form);
                });
                console.log(this.form);
            }
        }
    };
</script>
