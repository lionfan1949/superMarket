<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="name">
                    <el-input v-model="param.name" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                 
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                 <el-select  v-model="value" placeholder="请选择工种" style="margin-left: 75px;margin-bottom: 20px">
                       <el-option
                               v-for="item in options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                       </el-option>
                   </el-select>

                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import service from '../../utils/request';
import axios from 'axios'
export default {
    data: function() {
        return {
            param: {
                name: '',
                password: '',
            },
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
                   options: [{
                    value: '收银员',
                    label: '收银员'
                }, {
                    value: '仓库员',
                    label: '仓库员'
                }, {
                    value: '财务',
                    label: '财务'
                }, {
                    value: '老板  ',
                    label: '老板'
                }],
                value: '',
        };
    },
    methods: {
        submitForm() {
            // this.$refs.login.validate(valid => {
            //     if (valid) {
            //         this.$message.success('登录成功');
            //         localStorage.setItem('ms_username', this.param.username);
            //         this.$router.push('/');
            //         console.log(valid);
                    
            //     } else {
            //         this.$message.error('请输入账号和密码');
            //         console.log('error submit!!');
            //         return false;
            //     }
            // });
              axios.post('http://localhost:8181/user/login/',this.param
                ).then(resp=>{
                    if(resp.data===''){
                        alert('用户名错误')
                    }
                   else if(resp.data.password !== this.param.password){
                        alert('密码错误')
                    }
                   else if(resp.data.position !== this.value){
                       alert('职业不符')
                    }
                   else {
                        this.$router.push({path: '/dashboard'});
                        localStorage.setItem('ms_username', this.param.name);
                    }
                });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
    
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>