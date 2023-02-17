<template>
  <div ref="wang"></div>
</template>

<script>
import wangEditor from "wangeditor";
import { editorUpload } from "../../services/product/productList";
export default {
  props: {
    // wangEditor 的配置
    // v-model 双向绑定：接受父组件的值
    option: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      type: String,
      default: "",
    },
  },
  watch: {
    // 监听父组件传值，将值赋值给编辑器
    value(n) {
      if (this.editor && n !== this.temp) {
        this.editor.$textElem.html(n);
      }
    },
  },
  data() {
    return {
      temp: "", // 缓存当前的编辑器中的值，用于与父组件传入值进行对比
      editor: null,
    };
  },
  mounted() {
    this.editor = new wangEditor(this.$refs.wang);
    // 配置 server 接口地址
    this.editor.config.uploadImgServer = "/api/uploadFile/doUploads.action";
    this.editor.config.uploadFileName = "file"; // 后端接受上传文件的参数名
    this.editor.config.uploadVideoServer = "/api/uploadFile/doUploads.action";
    // 合并配置项
    Object.assign(this.editor.config, this.option);

    // v-model 双向绑定：把值发送到父组件（不占用用户的 onchange 配置）
    this.editor.txt.eventHooks.changeEvents.push(() => {
      this.temp = this.editor.$textElem.html();
      this.$emit("input", this.temp);
    });

    if (this.value.length) {
      this.editor.txt.html(this.value);
    }
    this.editor.create();
    this.editor.config.customUploadImg = (resultFiles, insertImgFn) => {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      console.log(resultFiles);
      // 上传图片，返回结果，将图片插入到编辑器中
      for (var i = 0; i < resultFiles.length; i++) {
        let formData = new FormData();
        formData.append("file", resultFiles[i]);
        editorUpload(formData).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            console.log(111111);
            console.log(res.data.data[0]);
            insertImgFn(res.data.data[0]);
            // this.fileUrlList.push(res.data.data[0]);
          }
        });
      }
      console.log(resultFiles.length);
    };
    this.editor.config.customUploadVideo = (resultFiles, insertVideoFn) => {
      // resultFiles 是 input 中选中的文件列表
      // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
      console.log(resultFiles);
      // 上传视频，返回结果，将视频插入到编辑器中
      for (var i = 0; i < resultFiles.length; i++) {
        let formData = new FormData();
        formData.append("file", resultFiles[i]);
        editorUpload(formData).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            console.log(111111);
            console.log(res.data.data[0]);
            insertVideoFn(res.data.data[0]);
            // this.fileUrlList.push(res.data.data[0]);
          }
        });
      }
      console.log(resultFiles.length);
    };
    this.editor.config.uploadImgHooks = {
      fail: () => {
        // 插入图片失败回调
        this.$Message.warning("上传失败");
      },
      success: () => {
        // 图片上传成功回调
        this.$Message.success("图片上传成功");
      },
      timeout: () => {
        // 网络超时的回调
        this.$Message.warning("上传超时");
      },
      error: () => {
        // 图片上传错误的回调
        this.$Message.warning("上传失败");
      },
    };
    this.editor.config.uploadVideoHooks = {
      fail: () => {
        // 插入视频失败回调
        this.$Message.warning("上传失败");
      },
      success: () => {
        // 视频上传成功回调
        this.$Message.success("视频上传成功");
      },
      timeout: () => {
        // 网络超时的回调
        this.$Message.warning("上传超时");
      },
      error: () => {
        // 图片上传错误的回调
        this.$Message.warning("上传失败");
      },
    };
  },
  methods: {
    clearContent() {
      if (this.value) {
        this.editor.txt.clear();
      }
    },
    //禁用编辑
    toDisable(){
      console.log(11);
      this.editor.disable()
    },
    //qiyong编辑
    toEnable(){
      this.editor.enable()
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
};
</script>
