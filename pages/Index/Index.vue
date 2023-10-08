<template>
	<!-- <view class="container">
		<view class="tab" id="wuc-tab">
			<wuc-tab v-if="loaded" @change="tab" :tab-list="tabs"
				:tabCur.sync="activeTab" ref="wucTab">
			</wuc-tab>
			<view class="tab-edit-container">
				<image src="@/static/tab-edit-btn.png" class="tab-edit-btn" @tap="showChannelDialog"></image>
			</view>
		</view>
		<view class="tabs-content" @touchstart="onTouchStart" @touchend="onTouchEnd">
		
		</view>
		<channel-dialog @finish="updateUserChannel" :selectedList="tabs" :list="allChannelList" v-if="channelDialogVisible" @close="onCloseHandler"></channel-dialog>
	</view> -->
	<view class="container">
		<z-paging-swiper>
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
			<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
			<template #top>
				<view class="tab" id="wuc-tab">
					<!-- <wuc-tab v-if="loaded" @change="tab" :tab-list="tabs"
						:tabCur.sync="current" ref="wucTab">
					</wuc-tab> -->
					<z-tabs :scrollCount="3" bgColor="#F9F4F0" class="z-tabs" ref="tabs" :list="tabs" :current="current"
						@change="tabsChange" />
					<view class="tab-edit-container">
						<image src="@/static/tab-edit-btn.png" class="tab-edit-btn" @tap="showChannelDialog"></image>
					</view>
				</view>
			</template>
			<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->
			<swiper class="swiper" :current="current" @transition="swiperTransition"
				@animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
					<!-- 这里的swiper-list-item为demo中为演示用定义的组件，列表及分页代码在swiper-list-item组件内 -->
					<!-- 请注意，swiper-list-item非z-paging内置组件，在自己的项目中必须自己创建，若未创建则会报组件不存在的错误 -->
					<swiper-list-item :ref="'tab-'+index" :tab="item" :tabIndex="index" :currentIndex="current"></swiper-list-item>
				</swiper-item>
			</swiper>
		</z-paging-swiper>
		<channel-dialog @finish="updateUserChannel" :selectedList="tabs" :list="allChannelList" v-if="channelDialogVisible" @close="onCloseHandler"></channel-dialog>
	</view>
</template>

<script>
	import {
		access
	} from '@/api/request.js'
	import WucTab from '@/components/wuc-tab.vue'
	import channelDialog from '@/components/channel-dialog.vue'
	import swiperListItem from '@/components/swiper-list-item.vue'
	export default {
		onLoad() {
			// this.getData()
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo && userInfo.id) {
				this.userId = userInfo.id;
			}
			this.getChannel();
			this.getUserChannel();
		},
		onShow() {
			uni.getSystemInfo({
				success: res => {
					this.windowWidth = res.windowWidth
				}
			})
			this.$nextTick(() => {
				const info = uni.createSelectorQuery().select(".z-tabs");
				info.boundingClientRect(data => {
					this.barWidth = data.width
				}).exec()
			})
		},
		components: {
			WucTab,
			channelDialog,
			swiperListItem
		},
		data() {
			return {
				channelDialogVisible: false,
				tabs: [],
				allChannelList: [],
				current: 0,
				loaded: false,
				userId: '',
			}
		},
		methods: {
			//tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx * this.barWidth / this.windowWidth);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.current = e.detail.current;
				this.$refs.tabs.unlockDx();
			},
			getChannel() {
				access({
					url: '/api/channel',
					method: 'get',
					param: {}
				}, res => {
					if (res.code === 200) {
						this.allChannelList = res.data;
					}
				}, function() {}, true)
			},
			getUserChannel() {
				access({
					url: '/api/userChannel',
					method: 'get',
					param: {
						userId: this.userId
					}
				}, res => {
					if (res.code === 200) {
						this.activeTab = 0;
						this.tabs = res.data;
						this.$nextTick(() => {
							this.tabs.forEach((item, index) => {
								this.$refs['tab-' + index][0].refresh()
							})
						})
						this.loaded = true;
					}
				}, function() {}, true)
			},
			updateUserChannel(data) {
				access({
					url: '/api/userChannel',
					method: 'post',
					param: {
						userId: this.userId,
						channel: JSON.stringify(data)
					}
				}, res => {
					if (res.code === 200) {
						this.getUserChannel()
						this.$nextTick(() => {
							this.channelDialogVisible = false;
						})
					}
				}, function() {}, true)
			},
			onCloseHandler() {
				this.channelDialogVisible = false;
			},
			showChannelDialog() {
				this.channelDialogVisible = true;
			},
			getData() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100%;
		box-sizing: border-box;
		
		/deep/ .zp-swiper-container-fixed {
			top: var(--status-bar-height);
		}
	}

	#wuc-tab {
		height: 86rpx;
		overflow: hidden;
		border: none;
		background: #F9F4F0;
	}

	#wuc-tab .z-tabs {
		display: inline-flex;
		width: calc(100% - 95upx);
		vertical-align: middle;
	}

	.tab-edit-container {
		display: inline-block;
		width: 95rpx;
		height: 86rpx;
		background: url('~@/static/tab-edit-bg.png') no-repeat;
		background-size: 100% 100%;
		vertical-align: middle;
		overflow: hidden;
	}

	.tab-edit-btn {
		margin-left: 34rpx;
		margin-top: 19rpx;
		width: 44rpx;
		height: 44rpx;
	}

	.tabs-content {
		position: relative;
	}

	/deep/.uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none
	}

	.tabs-content {
		height: calc(100% - 86rpx);
	}

	.swiper {
		height: 100%;
	}
</style>
