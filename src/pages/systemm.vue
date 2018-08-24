<template>
    <div class="left_mainBox">
        <left-nav></left-nav>
        <transition :name="transitionName">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import LeftNav from "./left_nav7"

	export default {
		components:{
            LeftNav,
        },
        data(){
            return {
                transitionName: '',
            }
        },
        watch:{
            $route(to,from){
                this.transitionName = 'slide-left';
            }
        }
	}
</script>

<style scoped>
    .left_mainBox{
        width: 100%;
        height: 100%;
    }

    /*界面切换样式*/
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active{
        will-change: transform;
        transition: all 1000ms ease;
        position: absolute;
    }
    .slide-left-leave-active {
        will-change: transform;
        transition: all 1000ms ease;
        position: absolute;
    }
    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }
    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
    .slide-left-enter {
        opacity: 0;
        /*-webkit-transform: translate3d(100%,0, 0);*/
        transform: translate3d(100%, 0, 0);
    }
    .slide-left-leave-active {
        opacity: 0;
        /*-webkit-transform: translate3d(-100%,0, 0);*/
        transform: translate3d(-100%, 0, 0);
    }
</style>