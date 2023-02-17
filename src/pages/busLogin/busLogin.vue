<template>
  <div class="buslogin"></div>
</template>

<script>
import { login } from "@/services/user";
import { setAuthorization } from "@/utils/request";
// import { mapMutations } from "vuex";
import { filterRouter, transRouter, formatCode } from "../../utils/treeData";
import { loadRoutes, addChildRoutes } from "@/utils/routerUtil";
import Cookie from "js-cookie";
// import format from "date-fns/format";
import { localRouterData } from "./localRouter";
export default {
  data() {
    return {
      redirectUri: "",
      code: "",
      state: "",
      path: window.location.protocol + "//" + window.location.host,
      asyncRoutesList: [
        {
          router: "root",
          children: [],
        },
      ],
      testList: {
        router: "dashboard",
        children: ["quick"],
        // name: "首页",
        // children: [
        //   {
        //     router: "demo",
        //     name: "待开发",
        //     // children: ["userManagement", "roleManagement", "funAuthManagement"],
        //   },
        // ],
      },
    };
  },
  mounted() {
    this.code = this.getQueryString("code");
    this.state = this.getQueryString("state");
    this.redirectUri = window.btoa(this.path + "/scm/busLogin");
    let path = this.path;
    if (!this.code) {
      if (!localStorage.getItem("userInfo")) {
        //如果地址栏没有参数，并且缓存里没有token。说明是第一次进入系统
        this.toLogin("/stage", path);
      } else if (localStorage.getItem("userInfo")) {
        //如果地址栏没有参数，并且缓存里有token。说明不是第一次进入系统
        this.$router.push({
          path:"/dashboard",
        });
      }
    } else {
      this.getToken();
    }
  },
  methods: {
    // ...mapMutations("account", ["setPermissions"]),
    // ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),

    //获取地址栏上的请求体参数
    getQueryString(name) {
      const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      const l = decodeURI(window.location.search);
      const r = l.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    //------------------
    // 登录跳转as
    // toLogin(lastRoute, currentUrl) {
    //   window.location.href = `http://as.diligrp.com:8396/api/oauth-server/authorize?client_id=gyl&state=${window.btoa(
    //     lastRoute
    //   )}&redirect_uri=${currentUrl}/scm/busLogin&response_type=code`;
    // },
    toLogin(lastRoute, currentUrl) {
      if (
        process.env.NODE_ENV == "development" ||
        process.env.VUE_APP_TITLE == "test"
      ) {
        window.location.href = `http://as.diligrp.com:8396/api/oauth-server/authorize?client_id=gyl&state=${window.btoa(
          lastRoute
        )}&redirect_uri=${currentUrl}/scm/busLogin&response_type=code`;
      } else {
        window.location.href = `https://as.diligrp.com/api/oauth-server/authorize?client_id=gyl&state=${window.btoa(
          lastRoute
        )}&redirect_uri=${currentUrl}/scm/busLogin&response_type=code`;
      }
    },
    // ------------

    //-------正式的登录接口获取token
   async getToken() {
      let res=await login(this.redirectUri, this.code, this.state)
        if (res.data.code == 200) {
          let tree = JSON.parse(JSON.stringify(res.data.data.resourceList));
          let treeCode = JSON.parse(JSON.stringify(res.data.data.resourceList));
          let time = res.data.data.accessTokenTimeout * 1000;
          setAuthorization({
            SCM_accessToken: res.data.data.accessToken,
            // token: res.data.data.accessToken,
            expireAt: new Date(new Date().getTime() + time),
          });
          Cookie.set("refreshToken", res.data.data.refreshToken);
          let routerChild = [];
          this.asyncRoutesList[0].children = filterRouter(
            transRouter(tree, routerChild)
          );
          let codeArr = [];
          formatCode(treeCode, codeArr);
          localStorage.setItem("codeList", codeArr);
          // this.$store.commit("SET_AUTH_CODE", codeArr);
          this.asyncRoutesList[0].children.unshift(this.testList);
          let routesConfig = this.asyncRoutesList;
          routesConfig.forEach((item) => {
            //这里暂时这样写。以后前端控制的页面多了再优化
            item.children = addChildRoutes(item.children, [
              {
                parentCode: "rate",
                routeChildrens: [
                  {
                    children: [],
                    code: "add_output_rate",
                    description: "uap菜单",
                    id: "",
                    meta: { href: "" },
                    metadata: {},
                    name: "新增销项税率",
                    parentId: "",
                    router: "addOutputRate",
                    type: 2,
                    url: "",
                  },
                  {
                    children: [],
                    code: "choose_rate",
                    description: "uap菜单",
                    id: "",
                    meta: { href: "" },
                    metadata: {},
                    name: "配置规则",
                    parentId: "",
                    router: "chooseRate",
                    type: 2,
                    url: "",
                  },
                ],
              },
              ...localRouterData,
            ]);
          });
          loadRoutes(routesConfig);
          localStorage.setItem("userName", res.data.data.userInfo.userName);
          sessionStorage.setItem('globalName',res.data.data.userInfo.userName)
          localStorage.setItem("isAdmin", res.data.data.isAdmin); //是否是超级管理员
          localStorage.setItem("orgId", res.data.data.orgId); //当前运营主体id
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              orgId: res.data.data.orgId,
              isAdmin: res.data.data.isAdmin,
              deptId: res.data.data.deptId,
              deptName: res.data.data.deptName,
            })
          ); //当前运营主体id
          this.$router.push("/dashboard");
        } else {
          this.$message.error(res.data.message||'未知错误',1.5).then(()=>{
            this.toLogin("/stage", this.path);
          })
        } 
    },
    //-------
  },
};
</script>

<style>
</style>