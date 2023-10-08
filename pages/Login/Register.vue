<template>
  <view class="content">
    <view class="header">
      <image src="../../static/shilu-login/logo.png"></image>
    </view>

    <view class="list">
		<view class="list-call">
		  <image class="img" src="/static/shilu-login/4.png"></image>
		  <input class="sl-input" v-model="username" placeholder="请输入注册账号" />
		</view>
		<view class="list-call">
		  <image class="img" src="/static/shilu-login/4.png"></image>
		  <input class="sl-input" v-model="nickname" placeholder="请输入昵称,非必填" />
		</view>
      <view class="list-call">
        <image class="img" src="/static/shilu-login/1.png"></image>
        <input class="sl-input" v-model="phone" type="number" maxlength="11" placeholder="手机号" />
      </view>
      <view class="list-call">
        <image class="img" src="/static/shilu-login/2.png"></image>
        <input class="sl-input" v-model="password" type="text" maxlength="32" placeholder="登录密码" password />
      </view>
	  <view class="list-call">
	    <image class="img" src="/static/shilu-login/2.png"></image>
	    <input class="sl-input" v-model="rpassword" type="text" maxlength="32" placeholder="确认密码" password />
	  </view>
      <!--  -->
      <!-- <view class="list-call">
        <image class="img" src="/static/shilu-login/4.png"></image>
        <input class="sl-input" v-model="invitation" type="text" maxlength="12" placeholder="邀请码 可不填写" />
      </view> -->

    </view>

    <view class="button-login" hover-class="button-hover" @tap="bindLogin">
      <text style="font-size: 40upx;">注册账号</text>
    </view>
  </view>
</template>

<script>
  var _this, js;
  import {
  	access
  } from '@/api/request.js'
  export default {
    onLoad(e) {
		if(e.uid){
			this.invitation=e.uid
		}
    },
    onUnload() {
      clearInterval(js)
      this.second = 0;
    },
    data() {
      return {
		username: '',
        phone: '',
        password: '',
		nickname: '',
		rpassword: '',
        code: '',
        invitation: '',
        agreement: true,
        showPassword: false,
        second: 0,
		iskq:0,
      };
    },
    computed: {
      yanzhengma() {
        if (this.second == 0) {
          return '获取验证码';
        } else {
          if (this.second < 10) {
            return '重新获取0' + this.second;
          } else {
            return '重新获取' + this.second;
          }
        }
      }
    },
    onUnload() {
      this.clear()
    },
    methods: {
      clear(){
        clearInterval(js)
        js = null
        this.second = 0
      },
      display() {
        this.showPassword = !this.showPassword
      },
      agreementSuccess() {
        this.agreement = !this.agreement;
      },
      async getcode() {
        if (this.phone.length != 11) {
          uni.showToast({
            icon: 'none',
            title: '手机号不正确'
          });
          return;
        }
        if (this.second > 0) {
          return;
        }
        this.second = 60;
        //请求业务
        js = setInterval(function() {
          _this.second--;
          if (_this.second == 0) {
            _this.clear()
          }
        }, 1000)
		//if(this.second > 0) return;
		// 请求服务器，发送验证码
		var data ={'phone':this.phone}
		let [err,res] =await this.$httpas.post('/api/ems/index',data);
		if (!this.$httpas.errorCheck(err,res)) return;
		
		console.log(res.data.ok)
		console.log(res.data.data)
		if(res.data.ok == 1){
			uni.setStorage({//缓存配置信息
				key: 'yzmss',  
				data: res.data.data
			})
			uni.showToast({ title: res.data.msg,icon:"none" });
		}else{
			uni.showToast({ title: res.data.msg,icon:"none" });
		}
      },
      bindLogin() {
		// const usernameReg = /^[a-zA-Z0-9]{4,16}$/
		// const psdReg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*? ]).*$/
		if (!this.username) {
			uni.showToast({
			  icon: 'none',
			  title: '登录账号不能为空'
			});
			return;
		}
		// if (!usernameReg.test(this.username)) {
		// 	uni.showToast({
		// 	  icon: 'none',
		// 	  title: '登录账号必须是4-16位数字和字母组成'
		// 	});
		// 	return;
		// }
        if (this.phone.length != 11) {
          uni.showToast({
            icon: 'none',
            title: '手机号不正确'
          });
          return;
        }
        if (this.password.length < 6) {
          uni.showToast({
            icon: 'none',
            title: '密码不得少于六位'
          });
          return;
        }
		// if (!psdReg.test(this.password)) {
		// 	uni.showToast({
		// 	  icon: 'none',
		// 	  title: '密码只能是字母、数字和特殊字符'
		// 	});
		// 	return;
		// }
		if (this.password != this.rpassword) {
			uni.showToast({
			  icon: 'none',
			  title: '二次密码不一致'
			});
			return;
		}
        // if (this.code.length != 4) {
        //   uni.showToast({
        //     icon: 'none',
        //     title: '验证码不正确'
        //   });
        //   return;
        // }
		// let yzmss = uni.getStorageSync('yzmss');
		// if(this.code*1!=yzmss*1){
		// 	uni.showToast({ title: '短信验证码错误',icon:"none" });
		// 	return false;
		// }
		this.zc();
      },
	  async zc(){
	  	let _this=this;
	  	let data = {'phone':this.phone,'username':this.username,'password':this.$Md5(this.password), nickname: this.nickname};
	  	access({
	  		url: '/api/admin/register',
	  		method: 'post',
	  		param: data
	  	}, res => {
			console.log(res)
	  		if (res.code === 200) {
	  			uni.navigateTo({
	  				url: '/pages/Login/Login'
	  			})
	  		} else {
				uni.showToast({
				  icon: 'none',
				  title: res.msg
				});
			}
	  	}, function() {
	  	}, true)
	  }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .header {
    width: 161rpx;
    height: 161rpx;
    background: rgba(63, 205, 235, 1);
    box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);
    border-radius: 50%;
    margin-top: 30rpx;
    margin-left: auto;
    margin-right: auto;
  }

  .header image {
    width: 161rpx;
    height: 161rpx;
    border-radius: 50%;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
    padding-left: 70rpx;
    padding-right: 70rpx;
  }

  .list-call {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    color: #333333;
    border-bottom: 0.5px solid #e2e2e2;
  }

  .list-call .img {
    width: 40rpx;
    height: 40rpx;
  }

  .list-call .sl-input {
    flex: 1;
    text-align: left;
    font-size: 32rpx;
    margin-left: 16rpx;
  }

  .yzm {
    color: #FF7D13;
    font-size: 24rpx;
    line-height: 64rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;
    width: auto;
    height: 64rpx;
    border: 1rpx solid #FFA800;
    border-radius: 50rpx;
  }

  .yzms {
    color: #999999 !important;
    border: 1rpx solid #999999;
  }

  .button-login {
    color: #FFFFFF;
    font-size: 34rpx;
    width: 470rpx;
    height: 100rpx;
    line-height: 100rpx;
    background: linear-gradient(-90deg, rgba(75, 196, 93, 1), rgba(188, 226, 158, 1));
    box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
    border-radius: 50rpx;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100rpx;
  }

  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
  }

  .agreement {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    margin-top: 80rpx;
    color: #FFA800;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }

  .agreement image {
    width: 40rpx;
    height: 40rpx;
  }
</style>
