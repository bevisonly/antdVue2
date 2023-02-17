<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <div class="menu-box">
      <!-- <div
        class="menu"
        v-for="(item, index) in menuList"
        :key="index"
        style="margin-top: 20px"
      >
        <h2 class="first-menu" @click="$router.push(`/${item.router}`)">
          {{ item.name }}
        </h2>
        <div class="menu-card">
          <a-card
            class="card-item"
            :title="v.name"
            v-for="(v, i) in menuList[index].children"
            :key="i"
            style="
              width: 300px;
              margin-left: 10px;
              margin-top: 20px;
              display: inline-block;
            "
            @click="toRouter(item.router, v)"
          >
            <p
              class="sub-menu"
              v-for="(s, j) in menuList[index].children[i].children"
              :key="j"
              @click="$router.push(`/${item.router}/${v.router}/${s.router}`)"
            >
              {{ s.name }}
            </p>
          </a-card>
        </div>
      </div> -->
      <div class="menu-item">
        <a-card
          class="card-item"
          v-for="(item, index) in menuList"
          :key="index"
          :title="item.name"
          style="
            width: 300px;
            display: inline-block;
            margin-left: 10px;
            margin-top: 20px;
          "
        >
          <!-- @click="$router.push(`/${item.router}`)" -->
          <a-card
            class="sub-card"
            :title="v.name"
            v-for="(v, i) in menuList[index].children"
            :key="i"
            style="margin-top: 10px"
          >
            <!-- @click="toRouter(item.router, v)" -->
            <p
              class="sub-menu"
              v-for="(s, j) in menuList[index].children[i].children"
              :key="j"
              @click="toPage(item.router,v.router,s.router)"
            >
              {{ s.name }}
            </p>
          </a-card>
        </a-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "NewPage",
  data() {
    return {
      menuList: [],
    };
  },
  created() {
    let data = JSON.parse(localStorage.getItem("admin.routes"));
    this.menuList = data[0].children;
    this.menuList.shift();
  },
  methods: {
    toPage(one,two,three){
      console.log(`/${one}/${two}/${three}`);
      this.$router.push(`/${one}/${two}/${three}`)
    },
    toRouter(first, second) {
      console.log(`${first}+${second}`);
      if (second.children.length > 0) {
        this.$router.push(
          `/${first}/${second.router}/${second.children[0].router}`
        );
        return;
      } else {
        this.$router.push(`/${first}/${second.router}`);
      }
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>
<style scoped lang="less">
@import "index.less";
// .menu {
//   cursor: pointer;
// }
// .menu-card {
//   display: flex;
//   justify-content: space-around;
//   .card-item:hover {
//     // box-shadow: 1px 1px 2px 2px #409eff;
//     transform: scale(1.01, 1.01);
//     border: 1px solid #409eff;
//   }
//   .sub-menu:hover {
//     color: #409eff;
//   }
// }
//-------------------------------------
.menu-item {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  cursor: pointer;
  .card-item {
    // box-shadow: 0 2px 6px rgb(0 0 0 / 11%);
    // -webkit-box-shadow: 0 2px 6px rgb(0 0 0 / 11%);
  }

  .card-item:hover {
    // transform: scale(1.01, 1.01);
    border: 1px solid @primary-color;
  }
  .sub-card:hover {
    // transform: scale(1.005, 1.005);
    border: 1px solid @primary-color;
  }
  .sub-menu:hover {
    color: @primary-color;
  }
}
</style>