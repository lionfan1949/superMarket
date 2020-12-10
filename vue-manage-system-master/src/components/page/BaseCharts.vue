<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> schart图表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
         <!--   <div class="plugins-tips">
                vue-schart：vue.js封装sChart.js的图表组件。
                访问地址：
                <a
                    href="https://github.com/lin-xin/vue-schart"
                    target="_blank"
                >vue-schart</a>
            </div>-->
            <div class="schart-box">
                <div class="content-title">柱状图</div>
                <schart class="schart" canvasId="bar" :options="options1"></schart>
            </div>
            <div>
                <span>销售额：{{sellNum}}</span>元<span></span>&nbsp&nbsp&nbsp&nbsp<span>利润额：{{sellProfit}}</span><span>元</span>
            </div>
            <div class="schart-box">
                <div class="content-title">折线图</div>
                <schart class="schart" canvasId="line" :options="options2"></schart>
            </div>
            <div class="schart-box">
                <div class="content-title">饼状图</div>
                <schart class="schart" canvasId="pie" :options="options3"></schart>
            </div>
            <div class="schart-box">
                <div class="content-title">环形图</div>
                <schart class="schart" canvasId="ring" :options="options4"></schart>
            </div>
        </div>
    </div>
</template>
<script>
import Schart from 'vue-schart';
import axios from  'axios';
import OrderTable from "./OrderTable";
export default {
    name: 'basecharts',
    components: {
        Schart
    },
    data() {
        return {
            options1: {
                type: 'bar',
                title: {
                    text: '最近一周各品类销售图'
                },
                bgColor: '#fbfbfb',
                labels: [(new Date().getDate()-6)+'/'+(new Date().getMonth()+1),
                    (new Date().getDate()-5)+'/'+(new Date().getMonth()+1),
                    (new Date().getDate()-4)+'/'+(new Date().getMonth()+1),
                    (new Date().getDate()-3)+'/'+(new Date().getMonth()+1),
                    (new Date().getDate()-2)+'/'+(new Date().getMonth()+1),
                    (new Date().getDate()-1)+'/'+(new Date().getMonth()+1),
                    (new Date().getDate())+'/'+(new Date().getMonth()+1)],
                datasets: [
                    {
                        label: '销售额',
                        fillColor: 'rgba(241, 49, 74, 0.5)',
                        data: [234, 278, 270, 190, 230,0,0]
                    },
                    {
                        label: '利润',
                        data: [164, 178, 190, 135, 160,0,0]
                    },

                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '最近几个月各品类销售趋势图'
                },
                bgColor: '#fbfbfb',
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 150, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [114, 138, 200, 235, 190]
                    }
                ]
            },
            options3: {
                type: 'pie',
                title: {
                    text: '服装品类销售饼状图'
                },
                legend: {
                    position: 'left'
                },
                bgColor: '#fbfbfb',
                labels: ['T恤', '牛仔裤', '连衣裙', '毛衣', '七分裤', '短裙', '羽绒服'],
                datasets: [
                    {
                        data: [334, 278, 190, 235, 260, 200, 141]
                    }
                ]
            },
            options4: {
                type: 'ring',
                title: {
                    text: '环形三等分'
                },
                showValue: false,
                legend: {
                    position: 'bottom',
                    bottom: 40
                },
                bgColor: '#fbfbfb',
                labels: ['vue', 'react', 'angular'],
                datasets: [
                    {
                        data: [500, 500, 500]
                    }
                ]
            },
            sellNum:0,
            sellProfit:0,
        };
    },
    created(){
        this.getData();
        this.getPrice()
    },
    mounted() {

    },
    methods: {
        getData() {
            console.log(this.options1.datasets[0].data);
            console.log(this.options1);
            axios.get('http://localhost:8181/statements/getCharts').then(resp => {
                console.log(resp);
                let arr = [];
                let arr1 = [];
                resp.data.forEach((value, index) => {
                    arr.unshift(value[0]);
                    arr1.unshift(value[1]);
                });
                this.options1.datasets[0].data = arr;
                this.options1.datasets[1].data = arr1;
                let time = new Date();
                console.log(time);
                console.log(new Date().getDate() + '/' + (new Date().getMonth() + 1));
                ;

            })

        },
        getPrice() {
            axios.get('http://localhost:8181/profit/getAllProfit').then(resp => {
                this.sellNum = resp.data[0]
                this.sellProfit = resp.data[1];
            });
        },
    }
};
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 600px;
    height: 400px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
</style>
