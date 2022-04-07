<template>
  <div class="SenMsg">
    <div class="text">
      <el-input
        class="area"
        v-model="textarea"
        :autosize="{ minRows: 3, maxRows: 8 }"
        type="textarea"
        placeholder="分享趣事"
        resize="none"
      />
    </div>
    <div class="imgwall">
      <el-upload
        :multiple="true"
        :style="{ display: isFileShow }"
        ref="file"
        action="#"
        :auto-upload="false"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :file-list="fileList"
      >
        <el-icon ref="icon">
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img style="width: 100%; height: 100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
    <div class="icon">
      <div class="iconfont">
        <i
          class="iconfont icon-biaoqing"
          ref="biaoqing"
          @click="biaoqingClick"
        ></i>
        <emoji
          @hemoji="hemoji"
          :style="{ display: isEmojiShow }"
          ref="emoji"
        ></emoji>
        <i class="iconfont icon-tupian" @click="clickUpload"></i>
      </div>
      <div class="btn">
        <el-button type="success" round @click="uploadFile">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Emoji from "content/Emoji";
import { publishArticle, publishArticleText } from "@/network/ajax";
export default {
  components: {
    Emoji,
  },
  name: "SenMsg",
  data() {
    return {
      loginUser: "",
      textarea: "",
      fileList: [],
      paramsImg: {},
      dialogImageUrl: "",
      dialogVisible: false,
      isFileShow: "none",
      isEmojiShow: "none",
      tagName: ["SPAN", "BUTTON", "IMG"],
    };
  },
  created() {
    this.loginUser = JSON.parse(this.$store.state.user);
    document.addEventListener("click", (e) => {
      if (
        this.$refs.biaoqing != e.target &&
        this.tagName.indexOf(e.target.tagName) == -1
      ) {
        this.isEmojiShow = "none";
      }
    });
  },
  updated() {
    this.loginUser = JSON.parse(this.$store.state.user);
  },
  methods: {
    biaoqingClick() {
      this.isEmojiShow = "block";
    },
    hemoji(emoji) {
      let el = document.querySelector("textarea");
      //获取光标位置并插入
      //插入字符串后将光标移动至插入字符串的末尾------未解决
      let start = el.value.substr(0, el.selectionStart) + emoji.i;
      let end = el.value.substring(el.selectionStart, el.length);
      el.value = start + end;
    },
    //点击图标时，等同于点击图片+
    clickUpload() {
      this.$refs.icon.$el.click();
    },
    //文件状态改变时，添加、上传成功失败均会调用
    handleChange(file, fileList) {
      this.fileList = fileList;
      // console.log(file, fileList);
      if (this.fileList != []) {
        this.isFileShow = "block";
      }
    },
    //移除文件时
    handleRemove(file, fileList) {
      this.fileList = fileList;
      console.log(file, fileList);
      //文件不存在则不显示
      if (this.fileList.length == 0) {
        this.isFileShow = "none";
      }
    },
    //点击图片预览时
    handlePictureCardPreview(file) {
      console.log(file, this.fileList);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //自定义请求
    uploadFile() {
      if (this.textarea != "" || this.fileList.length != 0) {
        let formData = new FormData();
        formData.append("id", this.loginUser.id);
        formData.append("text", this.textarea);
        for (let i = 0; i < this.fileList.length; i++) {
          //formData同一个key可以追加多个value，多个value以数组形式存放
          formData.append("file", this.fileList[i].raw);
        }
        //formData直接打印是空对象，无法直接查看对象形式的数据
        // for(let value of formData.values()){
        //   console.log(value);
        // }
        if (this.fileList.length == 0) {
          publishArticleText(formData).then((res) => {
            this.textarea = "";
            //必须要在请求成功后在执行
            this.$emit("getNewAllArticle");
          });
        } else {
          publishArticle(formData).then((res) => {
            this.textarea = "";
            this.fileList = [];
            this.isFileShow = "none";
            this.$emit("getNewAllArticle"); //重新获取数据
          });
        }
      }
    },
    handleError() {},
    handleSucess() {},
  },
};
</script>

<style lang="less" scoped>
.SenMsg {
  position: relative;
  cursor: pointer;
  background-color: #ffff;
  z-index: 99;
  padding: 20px 20px 0 20px;
}

//文本区域
.text {
  background-color: #ffff;

  &:focus {
    border-color: #ff8200;
  }
}

//照片墙
.imgwall {
  padding-top: 10px;
}

//底部标图标
.icon {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  position: relative;

  .iconfont {
    width: 80%;

    i:nth-child(1) {
      margin-left: 0;
    }

    i {
      margin-left: 20px;
      font-size: 36px;
    }
  }

  .btn {
    width: 20%;
    display: flex;
    justify-content: flex-end;
  }

  // .icon-biaoqing:hover+.Emoji {
  //   display: block;
  // }
}

.Emoji {
  width: 100%;
  display: none;
  position: absolute;
  z-index: 999;

  &:hover {
    display: block;
  }
}

:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
  object-fit: cover;
}

:deep(.el-textarea .el-textarea__inner) {
  border: 0;
  font-size: 18px;
  background-color: #f0f1f4;
  border-radius: 12px;
  box-sizing: border-box;
  overscroll-behavior: none;

  &:focus {
    border: 1px solid #ff8200;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 5px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #00d46a;
    border: 1px solid #00c161;
  }
}
</style>
