import Vue from "vue";
import format from "element-ui/src/locale/format";
import  moment from 'moment'

Vue.filter('moneyFormat',value=>{
    return Number(value).toFixed(2);
});
Vue.filter('timeFormat',(value,format='YYYY-MM-DD HH:mm:ss')=>{
    return moment(value).format(format);
});
Vue.filter('timeFormatA',value=>{
    let times=Date.parse(value);
    return new Date(parseInt(times) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')

});
