<template>
<div class="PersonEdit">
  <el-form :model="personEdit" label-width="80px">
    <el-form-item label="头像" prop="header">
      <el-upload action="http://127.0.0.1:1997/editHeader" :data="{ id: personEdit.id }" :show-file-list="false" :on-success="handleAvatarSuccess" :on-onerror="handleAvatarError" :on-progress="handleAvatarProgress" :before-upload="handleAvatarBefore">
        <img :src="headerImg == '' ? personEdit.header : headerImg" width="60" height="60" />
      </el-upload>
    </el-form-item>
    <el-form-item label="昵称" prop="username">
      <el-input v-model="personEdit.username" />
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-input v-model="personEdit.sex" disabled />
    </el-form-item>
    <el-form-item label="星座" prop="star">
      <el-input v-model="personEdit.star" />
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model="personEdit.age" />
    </el-form-item>
    <el-form-item label="个人简介" prop="profil">
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 8 }" v-model="personEdit.profil" />
    </el-form-item>
    <el-form-item label="所在地" prop="location">
      <el-input v-model="personEdit.location" />
    </el-form-item>
    <el-form-item label="情感状态" prop="emotion">
      <el-select v-model="personEdit.emotion" placeholder="Activity zone">
        <el-option label="单身" value="单身" />
        <el-option label="求交往" value="求交往" />
        <el-option label="恋爱中" value="恋爱中" />
      </el-select>
    </el-form-item>
    <el-form-item label="大学/职业" prop="vocation">
      <el-input v-model="personEdit.vocation" />
    </el-form-item>
    <el-form-item label="微信/QQ" prop="chat">
      <el-input v-model="personEdit.chat" />
    </el-form-item>
    <el-form-item label="引力签" prop="tag">
      <section class="tag">
        <el-tag closable :disable-transitions="true" @close="handleClose(item)" class="mx-1" size="large" v-for="item in tag" :key="item">{{ item }}</el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" class="ml-1 w-20" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else @click="inputVisible = !inputVisible">
          + New Tag
        </el-button>
        <el-button @click="isSign = !isSign">更多</el-button>
      </section>

      <section v-if="isSign" class="sign">
        <el-button @click="signClick(item)" v-for="item in sign" :key="item">{{ item }}</el-button>
      </section>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">修改</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  getUserById,
  userEdit
} from "@/network/ajax";

export default {
  name: "PersonEdit",
  data() {
    return {
      personEdit: {},
      headerImg: "",
      tag: [],
      isSign: false,
      inputVisible: false,
      inputValue: "",
      sign: [
        "手工艺人",
        "猫控",
        "狗控",
        "穿搭狂魔",
        "老二次元",
        "完美主义",
        "健身达人",
        "老歌听不腻",
        "沉迷古典",
        "干饭王",
        "漫威",
        "综艺",
        "美剧",
        "日剧",
        "王者荣耀",
        "刺激战场",
        "LOL",
        "元神",
        "csgo",
        "爬山",
        "篮球",
        "瑜伽",
        "羽毛球",
        "跑步",
        "游泳",
        "骑行",
        "护肤达人",
        "间隙性高冷",
        "天然呆",
        "学霸脸",
        "喜欢电影院看电影",
      ],
    };
  },
  computed: {
    loginUser() {
      let user = JSON.parse(this.$store.state.user);
      return user;
    },
  },

  created() {
    this.getUserById();
  },
  methods: {
    getUserById() {
      getUserById(this.loginUser.id).then((res) => {
        this.personEdit = res.data;
        this.tag = res.data.tags;
      });
    },
    //文件上传
    handleAvatarSuccess(res) {
      console.log(res);
      if (res.code == 200) {
        this.$store.commit("loginUser", res.data);
        this.$store.commit("curUser", res.data);

        this.$emit("edit"); //修改成功则发送
        this.$message.success("头像修改成功");
      } else {
        this.$message.error("头像修改失败");
      }
    },
    handleAvatarError() {
      console.log(file);
    },
    handleAvatarProgress(file, uploadFile) {
      this.headerImg = URL.createObjectURL(uploadFile.raw);
    },
    handleAvatarBefore(file) {},

    //引力签
    handleClose(item) {
      this.tag.splice(this.tag.indexOf(item), 1);
      console.log(this.tag);
    },

    signCheck(value) {
      if (this.tag.length < 5) {
        this.tag.push(value);
        this.tag = Array.from(new Set(this.tag));
        console.log(this.tag);
      } else {
        this.$message.error("最多只能添加5个标签");
      }
    },

    signClick(item) {
      this.signCheck(item);
    },
    handleInputConfirm() {
      if (this.inputValue != "") {
        this.signCheck(this.inputValue);
      }
      this.inputVisible = false;
      this.inputValue = ''
    },
    submit() {
      this.personEdit.tag = this.tag.join("&");
      let data = JSON.parse(JSON.stringify(this.personEdit));
      console.log(data);
      userEdit(data).then((res) => {
        if (res.code == 200) {
          this.$emit("edit"); //修改成功则发送
          this.$message.success("资料修改成功");
        } else {
          this.$message.error("资料修改失败");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.PersonEdit {
  width: 100%;
  height: 100%;
}

.el-tag {
  user-select: none;
  margin-right: 8px;
}

img {
  border-radius: 50%;
}

section {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.tag {
  .el-button {
    margin-right: 8px;
  }
}

.sign {
  .el-button {
    margin: 8px;
  }
}
</style>
