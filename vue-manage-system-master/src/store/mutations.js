import {
    ADD_GOODS,
    INIT_SHOP_CART,
    REDUCE_CART,
    CHANGE_NUM,
    PUSH_PROFIT,
    SELECTED_SINGER_GOODS,
    SELECTED_All_GOODS,
    CLEAR_CART,
    USER_INFO,
    INIT_USER_INFO,
    RESET_USER_INFO
} from './mutations-type'

import {getStore, removeStore, setStore} from './../utils/global'
import Vue from 'vue'
export default {
    // 1. 往购物车中添加数据
    [ADD_GOODS](state, {goodid, goodname, goodkind, costprice,goodimg,unitprice}){
        let shopCart = state.shopCart;
        // 1.1 判断商品是否存在
        if(shopCart[goodid]){ // 存在
            shopCart[goodid]['goodnum']++;
        }else { // 不存在
            shopCart[goodid] = {
                "goodnum": 1,
                "goodid": goodid,
                "goodname": goodname,
                "goodkind":goodkind,
                "goodimg": goodimg,
                "costprice": costprice,
                "unitprice":unitprice
            }
        }
        // 1.2  产生新对象
        state.shopCart = {...shopCart};
        // 1.3 存入本地
        setStore('shopCart', state.shopCart);
    },
    [PUSH_PROFIT](state,sellElements){
        let profit = state.profit;
        profit.push(sellElements);
        state.profit=[...profit]
    },

// 2. 页面初始化，获取购物车的数据(本地)
    [INIT_SHOP_CART](state){
        let initCart = getStore('shopCart');
        if(initCart){
            state.shopCart = JSON.parse(initCart);
        }
    },
    // 3. 把商品移出购物车
    [REDUCE_CART](state, {goodid}){
        let shopCart = state.shopCart;
        let goods = shopCart[goodid];
       /* if(goods){ // 找到该商品
            if(goods['num'] > 0){
                goods['num']--;
                // 3.1 判断是否只有0个
                if(goods['num'] === 0){
                    delete shopCart[goodid];
                }
            }else {
                goods = null;
            }
            // 3.2 同时数据
            state.shopCart = {...shopCart};
            setStore('shopCart', state.shopCart);
        }*/
        delete shopCart[goodid];
        // 3.2 同时数据
        state.shopCart = {...shopCart};
        setStore('shopCart', state.shopCart);
    },
    // 4. 更改购物车商品数量
    [CHANGE_NUM](state,{goodid,num}){
        let shopCart=state.shopCart;
        if(shopCart[goodid]){
            shopCart[goodid]['goodnum']=num;
        }
        state.shopCart = {...shopCart};
        // 1.3 存入本地
        setStore('shopCart', state.shopCart);
    }

}
