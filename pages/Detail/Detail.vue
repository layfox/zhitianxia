<template>
	<view class="container">
		<!-- <chunlei-video class="video" :poster="posterPath" :src="videoPath"  :height="height" :width="width"
			:play="true" :gDuration="duration"
			@pause="pauseVideo"
			@playEnd="playEnd" :danmuList="danmuList"
		>
		</chunlei-video> -->
		<!-- <video id="myVideo" src="../../../static/01.mp4"
		 @error="videoErrorCallback" controls poster="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b1476d40-4e5f-11eb-b997-9918a5dda011.png"></video> -->
		<video @fullscreenchange="fullscreenchange" controls v-if="posterPath" :poster="posterPath" style="width: 100%;"  :src="videoPath"></video>
		<view class="info-container">
			
		</view>
	</view>
</template>

<script>
	import {
		access
	} from '@/api/request.js'
	import {
		domain
	} from '@/api/domain'
	export default {
		data() {
			return {
				dda: '',
				id: '',
				posterPath: '',
				autoplay:false,
				playbtn:true,
				videoPath: '',
				width: '',
				height: '200px',
				danmuList: [],
				duration: ''
			}
		},
		onLoad(options) {
			this.dda=uni.createVideoContext('myVideo')
			this.id = options.id
			this.getVideo()
		},
		methods: {
			fullscreenchange(event) {
				var detail = event.detail
				// #ifdef APP-PLUS
				if (detail.fullScreen) {
					console.log(11112222)
					plus.screen.lockOrientation('landscape-primary');
				} else {
					plus.screen.unlockOrientation();
				}
				// #endif
			},
			videoErrorCallback() {
				
			},
			seek(event) {
				console.log(event)
			},
			timeupdate(event){
				let _this=this;
				let currentTime = event.detail.currentTime 
				// if(currentTime>this.info.mrseek && this.info.isplay==0){
				// 	 //dda.exitFullScreen()
				// 	 this.dda.seek(this.info.mrseek)
				// 	 this.dda.pause()
				// 	 this.dda.stop()
				// 	 uni.showModal({
				// 		title: '温馨提示',
				// 		content: '没权限观看当前视频',
				// 		showCancel: false,
				// 		confirmText: "确定",
				// 		success: function (res) {
				// 			if (res.confirm) {
								
				// 			} else if (res.cancel) {
								
				// 			}
				// 		}
				// 	 });
				// }
			},
			getVideo() {
				access({
					url: '/api/video/detail',
					method: 'get',
					param: {
						id: this.id
					}
				}, res => {
					console.log(res)
					if (res.code === 200) {
						const data = res.data
						this.posterPath = domain() + data.posterPath
						this.videoPath = domain() + data.videoPath
						this.duration = data.duration * 60
					}
				}, () => {
					
				}, true)
			},
			pauseVideo(event) {
				console.log(event)
			},
			playEnd(event) {
				console.log(event)
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100%;
		padding-top: var(--status-bar-height);
		box-sizing: border-box;
	}
	
</style>