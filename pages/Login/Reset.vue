<template>
  <view class="content">
    <view class="header">
      <image src="../../static/shilu-login/logo.png"></image>
    </view>

    <view class="list">
		<view class="list-call">
		  <image class="img" src="/static/shilu-login/2.png"></image>
		  <input class="sl-input" v-model="password" type="text" maxlength="32" placeholder="请输入旧密码" password />
		</view>
	  <view class="list-call">
	    <image class="img" src="/static/shilu-login/2.png"></image>
	    <input class="sl-input" v-model="npassword" type="text" maxlength="32" placeholder="请输入新密码" password />
	  </view>
	  <view class="list-call">
	    <image class="img" src="/static/shilu-login/2.png"></image>
	    <input class="sl-input" v-model="rpassword" type="text" maxlength="32" placeholder="确认密码" password />
	  </view>
    </view>

    <view class="button-login" hover-class="button-hover" @tap="bindLogin">
      <text style="font-size: 40upx;">修改密码</text>
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
        password: '',
        npassword: '',
		rpassword: ''
      };
    },
    methods: {
      bindLogin() {
        if (this.password.length < 6) {
          uni.showToast({
            icon: 'none',
            title: '请输入正确的旧密码'
          });
          return;
        }
		if (this.npassword.length < 6) {
		  uni.showToast({
		    icon: 'none',
		    title: '新密码不得少于六位'
		  });
		  return;
		}
		if (this.npassword != this.rpassword) {
			uni.showToast({
			  icon: 'none',
			  title: '二次密码不一致'
			});
			return;
		}
		this.zc();
      },
	  async zc(){
	  	let _this=this;
	  	let data = {'password':this.$Md5(this.password), 'npassword': this.$Md5(this.npassword)};
	  	access({
	  		url: '/api/admin/changePassword',
	  		method: 'post',
	  		param: data
	  	}, res => {
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
