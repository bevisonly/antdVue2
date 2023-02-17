<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" src="" />
      <span class="name">{{realName}}</span>
      <a-modal :width='800' :dialogStyle="{'top': '60px'}" v-model="visiablePassword" title="修改密码" :maskClosable='false' :closable="false" :footer="null">
        <div class="modalPasswordPW">
          <div>
            <span class="fontWeightPW aRequired">当前密码：</span>
            <a-input
              v-model="password.oldPassword"
              class="inputWidthPW"
              type="password"
              placeholder="请输入当前密码"
              oncut="return false"
              onpaste="return false"
              oncopy="return false"
            />
          </div>
          <div class="divMarginPW aRequired">
            <span class="fontWeightPW">新密码：</span>
            <a-input
              v-model.trim="password.newPassword"
              class="inputWidthPW"
              type="password"
              placeholder="长度为6-20位"
              :maxLength="20"
              oncut="return false"
              onpaste="return false"
              oncopy="return false"
            />
          </div>
          <div>
            <span class="fontWeightPW aRequired">确认密码：</span>
            <a-input
              v-model.trim="password.confirmPassword"
              class="inputWidthPW"
              type="password"
              placeholder="请确认密码"
              :maxLength="20"
              oncut="return false"
              onpaste="return false"
              oncopy="return false"
            />
          </div>
        </div>
        <div class="footerPW">
          <a-space :size="20" class="flex-ed">
            <a-button @click="onCancel">取消</a-button>
            <a-button :loadding="loadding" type="primary" @click="handleOk">确认</a-button>
          </a-space>
        </div>
      </a-modal>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="logout">
        <a-icon class="iconMargin" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
      <a-menu-item @click="openResetPassword">
        <div>
          <a-icon class="iconMargin" type="setting"/>
          <span>修改密码</span>
        </div>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { logout, resetPassword } from "@/services/user";
import { toLogin } from "@/utils/request";
export default {
  name: "HeaderAvatar",
  data() {
    return {
      realName:localStorage.getItem('userName')?localStorage.getItem('userName'):'小明',
      visiablePassword: !1,
      loadding: !1,
      password: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      }
    }
  },
  computed: {
    ...mapGetters("account", ["user"]),
    passwordLen() {
      return this.password.newPassword?.length || undefined
    },
    repasswordLen() {
      return this.password.confirmPassword?.length || undefined
    },
  },
  methods: {
    logout() {
      logout();
      // this.$router.push("/busLogin");
      let path=window.location.protocol + "//" + window.location.host
      localStorage.clear()
      toLogin('/stage',path)
    },
    openResetPassword() {
      this.password.oldPassword = undefined
      this.password.newPassword = undefined
      this.password.confirmPassword = undefined
      this.visiablePassword = !0
    },
    handleOk() {
      if (this.password.oldPassword === undefined) {
        this.$message.error("请填写旧密码", 3)
        return
      }
      if (this.password.newPassword === undefined || this.passwordLen < 6 || this.passwordLen > 20) {
        this.$message.error('确认修改的密码是否符合规则', 3)
        return
      }
      if (this.password.newPassword !== this.password.confirmPassword) {
        this.$message.error('新密码与确认密码不一致', 4)
        return
      }
      if (this.password.newPassword === this.password.oldPassword) {
        this.$message.error('当前密码与新密码不能相同', 3)
        return
      }
      this.loadding = !0
      let fd = new FormData()
      fd.set('oldPassword', this.password.oldPassword)
      fd.set('newPassword', this.password.newPassword)
      fd.set('confirmPassword', this.password.confirmPassword)
      resetPassword(fd).then(res => {
        this.visiablePassword = !1
        this.loadding = !1
        if (res.data.code == 200) {
          this.$message.success(res.data.message+'，请重新登录', 3)
          setTimeout(() => { this.logout() }, 3100);
          return
        }
        this.$message.error(res.data.message, 3)
      }).catch(e => this.$message.error('设置失败'+e, 5))
    },
    onCancel() {
      this.visiablePassword = !1;
    },
  },
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
  }
  .name {
    font-weight: 500;
  }
}
.avatar-menu {
  width: 150px;
}
.iconMargin {
  margin-right: 8px;
  font-size: 13px;
}
.ant-dropdown-menu-item {
  text-align: center;
}
.modalPasswordPW {
  width: 460px;
  margin: 0 auto;
  .divMarginPW {
    margin: 20px 0;
  }
  .fontWeightPW {
    color: black;
    font-size: 18px;
  }
  .inputWidthPW {
    width: 93.6%;
    margin-right: 4px;
  }
}
.footerPW {
  border-top: 1px solid #f0f0f0;
  margin-top: 20px;
  padding-top: 24px;
}
</style>
