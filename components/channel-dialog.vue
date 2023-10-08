<template>
	<view class="channel-dialog">
		<view class="channel-dialog-close" @tap="close"></view>
		<view class="channel-dialog-content">
			<view class="item">
				<view class="item-header">
					<view class="item-header-text">
						<view class="item-header-title">我的频道</view>
						<view class="item-header-info">拖动排列顺序</view>
					</view>
					<view class="item-header-btn" @tap="onFinish" v-if="isEditing">完成</view>
					<view class="item-header-btn" @tap="onEdit" v-else>编辑</view>
				</view>
				<view class="drag-container">
					<dragSort @deleteItem="deleteItem" ref="dragSort" :list.sync="channelList" label="name" :columnNum="4" :columnSpace="16" :rowHeight="80" :rowSpace="24"></dragSort>
				</view>
				<!-- <view class="info-container">
					<view class="info-text">以下频道需要通过搜索<text class="text-blue">「关键词」</text>检索</view>
					<view class="info-text">频道内相关数据：</view>
					<view class="info-list">
						<view class="info-item">全部</view>
						<view class="info-item">数据</view>
						<view class="info-item">通讯录</view>
					</view>
				</view> -->
			</view>
			<view class="item" style="margin-top:72rpx;">
				<view class="item-header">
					<view class="item-header-text">
						<view class="item-header-title">全部频道</view>
					</view>
					<view class="item-header-btn" @tap="onAddAll" v-if="isEditing">一键添加全部</view>
				</view>
				<view class="channel-list">
					<view class="channel-item" @tap="onAdd(item, index)" v-for="(item, index) in chooseList" :key="index">
						<view class="channel-text">{{item.name}}</view>
						<view class="channel-btn" v-if="isEditing"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dragSort from '@/components/dragSort.vue'
	export default {
		props: {
			selectedList: {
				type: Array,
				default() {
					return [];
				}
			},
			list: {
				type: Array,
				default() {
					return [];
				}
			}
		},
		components: {
			dragSort
		},
		data() {
			return {
				channelList: [],
				chooseList: [],
				isEditing: false
			}
		},
		created() {
			this.channelList = JSON.parse(JSON.stringify(this.selectedList)).map(item => {
				return item;
			});
			this.chooseList = JSON.parse(JSON.stringify(this.list)).filter(item => {
				return !this.channelList.find(channel => item.id === channel.id)
			})
		},
		methods: {
			close() {
				this.$emit('close');
			},
			deleteItem(item) {
				this.chooseList.push(item)
			},
			onEdit() {
				this.isEditing = true;
				this.$refs.dragSort.toggleEdit('edit');
			},
			onFinish() {
				this.isEditing = false;
				this.$refs.dragSort.toggleEdit('finish');
				this.$nextTick(() => {
					const sortedList = this.$refs.dragSort.getSortedIdArr();
					this.$emit('finish', sortedList);
				})
			},
			// 添加频道，无参数表示全部
			onAdd(item, index) {
				if (!item || !this.isEditing) {
					return 
				}
				// 判断当前频道是否在我的频道中
				this.channelList.push(item)
				this.chooseList.splice(index, 1)
			},
			onAddAll() {
				this.channelList = this.channelList.concat(this.channelList);
				this.chooseList = [];
			},
		}
	}
</script>

<style lang="scss" scoped>
	.channel-dialog {
		position: fixed;
		left: 0;
		top: 45rpx;
		width: 100%;
		padding: 30rpx;
		height: calc(100% - 45rpx);
		background: #fff;
		z-index: 10000;
		border-radius: 20rpx 20rpx 0 0;
		box-sizing: border-box;
		overflow-y: auto;
		
		&-close {
			width: 44rpx;
			height: 44rpx;
			background: url('@/static/close.png') no-repeat;
			background-size: 44rpx 44rpx;
		}
		
		&-content {
			margin-top: 36rpx;
		}
		
		.item {
			&-header {
				display: flex;
				line-height: 1;
				align-items: center;
				justify-content: space-between;
				font-family: HarmonyOS Sans SC;
				
				&-text {
					display: inline-flex;
					align-items: flex-end;
				}
				
				&-title {
					font-size: 32rpx;
					color: #000000;
				}
				
				&-info {
					margin-left: 32rpx;
					font-size: 20rpx;
					color: #999999;
				}
				
				&-btn {
					font-size: 28rpx;
					color: #00489D;
				}
			}
		}
		
		.drag-container {
			margin-top: 36rpx;
		}
		
		.info {
			&-container {
				margin-top: 48rpx;
			}
			
			&-text {
				font-size: 28rpx;
				font-family: HarmonyOS Sans SC;
				font-weight: 400;
				color: #999999;
				line-height: 50rpx;
				
				.text-blue {
					color: #02459C;
				}
			}
			
			&-list {
				display: flex;
				flex-wrap: wrap;
				font-size: 0;
			}
			
			&-item {
				width: calc(25% - 13rpx);
				margin-left: 16rpx;
				height: 80rpx;
				line-height: 80rpx;
				margin-top: 32rpx;
				background: #F2F2F2;
				border-radius: 8rpx;
				text-align: center;
				font-size: 28rpx;
				font-family: HarmonyOS Sans SC;
				font-weight: 400;
				color: #000000;
				
				&:nth-child(4n + 1) {
					margin-left: 0;
				}
				
				&:nth-child(n + 5) {
					margin-top: 16rpx;
				}
			}
		}
		
		.channel {
			&-list {
				display: flex;
				margin-top: 40rpx;
				flex-wrap: wrap;
			}
			
			&-item {
				position: relative;
				width: calc(25% - 13rpx);
				margin-left: 16rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #F2F2F2;
				border-radius: 8rpx;
				text-align: center;
				font-size: 28rpx;
				font-family: HarmonyOS Sans SC;
				font-weight: 400;
				color: #000000;
				
				&:nth-child(4n + 1) {
					margin-left: 0;
				}
				
				&:nth-child(n + 5) {
					margin-top: 24rpx;
				}
			}
			
			&-text {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			
			&-btn {
				position: absolute;
				width: 20rpx;
				height: 20rpx;
				right: 10rpx;
				top: 10rpx;
				background: url('~@/static/channel-add.png') no-repeat;
				background-size: 20rpx 20rpx;
			}
		}
	}
</style>
