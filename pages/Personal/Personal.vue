<template>
	<view class="container">
		<view class="header">
			<view class="head">
				<view class="title-box">个人中心</view>
			</view>
			<view class="per-head">
				<view class="cont">
					<view style="position: relative;" class="fx-box">
						<view class="left" @click="setHead">
							<image class="head-portrait" :src="avatarUrl" mode="aspectFill"></image>
							<view v-if="logined" class="compile-head">编辑</view>
						</view>
						<view class="right" v-if="logined">
							<view>
								<view class="p1">
									{{userInfo.nickname || '新用户'}}
								</view>
								<view class="p2">{{userInfo.username}}</view>
							</view>
						</view>
						<view @tap="login" class="right" v-else>
							<view>
								<view class="p1">暂未登录</view>
								<view class="p2">点击登录 享受更多服务</view>
							</view>
							<uni-icons color="#fff" type="forward" size="30"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view v-if="logined">
				<view class="wrap-item">
					<view class="wrap-title clearfix">积分中心</view>
					<view class="wrap-cont">
						<view class="flexbox">
							<view class="num">{{signCount}}</view>
							<view class="text">已连续签到</view>
						</view>
						<view class="flexbox">
							<view class="num">{{userInfo.integral || 0}}</view>
							<view class="text">可用积分</view>
						</view>
						<view class="flexbox">
							<view class="num">{{userInfo.usedIntegral || 0}}</view>
							<view class="text">已用积分</view>
						</view>
					</view>
					<view class="sign-box">
						<view class="sign-text" v-if="signed">今日已签到</view>
						<view class="sign-btn" v-else>
							<button class="btn-mid" @tap="sign">签到</button>
						</view>
					</view>
				</view>
				<view hover-class="none" @tap="gotoVip" class="about">
					<view>会员中心</view>
					<image src="@/static/arrow.png" mode="aspectFit"></image>
				</view>
				<view hover-class="none" @tap="gotoIntegral" class="about">
					<view>积分中心</view>
					<image src="@/static/arrow.png" mode="aspectFit"></image>
				</view>
				<view hover-class="none" @tap="gotoChange" class="about">
					<view>密码修改</view>
					<image src="@/static/arrow.png" mode="aspectFit"></image>
				</view>
				<view class="logout" v-on:click="loginout">退出登录</view>
			</view>
			<view v-else class="login-box">
				<view class="login-text">您还没登录，登录后可体验更多活动和服务</view>
				<view class="login-btn">
					<button class="btn-mid" @tap="login">立即登录</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		access
	} from '@/api/request.js'
	import {
		domain
	} from '@/api/domain.js'
	export default {
		data() {
			return {
				avatarUrl: '/static/avatar.png',
				userInfo: {},
				signCount: 0,
				signed: false
			}
		},
		onShow() {
			try {
				const value = uni.getStorageSync('userInfo');
				if (value) {
					this.logined = true
					this.getUserInfo(value.id)
					this.getSign(value.id)
				} else {
					this.logined = false
					this.userInfo = {}
				}
			} catch (e) {
				
			}
		},
		methods: {
			login() {
				uni.navigateTo({
					url: '/pages/Login/Login'
				})
			},
			loginout() {
				uni.showModal({
					content: '确定要退出登录吗？',
					confirmText: "退出",
					confirmColor: "#FF4B26",
					success: function(res) {
						uni.setStorageSync('userInfo', '')
						uni.reLaunch({
							url: '/pages/Login/Login'
						});
					}
				});
			},
			gotoVip() {
				
			},
			gotoChange() {
				uni.navigateTo({
					url: '/pages/Login/Reset'
				})
			},
			gotoIntegral() {
				
			},
			setHead() {
				if (!this.userInfo||!this.userInfo.id) {
					uni.navigateTo({
						url: '/pages/Login/Login'
					})
					return
				}
				uni.showActionSheet({
					itemList: ['拍照', '从手机相册选择'],
					success: (res) => {
						switch (res.tapIndex + 1) {
							case 1:
								uni.chooseImage({
									count: 1, //默认9
									crop: {
										width: 80,
										height: 80
									},
									sourceType: ['camera'], //从相册选择
									success: (res) => {
										const tempFilePaths = res.tempFilePaths
										uni.uploadFile({
											url: domain() + '/api/admin/avatar',
											filePath: tempFilePaths[0],
											name: 'file',
											formData: {
												userId: this.userInfo.id
											},
											success: uploadFileRes => {
												
											}
										})
									}
								});
								break;
							case 2:
								console.log("选择相册")
								uni.chooseImage({
									count: 1, //默认9
									crop: {
										width: 80,
										height: 80
									},
									sourceType: ['album'], //从相册选择
									success: (res) => {
										const tempFilePaths = res.tempFilePaths
										uni.uploadFile({
											url: domain() + '/api/admin/avatar',
											filePath: tempFilePaths[0],
											name: 'file',
											formData: {
												userId: this.userInfo.id
											},
											success: uploadFileRes => {
												
											}
										})
									}
								});
								break;
						}
					},
					fail: (res) => {
						console.log(res.errMsg);
					}
				});
			},
			getUserInfo(userId) {
				access({
					url: '/api/admin/user/' + userId,
					method: 'get',
					param: {}
				}, res => {
					if (res.code === 200) {
						const data = res.data;
						if (data.avatarurl) {
							this.avatarUrl = domain() + data.avatarurl
						}
						this.userInfo = data
						this.getVipText()
					} else {
						uni.showToast({
						  icon: 'none',
						  title: res.msg
						});
					}
				}, function() {
				}, true)
			},
			getSign(userId) {
				access({
					url: '/api/admin/sign',
					method: 'get',
					param: {
						userId: userId
					}
				}, res => {
					if (res.code === 200) {
						this.signCount = res.data.continuous
						this.signed = res.data.signed
					} else {
						uni.showToast({
						  icon: 'none',
						  title: res.msg
						});
					}
				}, function() {
				}, true)
			},
			sign() {
				access({
					url: '/api/admin/sign',
					method: 'post',
					param: {
						userId: this.userInfo.id
					}
				}, res => {
					if (res.code === 200) {
						const value = uni.getStorageSync('userInfo');
						this.signCount = res.data.continuous
						this.signed = res.data.signed
						this.getUserInfo(value.id)
						uni.showToast({
						  icon: 'none',
						  title: `恭喜你获得${res.data.integral}个积分`
						});
					} else {
						uni.showToast({
						  icon: 'none',
						  title: res.msg
						});
					}
				}, function() {
				}, true)
			},
			getVipText() {
				if (!this.userInfo.expire) {
					this.vipText = '您当前还不是会员'
					this.vipStatus = '1'
				} else if (Date.now() >= new Date(this.userInfo.expire)) {
					this.vipText = `您的会员已于${this.userInfo.expire}过期`
					this.vipStatus = '2'
				} else {
					this.vipText = `您的会员将于${this.userInfo.expire}过期`
					this.vipStatus = '3'
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100%;
		overflow-y: auto;
		background-color: #F1F8FA;
		padding-top: var(--status-bar-height);
		box-sizing: border-box;
	}
	
	.header {
		position: relative;
		box-sizing: border-box;
		height: 524upx;
		padding-top: var(--status-bar-height);
		background: url(~@/static/bg1.png) top center no-repeat;
		background-size: cover;
		flex-shrink: 0;
		overflow: hidden;
	}
	
	.head {
		padding: 0 30upx;
		position: relative;
		height: 90upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.title-box {
			font-size: 40rpx;
			font-family: HarmonyOS Sans SC;
			font-weight: 400;
			color: #FFFFFF;
			text-align: center;
		}
	}
	
	.per-head {
		box-sizing: border-box;
		width: 100%;
		height: calc(100% - 90upx);
		padding: 0 40upx;
		position: relative;
		transition: all 0.5s;
		
		.p1 {
			line-height: 1;
			font-size: 40rpx;
			font-family: HarmonyOS Sans SC;
			font-weight: 400;
			color: #fff;
			margin-bottom: 16upx;
		}
		
		
		.p2 {
			font-size: 32rpx;
			font-family: HarmonyOS Sans SC;
			font-weight: 400;
			color: #94BDF2;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		
		.pof-box{
			width: 190upx;
			height: 54upx;
			background: linear-gradient(0deg, #E5B76F 0%, #FFDB95 100%);
			border-radius: 27upx 0px 0px 27upx;
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 54upx;
			padding-left: 18upx;
			position: absolute;
			right: 0;
			// top: 114upx;
			top: 38px;
		}
		.cont {
			box-sizing: border-box;
			width: 100%;
			padding: 0 40upx;
			position: absolute;
			bottom: 186upx;
			left: 0;
			
			.fx-box {
				display: flex;
				flex-direction: row;
				align-items: center;
	
				.left {
					width: 146upx;
					height: 146upx;
					//background-color: #0000FF;
					margin-right: 32upx;
					border-radius: 50%;
					overflow: hidden;
					position: relative;
	
					.head-portrait {
						width: 146upx;
						height: 146upx;
						border-radius: 50%;
						z-index: 1;
					}
	
					.compile-head {
						position: absolute;
						bottom: 0;
						width: 100%;
						height: 36upx;
						background: rgba(0, 0, 0, .3);
						text-align: center;
						line-height: 36upx;
						font-size: 24upx;
						color: #F5F5F5;
						z-index: 2;
					}
				}
	
				.right {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: calc(100% - 178upx);
				}
			}
		}
	}
	
	.content {
		padding: 0 40upx;
		margin-top: -140upx;
		position: relative;
		z-index: 10;
		
		.login-box {
			width: 100%;
			background: #FFFFFF;
			border-radius: 32upx;
			padding: 48upx 32upx;
		}
		
		.login-text {
			color: #5C5E66;
			font-size: 28upx;
			text-align: center;
		}
		
		.login-btn {
			display: flex;
			justify-content: center;
			margin-top: 48upx;
		}
		
		.btn-mid {
			width: 320upx;
			height: 84upx;
			border-radius: 42upx;
			font-size: 28upx;
			color: #fff;
			text-align: center;
			background: rgb(0, 198, 87);
		}
		
		.wrap-item {
			position: relative;
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 24upx 0;
			margin-bottom: 30rpx;
			overflow: hidden;
		}
		
		.wrap-title {
			line-height: 1;
			margin-left: 32rpx;
			font-size: 30rpx;
			font-family: HarmonyOS Sans SC;
			font-weight: 400;
			color: #000000;
		}
		
		.wrap-cont {
			margin-top: 54rpx;
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
		
		.flexbox {
			text-align: center;
			
			.num {
				font-size: 36upx;
				color: #333;
				font-weight: bold;
			}
			
			.text {
				margin-top: 24upx;
				font-size: 28upx;
				color: #666;
			}
		}
	}
	
	.sign-box {
		margin-top: 32upx;
		display: flex;
		justify-content: center;
	}
	
	.sign-btn {
		display: flex;
		justify-content: center;
	}
	
	.sign-text {
		width: 320upx;
		height: 84upx;
		line-height: 84upx;
		border-radius: 42upx;
		font-size: 28upx;
		color: #fff;
		text-align: center;
		background: #67C23A;
	}
	
	.logout {
		width: 100%;
		height: 110rpx;
		line-height: 110upx;
		margin-top: 50rpx;
		text-align: center;
		font-size: 32rpx;
		font-family: HarmonyOS Sans SC;
		font-weight: 400;
		color: #02459C;
		background: #fff;
		border-radius: 20rpx;
	}
	
	.about {
		position: relative;
		padding: 0 40upx;
		height: 118upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 32rpx;
		font-family: HarmonyOS Sans SC;
		font-weight: 400;
		color: #000000;
		background: #FFFFFF;
		box-sizing: border-box;
		
		&:after {
			position: absolute;
			right: 0;
			width: calc(100% - 102rpx);
			bottom: 0;
			content: '';
			background: #D9D9D9;
			height: 1rpx;
		}
		
		&:last-child {
			&:after {
				display: none;
			}
		}
		
		&.none {
			&:after {
				display: none;
			}
		}
	}
	
	.about image {
		width: 44upx;
		height: 44upx;
	}
</style>