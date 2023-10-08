<template>
  <scroll-view class="wuc-tab" :class="tabClass" :style="tabStyle" scroll-with-animation scroll-x :scroll-left="scrollLeft">
    <div v-if="!textFlex" class="wuc-Box">
      <div class="wuc-tab-item" :style="index === tabCur?selectStyle:''" :class="[index === tabCur ? selectClass + '':'']" v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
        <text :class="item.icon"></text>
        <view style="padding: 24upx 0;" :style="index === tabCur?selectStyle:''" :class="[index === tabCur ? selectClass + ' cur':'']">{{item.name}}</view>
		<view v-if="item.isNew" class="newtag">new</view>
      </div>
	  <view v-if="currentLeft" :class="isAnimated&&currentLeft?'animation':''" :style="{left: currentLeft, backgroundColor: color}" class="wuc-current"></view>
    </div>

    <!-- <div class="flex text-center" v-if="textFlex">
      <div class="wuc-tab-item flex-sub" :class="index === tabCur ? selectClass + ' cur':''" v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
        <text :class="item.icon"></text>
        <span>{{item.name}}</span>
      </div>
    </div> -->
  </scroll-view>
</template>
<script>
export default {
    name: 'wuc-tab',
    data() {
        return {
			scrollLeft: 0,
			currentLeft: 0,
			isAnimated: false
		};
    },
    props: {
        tabList: {
            type: Array,
            default() {
                return [];
            }
        },
        tabCur: {
            type: Number,
            default() {
                return 0;
            }
        },
        tabClass: {
            type: String,
            default() {
                return '';
            }
        },
        tabStyle: {
            type: String,
            default() {
                return '';
            }
        },
        textFlex: {
            type: Boolean,
            default() {
                return false;
            }
        },
        selectClass: {
            type: String,
            default() {
                return 'text-blue';
            }
        },
		selectStyle: {
            type: String,
            default() {
                return '';
            }
        },
		color: {
			type: String,
			default() {
				return '';
			}
		}
    },
	mounted() {
		this.calcScrollLeft();
	},
	watch:{
		tabList(newVal){
			if(newVal){
				this.calcScrollLeft()
			}
		}
	},
    methods: {
        tabSelect(index, e, forceUpdate, isAnimation) {
            if (this.tabCur === index && !forceUpdate) return false;
			//this.tabCur = index;
            this.$emit('update:tabCur', index);
            this.$emit('change', index);
			this.$nextTick(() => {
				this.calcScrollLeft(isAnimation);
			})
			
        },
		calcScrollLeft(isAnimation) {
			const query = uni.createSelectorQuery().in(this);
			const windowWidth = uni.getSystemInfoSync().windowWidth;
			let wucTabWidth = 0;
			query.select('.wuc-tab').boundingClientRect(data => {
				wucTabWidth = data.width;
			});
			query.selectAll('.wuc-tab-item').boundingClientRect(rects => {
				let left = 0;
				let index = 0;
				while (index < this.tabCur)	{
					left += rects[index].width;
					index++;
				}
				let width = rects && rects[this.tabCur] && rects[this.tabCur].width || 0;
				if (isAnimation) {
					this.isAnimated = true;
				} else {
					this.isAnimated = false;
				}
				setTimeout(() => {
					this.isAnimated = false;
				}, 600)
				this.currentLeft = (left + width / 2) + 'px';
				left = left < wucTabWidth / 2 ? 0 : left + width / 2 - wucTabWidth / 2;
				console.log(this.currentLeft, left)
				this.scrollLeft = left;
			}).exec();
			this.$forceUpdate();
		}
    }
};
</script>
<style scoped lang="scss">
div,
scroll-view,
swiper {
	box-sizing: border-box;
}
.wuc-tab {
    white-space: nowrap;
	 margin: 0 40upx 0 20upx;
	 width: calc(100% - 60upx);
}

.wuc-Box {
	position: relative;
	height: 100%;
	font-size: 0;
}

.wuc-current {
	position: absolute;
	width: 34rpx;
	height: 6rpx;
	background: #0081ff;
	border-radius: 3rpx;
	bottom: 6rpx;
	margin-left: -17rpx;
	
	&.animation {
		transition: all 0.5s;
		animation: slide 0.5s;
	}
}
@keyframes slide {
	0% {
		width: 34rpx;
		margin-left: -17rpx;
	}
	
	50% {
		width: 50rpx;
		margin-left: -25rpx;
	}
	
	100% {
		width: 34rpx;
		margin-left: -17rpx;
	}
}
.wuc-Box .wuc-tab-item:first-child{
	 padding: 0upx 20upx 0 20upx;
}

.wuc-tab-item .newtag {
		text-align: center;
		min-width: 22upx;
		position: absolute;
		right: -32upx;
		top: 6upx;
		border: 1px solid rgba(255, 255, 255, 1);
		border-radius: 25px 25px 25px 0;
		font-size: 20upx;
		padding: 0 10upx;
		color: #fff;
		background: #FA4B5C;
		line-height: 36upx;
		font-weight: normal !important;
		transform: scale(0.7);
	}


.wuc-tab-item {
	/*    height: 90upx; */ 
    display: inline-block;
   /* line-height: 90upx; */
   /* margin: 0 10upx; */
    padding: 0upx 20upx;
	font-size: 30upx;
	position: relative;
	color: #000;
}

.cur {
    // border-bottom: 6upx solid;
}

.wuc-tab.fixed {
	position: fixed;
	width: 100%;
	top: 0;
	z-index: 1024;
	box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
}

.flex {
    display: flex;
}
.text-center {
    text-align: center;
}
.flex-sub {
    flex: 1;
}
.text-blue{
	color:#0081ff;
}
.text-white{
  color:#ffffff;
}
.bg-white{
    background-color: #ffffff;
}
.bg-blue{
    background-color: #0081ff;
}
.text-orange{
  color: #f37b1d;
}

.text-xl {
	font-size: 36upx;
}
</style>
