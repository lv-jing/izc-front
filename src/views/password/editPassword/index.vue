<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">找回密码</h3>
      <el-form-item prop="phone">
        <el-input v-model="registerForm.phone" type="text" maxlength="11" auto-complete="off" placeholder="请输入已绑定的手机号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="smsCode">
        <el-input
          v-model="registerForm.smsCode"
          auto-complete="off"
          placeholder="请输入短信验证码"
          style="width: 63%"
          maxlength="6"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="register-code">
          <el-button style="padding: 9px" plain @click="sendCode">{{ sendCodeText }}</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img"/>
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleRegister"
        >
          <span>下一步</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getCodeImg} from "@/api/login";
import {getSms, getCheckCode} from "@/api/login";
import Cookies from "js-cookie";

export default {
  name: "EditPassword",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      sendCodeFlag: true,
      sendCodeText: '获取短信验证码',
      codeUrl: "",
      registerForm: {
        phone: "",
        password: "",
        confirmPassword: "",
        smsCode: "",
        code: "",
        uuid: ""
      },
      registerRules: {
        phone: [
          {required: true, trigger: "blur", message: "请输入已绑定的手机号"}
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"},
        ],
        confirmPassword: [
          {required: true, trigger: "blur", message: "请再次输入您的密码"},
          {required: true, validator: equalToPassword, trigger: "blur"}
        ],
        smsCode: [{required: true, trigger: "change", message: "请输入短信验证码"}],
        code: [{required: true, trigger: "change", message: "请输入验证码"}],
      },
      captchaOnOff: true
    };
  },
  created() {
    this.getCode();
  },
  methods: {
    //发送验证码
    sendCode() {
      let sendCodeFlag = this.sendCodeFlag;
      if (!sendCodeFlag) {
        return;
      }
      if (!/^1[3-9]{1}[0-9]{9}$/.test(this.registerForm.phone)) {
        this.$message.error('请输入正确的手机号');
        return;
      }
      this.sendSMS();
    },
    //获取短信api
    sendSMS() {
      this.sendCodeFlag = false
      this.countDown();
      getSms({phone: this.registerForm.phone}).then((res) => {
        if (res.code === 200) {
          this.sendCodeFlag = false
          this.countDown();
        }
      })
    },
    //验证码倒计时
    countDown() {
      let time = 60;
      let timerfn = setInterval(() => {
        if (time === 0) {
          clearInterval(timerfn)
          this.sendCodeText = '获取验证码'
          this.sendCodeFlag = true
          return
        }
        time--;
        this.sendCodeText = time + 'S后再获取'
      }, 1000)
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.registerForm.uuid = res.uuid;
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          getCheckCode({
            ...this.registerForm
          }).then(res => {
            if (res.code === 200) {
              Cookies.set('phone', this.registerForm.phone)
              Cookies.set('tempToken', res.token)
              this.$router.push("/newpassword");
            }
          })
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../../../assets/images/login.png");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.register-code-img {
  height: 38px;
}
</style>
