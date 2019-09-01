var bizId = 1
var Http = {
    HOST:   window.location.host.includes('172.16')? window.location.origin: 'http://native.youquanyun.com',
    API_URL:{
        'HOMEGOODSLIST': '/api/'+bizId+'/amoy/home/goods-list', // 商品列表

        'TAOBAOGOODSDETAIL': '/api/'+bizId+'/amoy/taobao/goods-detail', // 商品详情
        'TAOBAOGOODSITEM': '/api/'+bizId+'/amoy/taobao/goods-item', // 商品详情
        // 订单红包
        'USERCOLLECTION': '/api/'+bizId+'/amoy/user/collection', // 收藏商品
        'USERREDINFO': '/api/'+bizId+'/amoy/user/red-info', // 红包领取详情
        'USERRECEIVERED': '/api/'+bizId+'/amoy/user/receive-red', // 领取红包
        'USERREDDETAIL': '/api/'+bizId+'/amoy/user/red-detail', // 红包详情接口
        'USERGRABCOUPONLOG': '/api/'+bizId+'/amoy/user/grab-coupon-log', // 红包机会日志
        'USERREDRULE': '/api/'+bizId+'/amoy/user/red-rule', // 红包规则接口
        'USERREDLIST': '/api/'+bizId+'/amoy/user/red-list', // 红包页面接口
        // 信用卡
        'HOMECREDITINDEX': '/api/'+bizId+'/amoy/home/credit-index', // 信用卡首页
        'HOMECARDURL': '/api/'+bizId+'/amoy/home/card-url', // 获取卡片地址
        'HOMECARDLIST': '/api/'+bizId+'/amoy/home/card-list', // 卡片列表
        'HOMECARDDETAIL': '/api/'+bizId+'/amoy/home/card-detail', // 卡片详情
        'HOMECARDAPPLY': '/api/'+bizId+'/amoy/home/card-apply', // 申请卡片列表
    },

	get: function(url, param, loading) {
        var token = '';
        axios.interceptors.request.use(
            config => {
                // 这里写死一个token，你需要在这里取到你设置好的token的值
                const token = token
                if (token) {
                    // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
                    config.headers.token = token;
                }
                return config
            },
            error => {
                return Promise.reject(error)
            }
        );
        const CancelToken = axios.CancelToken;
        axios({
            method: 'get',
            url,
            params: param,
            cancelToken: new CancelToken(c => {
                cancel = c
            })
        }).then(res => {
            if (loading) {
                store.commit('hide')
            }
            if (res.data.code === 0) {
                resolve(res.data)
            }else if(res.data.code === 403){
                // dsBridge.call("toLogin")
            } else {
				resolve(res.data)
                //Vue.$vux.toast.text(res.msg)
            }
        }).catch(error => {
            if (Vue.$vux.loading) {
                Vue.$vux.loading.hide()
            }
            Vue.$vux.toast.text(error.message, 'top')
        })
    },
    // post请求
    post: function(url, param, loading, show) {
		  var token = '';
        axios.interceptors.request.use(
            config => {
                // 这里写死一个token，你需要在这里取到你设置好的token的值
                const token = ''
				//const token = 'eyJ1aWQiOjUwODIsInRpbWVzdGFtcCI6MTU2MzE3MzA0Nywic2lnbiI6IjRiODdjOWFmOTBlYTBhYjgxOGFhNDNmZGY1ZTY1ZGZjIn0='
                if (token) {
                    // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
                    config.headers.token = token;
                }
                return config
            },
            error => {
                return Promise.reject(error)
            }
        );

		return new Promise((resolve, reject) => {
			if (loading) {
			//store.commit('show')
			}
			if (!param) {
				param = {}
			}
			const CancelToken = axios.CancelToken;
				axios.defaults.transformRequest = (data) => {
				data = Qs.stringify(data)
				return data
			}
		  axios({
			method: 'post',
			url,
			data: param,
			cancelToken: new CancelToken(c => {
				cancel = c
			})
		  }).then(res => {
			if (loading) {
			  //store.commit('hide')
			  // activity.closeKeyFrame()
			  // store.commit('hide')
			}
			if (!res) {
			  return
			}
			if (res.data.code === 0) {
			  resolve(res.data)
			}else if(res.data.code === 403){
                // dsBridge.call("toLogin")
            } else {
			  if (show) {
				resolve(res.data)
			  } else {
				  resolve(res.data)
				//Vue.$vux.toast.text(res.msg)
			  }
			}
		  }).catch(error => {
			if (loading) {
			  //store.commit('hide')
			}
			//if (Vue.$vux.loading) {
			  //Vue.$vux.loading.hide()
			//}
			if (error.message !== '操作取消') {
			  resolve(error)
			}
			// if (error.message) {
			// Vue.$vux.toast.text(error.message, 'top')
			// }
		  })
		})
	},

    getToken: function(){
        var t = utils.storage.get('token');
        return t;
    },
    handleRes: function(params,res){
        if(typeof res == 'string' ){
            res = JSON.parse(res)
        }
        if(res.code==0){
            params.success && params.success(res)
        } else {
            if(res.code==1 || res.code == 2 || res.code == 3 || res.code == 4){
                if(params.error){
                    params.error(res);
                } else {
                    //api.toast({msg:res.msg});
                }
            }else if(res.code==403){
                //api.toast({msg:'授权失效或未授权,请重新登录'});
				utils.auth.toLogin();
                utils.storage.remove('token')
                utils.storage.remove('userInfo')

            }
        }
    }
}
