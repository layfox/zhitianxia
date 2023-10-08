import {
	domain
} from './domain'

function timediff(begin_time, end_time) {
	if (begin_time < end_time) {
		var starttime = begin_time;
		var endtime = end_time;
	} else {
		var starttime = end_time;
		var endtime = begin_time;
	}

	var time = endtime - starttime;
	return time;
}

function getCurrTime(value) {
	const date = new Date(value)
	const y = date.getFullYear()
	let MM = date.getMonth() + 1
	MM = MM < 10 ? ('0' + MM) : MM
	let d = date.getDate()
	d = d < 10 ? ('0' + d) : d
	let h = date.getHours()
	h = h < 10 ? ('0' + h) : h
	let m = date.getMinutes()
	m = m < 10 ? ('0' + m) : m
	
	return h + '' + m
}

function getCurrDate(value) {
	const date = new Date(value)
	const y = date.getFullYear()
	let MM = date.getMonth() + 1
	MM = MM < 10 ? ('0' + MM) : MM
	let d = date.getDate()
	d = d < 10 ? ('0' + d) : d
	
	return y + '' + MM + '' + d
}

export function access(apiObj, successCallback, failCallback, isNotShowLoading) {
	let userinfo = uni.getStorageSync('userinfo') || {};
	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	let curRoute = routes && routes.length && routes[routes.length - 1].route ? routes[routes.length - 1].route : '/pages/Index/Index'
	apiObj.param.token = userinfo.token;
	if (!isNotShowLoading) {
		uni.showLoading({
			title: '加载中',
			mask: true
		});
	}
	uni.request({
		url: domain() + apiObj.url,
		data: apiObj.param,
		method: apiObj.method,
		sslVerify:false,
		//timeout:120000,
		success: (res) => {
			console.log(res)
			if(res.data === undefined){
				console.log(res,JSON.stringify(apiObj.param))
			}
			if (!isNotShowLoading) {
				uni.hideLoading()
			}
			successCallback ? successCallback(res.data) : null
			//判断是否在登陆页
			if (apiObj.param.service != "messengePost" && apiObj.param.service != "mobileLogin" && apiObj.param.service != "elinkLogin") {
				//不在登陆页
				if (userinfo == '') {
					if(curRoute != 'pages/Login/Login'){
						uni.reLaunch({
							url: '/pages/Login/Login'
						});
					}
				} else {
					if (res.data.code == 502) {
						uni.showToast({
							icon: 'none',
							title: '您的登录已失效，请重新登录',
							duration: 1000,
							success: function() {
								uni.removeStorageSync('userinfo');
								uni.removeStorageSync('personalInfo');
								uni.reLaunch({
									url: '/pages/Login/Login'
								});
							}
						});
					}
				}
			}
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			// #ifdef APP-PLUS
			'referer':'/' + curRoute,
			// #endif
			'token':userinfo.token
		},
		fail: (res) => {
			console.log(res,"error")
			if (!isNotShowLoading) {
				uni.hideLoading()
			} 
			let msg = '';
			switch (res.errMsg) {//请求不到服务器数据
				case 'fail timeout':
				
					failCallback(404);
					break
					case 'Network Error':
					msg = '网络错误，请检查网络!'
					failCallback(404);
					break
				case 'timeout of 10000ms exceeded':
				msg = '请求超时，请检查网络!'
					failCallback(404);
					break
				case 'Request failed with status code 500':
					msg = '请求失败，错误代码：500!'
					//type = 'warning'
					//msg = '当前网络不稳定，请刷新重试!'
					failCallback(404);
					break
				default:
					msg = '无法连接服务器，请联系管理员!'
					failCallback(404);
					break
			}
			failCallback ? failCallback() : null
		},
	})
}
