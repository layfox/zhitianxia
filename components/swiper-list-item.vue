<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :auto="false">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index" @tap="itemClick(item)">
				<image :src="item.posterPath" class="item-image"></image>
				<image src="../static/playbtn.png" class="item-playbtn"></image>
				<view class="item-info">
					<view class="item-category">{{item.category}}</view>
					<view class="item-name">{{item.name}}</view>
					<!-- <view class="item-desc">{{item.description}}</view> -->
					<view class="item-time">{{item.updateTime}}</view>
				</view>
			</view>
		</z-paging>
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
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				firstLoaded: false
			}
		},
		props:{
			//当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				type: Number,
				default: function(){
					return 0
				}
			},
			//当前swiper切换到第几个index
			currentIndex: {
				type: Number,
				default: function(){
					return 0
				}
			},
			tab: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if(newVal === this.tabIndex){
						//懒加载，当滑动到当前的item时，才去加载
						if(!this.firstLoaded){
							setTimeout(() => {
								this.$refs.paging.reload();
							}, 100);
						}
					}
				},
				immediate: true
			},
		},
		methods: {
			refresh() {
				this.firstLoaded && this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				//组件加载时会 && 自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: +pageNo,
					pageSize: +pageSize,
					category: this.tab.name
				}
				// const data = []
				// for (let i = 0; i < pageSize; i++) {
				// 	data.push(this.tab.name + '-' + ((params.pageNo - 1) * pageSize + (i + 1)))
				// }
				// if (this.dataList.length > 50) {
				// 	this.$refs.paging.complete([]);
				// } else {
				// 	this.$refs.paging.complete(data);
				// }
				access({
					url: '/api/video/category',
					method: 'get',
					param: params
				}, res => {
					console.log(res)
					if (res.code === 200) {
						
						this.$refs.paging.complete(res.data.map(item => {
							item.posterPath = domain() + item.posterPath
							item.updateTime = this.formatterTime(item.updatedAt)
							return item
						}));
						this.firstLoaded = true;
					}
				}, () => {
					this.$refs.paging.complete(false);
				}, true)
				// this.$request.queryList(params).then(res => {
				// 	//将请求的结果数组传递给z-paging
				// 	this.$refs.paging.complete(res.data.list);
				// 	this.firstLoaded = true;
				// }).catch(res => {
				// 	//如果请求失败写this.$refs.paging.complete(false);
				// 	//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
				// 	//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
				// 	this.$refs.paging.complete(false);
				// })
			},
			itemClick(item) {
				uni.navigateTo({
					url: '/pages/Detail/Detail?id=' + item.id
				})
			},
			formatterTime(time) {
				if (!time) {
					return ''
				}
				var timestamp = new Date(time).getTime() / 1000
				var dis = new Date().getTime() / 1000 - timestamp
				if (dis < 60) {
					return '刚刚'
				} else if (dis < 3600) {
					return Math.floor(dis / 60) + '分钟前'
				} else if (dis < 24 * 3600) {
					return Math.floor(dis / 3600) + '小时前'
				} else if (dis < 31 * 24 * 3600) {
					return Math.floor(dis / (24 * 3600)) + '天前'
				} else if (dis < 365 * 24 * 3600) {
					return Math.floor(dis / (31 * 24 * 3600)) + '月前'
				} else {
					return '1年前'
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
	.content {
		height: 100%;
		padding-top: 24upx;
		box-sizing: border-box;
	}
	
	.item {
		position: relative;
		margin: 0 30rpx 24upx;
		font-size: 0;
		border-radius: 16upx;
		overflow: hidden;
		
		&-image {
			width: 100%;
			height: 320rpx;
		}
		
		&-playbtn {
			position: absolute;
			left: 50%;
			top: 95upx;
			margin-left: -65upx;
			width: 130upx;
			height: 130upx;
		}
		
		&-info {
			padding: 16upx;
			background: rgba(225, 243, 216, 0.5);
		}
		
		&-name {
			line-height: 1.5;
			color: #333;
			font-size: 32upx;
			overflow: hidden;
			-webkit-line-clamp: 2;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			max-height: 96upx;
		}
		
		&-category {
			line-height: 1.5;
			color: #666;
			font-size: 28upx;
		}
		
		&-desc {
			line-height: 1.5;
			color: #999;
			font-size: 28upx;
			overflow: hidden;
			-webkit-line-clamp: 2;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			max-height: 84upx;
		}
		
		&-time {
			line-height: 1.5;
			color: #999;
			font-size: 28upx;
		}
	}
</style>
