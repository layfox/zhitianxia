<template>
	<view class="page">
		<!-- <view class="status_bar"> -->
			<!-- 这里是状态栏 -->
		<!-- </view> -->
		<view>
			<view class="top-bg">
				<view class="logo-box">
					<image class="logo-img" src="/static/login/logo@2x.png" mode=""></image>
				</view>
			</view>
			
			<view class="form-box">
				<form @submit="formSubmit">
					<view class="uni-form-item">
						<image src="../../static/login/user@2x.png" mode="aspectFit" class="icon"></image>
						<input class="uni-input" name="account" v-model="account" placeholder="请输入登录账号"
							placeholder-class="input-pl" />
					</view>
					<view class="uni-form-item">
						<image src="/static/login/password@2x.png" mode="aspectFit" class="icon"></image>
						<input class="uni-input" name="password" v-model="password" placeholder="请输入登录密码"
							placeholder-class="input-pl" />
					</view>
					<view class="uni-btn-v">
						<button style="margin-top: 60upx;" form-type="submit" class="submit">登录</button>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: "",
				password: ""
			}
		},
		onLoad(option) {
			
		},
		onShow() {
			
		},
		methods: {
			formSubmit: function(e) {
				var that = this
				if (!formdata.account) {
					return uni.showToast({
						title: '请输入登录账号',
						icon: 'none',
						duration: 1000
					});
				}
				if (!formdata.password) {
					return uni.showToast({
						title: '请输入登录密码',
						icon: 'none',
						duration: 1000
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		background: #FFFFFF;
		height: 100vh;
	}
	
	.top-bg{
		height: 456upx;
		width: 100%;
		background: url('../../static/login/bg@2x.png') no-repeat;
		background-size: 100% 100%;
		position: relative;
		.logo-box{
			width: 311upx;
			height: 295upx;
			position: absolute;
			left: 50%;
			transform: translate(-50%,0);
			top: 240upx;
			padding: 0!important;
			//bottom: -79upx;
			.logo-img {
				width: 311upx;
				height: 295upx;
			}
		}
	}
	
	
	
	.back-button{
		width: 174upx;
		height: 48upx;
		border: 1px solid #CBCBCB;
		border-radius: 24upx;
		font-size: 20upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #424242;
		line-height: 48upx;
		text-align: center;
		margin-top: 26upx;
	}

	.bottom-box{
		position: fixed;
		bottom: 54upx;
		left: 50%;
		transform: translate(-50%,0);
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.bottom-box-bottom{
			width: 54upx;
			height: 54upx;
			margin-top: 30upx;
		}
		.bottom-box-top{
			width:483upx;
			position: relative;
			display: flex;
			justify-content: center;
			.bottom-box-top-line{
				width: 483upx;
				height: 2upx;
				position: absolute;
				top: 50%;
				transform: translate(0,-50%);
			}
			.bottom-box-top-text{
				font-size: 24upx;
				font-family: HarmonyOS Sans SC;
				font-weight: 500;
				color: #999999;
			}
		}
	}

	.form-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 116upx;
	}

	.icon {
		width: 44upx;
		height: 44upx;
		margin: 0 29upx 0 0;
	}

	.uni-form-item {
		display: flex;
		height: 90upx;
		background: rgba(255, 255, 255, .1);
		align-items: center;
		border-radius: 12upx;
		//margin-bottom: 40upx;
		width: 600upx;
		//padding: 0 35upx;		
		border-bottom: 1px solid #EEEEEE;
	}

	.uni-input {
		flex: auto;
		font-size: 30upx;
	}

	.input-pl {
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #D1D1D1;
	}

	.send {
		background: transparent;
		color: #545454;
		font-weight: 500;
		font-size: 30upx;
		padding: 0;
		flex-shrink: 0;
	}

	.send[disabled] {
		background: transparent;
		color: #545454;
		font-size: 30upx;
		padding: 0;
		flex-shrink: 0;
	}

	.send:after {
		border: 0;
	}

	.uni-btn-v {
		display: flex;
		flex-direction: column;
		align-items: center;
		.uni-btn-v-text {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			//margin-bottom: 20upx;
			font-size: 24upx;
			color: #F1F1F1;
			transform: scale(0.8);
			color: rgba(209, 209, 209, 1);
			margin-top: 60upx;
			.radio {
				transform: scale(0.8);
				margin-right: 20upx;
			}
			
			.text{
				color: rgba(84, 84, 84, 1);
				text-decoration: underline;
				margin-left: 4upx;
			}
			
		}

		.uni-btn-v-text_1 {
			width: 100%;
			display: flex;
			//justify-content: center;
			align-items: center;
			margin-bottom: 20upx;
			font-size: 30upx;
			color: #F1F1F1;

			.radio {
				transform: scale(0.8);
			}

		}
	}

	.button-img {
		position: fixed;
		bottom: 172upx;
		width: 80upx;
		height: 80upx;
		background-color: #FFFFFF;
		border-radius: 50%;
		transform: translate(-50%, 0);
		left: 50%;
	}

	.button-text {
		text-align: center;
		padding: 0 40upx;
		color: #F1F1F1;
		font-size: 24upx;
		position: fixed;
		bottom: 48upx;
	}

	.submit {
		width: 598upx;
		height: 90upx;
		background: #2190EA;
		border-radius: 45upx;
		font-size: 34upx;
		font-family: HarmonyOS Sans SC;
		font-weight: 400;
		color: #FFFFFF;
	}
</style>
