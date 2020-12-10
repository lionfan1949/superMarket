/*
  本地化存储
*/
export const setStore = (name, content) =>{
    if(!name) return;
    if(typeof content !== 'string'){
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
};

/*
  本地化获取
*/
export const  getStore = (name)=>{
    if(!name) return;
    return window.localStorage.getItem(name);
};

/*
  本地化删除
*/
export const  removeStore = (name)=>{
    if(!name) return;
    return window.localStorage.removeItem(name);
};
export const  getTimeNum=()=> {
    let date = new Date();  //当前标准时间格式
    let year = date.getFullYear(); //取得四位数的年份
    let month = date.getMonth() + 1; //返回0~11之间的数字，0代表一月，11代表12月
    let day = date.getDate(); //返回天数，0~31，getDay()返回的是星期几（0~6）
    let hour = date.getHours(); //获取小时
    let minute = date.getMinutes(); //获取分钟
    let second = date.getSeconds(); //获取秒
    return year + "" + month + "" + day + "" + hour + "" + minute + "" + second;
};
export const  getNowDateAfterFormat=()=> {
    let date = new Date();
    let year = date.getFullYear().toString().padStart(4, "0"),
        month = (date.getMonth() + 1).toString().padStart(2, "0"),
        day = date.getDate().toString().padStart(2, "0"),
        hour = date.getHours().toString().padStart(2, "0"),
        min = date.getMinutes().toString().padStart(2, "0"),
        sec = date.getSeconds().toString().padStart(2, "0");
    return year + '-' +
        month + '-' +
        day + ' ' +
        hour + ':' +
        min + ':' +
        sec;
};

export const  ISO8601DateStr2Date =(string)=> {
    let regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    if(string)
    {
        var d = string.match(new RegExp(regexp));
        var offset = 0;
        var date = new Date(d[1], 0, 1);

        if (d[3]) {
            date.setMonth(d[3] - 1);
        }
        if (d[5]) {
            date.setDate(d[5]);
        }
        if (d[7]) {
            date.setHours(d[7]);
        }
        if (d[8]) {
            date.setMinutes(d[8]);
        }
        if (d[10]) {
            date.setSeconds(d[10]);
        }
        if (d[12]) {
            date.setMilliseconds(Number("0." + d[12]) * 1000);
        }
        if (d[14]) {
            offset = (Number(d[16]) * 60) + Number(d[17]);
            offset *= ((d[15] === '-') ? 1 : -1);
        }
        offset -= date.getTimezoneOffset();
        var time = (Number(date) + (offset * 60 * 1000));
        return time;
    }
    else
    {
        return null;
    }
};
//Iso860时间传化为正常格式
export const Iso8601ToFormat=(value)=>{
    let time=parse(value);
    return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,' ')

}
