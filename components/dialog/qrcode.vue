<template>
	<view class="qrocde-modal">
		<view  class="modal-bg" :style="{zIndex:zindex}"></view>
		<view class="modal-box animated fast" :style="{zIndex:zindex+1,background:bg}" :class="show   ? 'slideInUp' : 'slideOutDown'">
			<view class="modal-main">
				<view class="closed">
					<text @click="closed()" class="iconfont  ft20 cl-notice iconbtn_close"></text>
				</view>
				<view class="lh20 ft16 cl-main ftw600 text-center">我的分享二维码</view>
				<view @click="getp()" class="flex center mt40"  style="height: 400rpx;">
					<image :src="qrcodeImg" style="width: 400rpx; height: 400rpx;"></image>
				</view>
				<view class="text-center ft14 cl-info2" style="padding: 10upx 80upx;white-space:normal; word-break:break-all; word-wrap:break-word;">
					<view class="text-center ft14" @click="copys()" style="padding-bottom: 20upx;">扫码上面的二维码【ID：{{uid}}】</view>
					<view class="text-center ft14" @click="copy()">点击复制地址<br>{{qrurl}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import  QR   from '../../static/js/wxqrcode.js';
	
	export  default{
		props:{
			zindex:{
				type:Number,
				default:401,
			},
			bg:{
				type:String,
				default:'#ffffff',
			},
			
		},
		data(){
			return {
				show:false,
				qrcodeImg:'',
				uid:'',
				qrurl:'',
			}
		},
		created(){
			this.show = true;
			this.uid = uni.getStorageSync("userinfo").id;
			this.qrurl=this.configs.webUrl+'/h5/#/pages/login/reg?uid='+this.uid
			let img = QR.createQrCodeImg(this.qrurl, {  
			     size: 300//二维码大小  
			})
			this.qrcodeImg = img;
		},
		methods:{
			copy(){
				var value=this.qrurl
			  //提示模板
			  uni.showModal({
			    content:value,//模板中提示的内容
			    confirmText:'复制内容',
			    success:()=>{//点击复制内容的后调函数
			      //uni.setClipboardData方法就是讲内容复制到粘贴板
			      uni.setClipboardData({
			        data:value,//要被复制的内容
			        success:()=>{//复制成功的回调函数
			          uni.showToast({//提示
			            title:'复制成功'
			          })
			        }
			      });
			    }
			  });
			},
			copys(){
				console.log(1111)
				var value=this.uid
			  //提示模板
			  uni.showModal({
			    content:value,//模板中提示的内容
			    confirmText:'复制内容',
			    success:()=>{//点击复制内容的后调函数
			      //uni.setClipboardData方法就是讲内容复制到粘贴板
			      uni.setClipboardData({
			        data:value,//要被复制的内容
			        success:()=>{//复制成功的回调函数
			          uni.showToast({//提示
			            title:'复制成功'
			          })
			        }
			      });
			    }
			  });
			},
			closed(){
				this.show = false;
				setTimeout(()=>{
					this.$emit('closed');
				},400);
			},
			getp(){
				let thia=this.qrcodeImg
				//#ifdef APP-PLUS  
				uni.saveImageToPhotosAlbum({
				    filePath: thia.qrcodeImg,
				    success: function () {
				        console.log('save success');
				    }
				});
				//#endif
			}
		}
	}
</script>

<style>
	.qrocde-modal{
		position: relative;
		z-index: 400;
	}
	.qrocde-modal .modal-bg{
		position: fixed;
		z-index: 400;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0,0,0,.5);
	}
	.qrocde-modal .modal-box{
		position: fixed;
		z-index: 401;
		background:#FFFFFF;
		left: 0;
		bottom: 0;
		width: 100%;
		padding-bottom:0rpx;
		padding-bottom:constant(safe-area-inset-bottom);
		padding-bottom:env(safe-area-inset-bottom);
		border-radius:32rpx 32rpx 0rpx 0rpx;
	}
	.qrocde-modal .modal-main{
		position: relative;
		height: auto;
		overflow: hidden;
		min-height: 1000rpx;
		padding-top: 64rpx;
		padding-bottom: 40rpx;
	}
	.qrocde-modal .modal-main .closed{
		position: absolute;
		right: 40rpx;
		top: 40rpx;
	}
</style>