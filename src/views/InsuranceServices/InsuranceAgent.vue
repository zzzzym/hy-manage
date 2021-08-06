<template>
  <div class="app-container">
    <div class="filter-container">
      用户名：
      <el-input
        v-model="listQuery.userName"
        placeholder="用户名"
        style="width: 200px; margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      代理名称：
      <el-input
        v-model="listQuery.proxyName"
        placeholder="代理名称"
        style="width: 200px; margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
    </div>
    <div class="cgright" style="margin-bottom: 10px">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查询</el-button
      >
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="refresh"
        >重置</el-button
      >
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="addForm"
        >新增代理</el-button
      >
    </div>
    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column
        label="代理名称"
        prop="proxyName"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="销售区域"
        prop="saleAreaNames"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="服务电话"
        align="center"
        prop="proxyTel"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="用户名"
        align="center"
        :show-overflow-tooltip="true"
        prop="userName"
      />
      <el-table-column
        label="创建时间"
        align="center"
        :show-overflow-tooltip="true"
        prop="createTime"
      />
      <el-table-column
        label="状态"
        align="center"
        :show-overflow-tooltip="true"
        prop="holdFlag"
      />
      <el-table-column
        label="操作"
        width="150px"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="editForm(row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="copyUrl(row)"
            >复制链接</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- 弹出层 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="bloder"
      width="50%"
      top="20px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 100%"
        :disabled="formdisabled"
      >
        <el-row>
          <el-col :span="24">
            <div
              class="bloder"
              style="height: 40px; line-height: 40px; font-size: 16px"
            >
              基础信息
            </div>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="24">
            <el-form-item label="代理名称" prop="proxyName">
              <el-input v-model="temp.proxyName" placeholder="请输入代理名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="销售区域" prop="saleAreaNames">
              <el-select
                ref="selectArea"
                v-model="saleAreaNames"
                :multiple="true"
                class="filter-item"
                style="width: 100%"
                @change="changeValue"
              >
                <el-option
                  v-for="item in auditStatus"
                  :key="item.key"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="服务电话" prop="proxyTel">
              <el-input v-model="temp.proxyTel" placeholder="请输入服务电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="代理商邮箱" prop="proxyEmail">
              <el-input
                v-model="temp.proxyEmail"
                placeholder="请输入代理商邮箱"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="temp.userName"
                placeholder="请输入用户号"
                :disabled="dialogStatus == 'update' ? true : false"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="密码" prop="userPassword">
              <el-input v-model="temp.userPassword" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="temp.confirmPassword"
                placeholder="请确认密码"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row
          ><el-col :span="24">
            <el-form-item label="状态" prop="holdFlag">
              <el-radio-group v-model="temp.holdFlag">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24"
            ><div
              class="bloder"
              style="height: 40px; line-height: 40px; font-size: 16px"
            >
              支付信息
            </div></el-col
          >
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="24">
            <el-form-item label="公众号ID" prop="appId">
              <el-input v-model="temp.appId" placeholder="请输入公众号ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公众号secre" prop="appSecret">
              <el-input
                v-model="temp.appSecret"
                placeholder="请输入公众号secre"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="微信支付商号" prop="mchId">
              <el-input
                v-model="temp.mchId"
                placeholder="请输入微信支付商户号"
              />
              <span class="input_tooltip">
                登录微信支付商户平台，在账户中心>商户信息，页面中找到商户号并填写在这里
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="密钥" prop="mchSecret">
              <el-input v-model="temp.mchSecret" placeholder="请输入密钥" />
              <span class="input_tooltip">
                登录微信支付商户平台，在账户中心>API安全>设置API密钥，设置好密钥并填写在这里
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="证书" prop="mchKeyPath">
              <el-upload
                class="upload-demo"
                ref="upload"
                :header="header"
                :data="temp"
                accept=".p12"
                action="http://192.168.0.138:8970/manage/serviceproxyinfo/insertOrUpdateServiceProxyInfo"
                :on-change="handleChange"
                :file-list="fileList"
                :http-request="handleRequest"
                :on-remove="onRemove"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传p12文件</div>
              </el-upload>
              <!-- <form class="form">
                <input type="file" name="mchKeyfile" id="" />
                <div slot="tip" class="el-upload__tip">只能上传p12文件</div>
              </form> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogFormVisible = false"
          style="margin-right: 10px"
          >{{ $t("table.cancel") }}</el-button
        >
        <el-button
          type="primary"
          style="margin-right: 20px"
          @click="updateData()"
          >{{ $t("table.confirm") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive
import { areaList } from "@vant/area-data";
import {
  query,
  querybyid,
  edit,
  getOAthUrl,
  uploadMchKey,
} from "@/api/proxyInfo";

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    var confirmPassword = (rule, value, callback) => {
      if (this.temp.userPassword && value !== this.temp.userPassword) {
        return callback(new Error("确认密码与密码不一致!"));
      } else {
        return callback();
      }
    };
    var mchKeyPath = (rule, value, callback) => {
      if (this.temp.mchKeyPath === "" && this.formData === undefined) {
        return callback(new Error("请上传证书!"));
      } else {
        return callback();
      }
    };

    return {
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      fileList: [],
      tableKey: 0,
      // table的数据数组
      list: [{ recordNum: 1 }],
      // 分页总数
      total: 0,
      // 等待状态
      listLoading: false,
      auditStatus: [],
      // 弹出层
      dialogFormVisible: false,
      formdisabled: false,
      // 表单验证规则
      rules: {
        proxyName: [
          { required: true, message: "请输入代理名称", trigger: "change" },
        ],
        saleAreaNames: [
          { required: true, message: "请选择销售区域", trigger: "blur" },
        ],
        proxyEmail: [
          // { required: true, message: "请输入代理商邮箱", trigger: "change" },
          {
            type: "string",
            required: true,
            message: "请输入邮箱地址",
            trigger: "blur",
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        proxyTel: [
          {
            required: true,
            message: "请输入服务电话",
            trigger: "change",
          },
          {
            message: "请输入正确手机号",
            trigger: ["change", "blur"],
            pattern: "^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$",
          },
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "change" },
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
        confirmPassword: [
          { required: true, validator: confirmPassword, trigger: "change" },
        ],
        holdFlag: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
        appId: [
          { required: true, message: "请输入公众号ID", trigger: "change" },
        ],
        appSecret: [
          { required: true, message: "请输入公众号secre", trigger: "change" },
        ],
        mchId: [
          { required: true, message: "请输入微信支付商号", trigger: "change" },
        ],
        mchSecret: [
          { required: true, message: "请输入密钥", trigger: "change" },
        ],
        mchKeyPath: [
          { required: true, validator: mchKeyPath, trigger: "change" },
        ],
      },
      // 弹出层标题
      textMap: {
        update: "编辑代理",
        create: "新增代理",
      },
      dialogStatus: "",
      // 表单数据对象
      temp: {
        proxyName: "",
        proxyTel: "",
        proxyEmail: "",
        userName: "",
        saleAreaNames: "",
        userPassword: "",
        confirmPassword: "",
        holdFlag: "",
        appId: "",
        appSecret: "",
        mchId: "",
        mchSecret: "",
        mchKeyPath: "",
      },
      accept: ".p12",
      // 查询数据
      listQuery: {
        page: 1,
        limit: 10,
        proxyName: "",
        userName: "",
      },
      saleAreaNames: null,
    };
  },
  watch: {
    dialogFormVisible(newVal) {
      // 关闭dialog时清除数据
      if (!newVal) {
        this.temp = {
          proxyName: "",
          proxyTel: "",
          userName: "",
          proxyEmail: "",
          userPassword: "",
          confirmPassword: "",
          holdFlag: "",
          appId: "",
          appSecret: "",
          mchId: "",
          mchSecret: "",
          mchKeyPath: "",
          saleAreaNames: "",
        };
        this.saleAreaNames = [];
        this.fileList = [];
      }
    },
  },
  mounted() {
    this.getList();
    // 计算省份
    for (const key in areaList.province_list) {
      if (Object.hasOwnProperty.call(areaList.province_list, key)) {
        let element = { key: "", value: "" };
        element.value = areaList.province_list[key];
        element.key = key;
        this.auditStatus.push(element);
      }
    }
  },
  methods: {
    // 多选数据处理
    changeValue(val) {
      // val是el-option里面的:value="item.code"这里绑定的对应的code的值
      let codeData = val;
      // 由于是多选，所以这里是一个数组，里面存了多个val
      let codeDataLength = codeData.length;
      // 定义一个空数组用于存储处理过后包含code和name的数据
      let obj = [];
      // 第一层for循环遍历，拿到codeData数组里面的每一个val，就是对应的多选里面的每一个code
      for (let i = 0; i < codeDataLength; i++) {
        // 这里value就是对应的每一个code
        let value = codeData[i];
        // this.cityOptions就是你在el-option里面遍历的数组
        this.auditStatus.map((item) => {
          //  item就是this.cityOptions这个数组里面的每一个对象
          // 通过每一个对象的code与value也就是对应的每一个选中的code对比
          if (item.value === value) {
            // 符合的对象添加进之前定义的新新数组里面
            obj.push(item);
          }
        });
      }
      // 获得包含对应的code的数组，赋值用到对应的地方即可
      this.temp.saleAreaNames = obj
        .map((item) => {
          return item.value;
        })
        .join(",");
      this.temp.saleAreaIds = obj
        .map((item) => {
          return item.key;
        })
        .join(",");
    },
    // 上传文件限制一个
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]; // 这一步，是 展示最后一次选择的csv文件
      }
    },
    // 自定义上传
    handleRequest(file) {
      let param = new FormData();
      param.append("file", file.file, file.file.name);
      this.formData = param;
    },
    // 新增按钮
    addForm() {
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
    },
    // 修改按钮
    editForm(row) {
      querybyid(row.proxyInfoObjId).then((res) => {
        if (res.resCode === 200) {
          this.temp = { ...res.resData };
          this.fileList.push({ name: this.temp.mchKeyName });
          this.saleAreaNames = res.resData.saleAreaNames.split(",");
          this.$set(this.temp, "confirmPassword", this.temp.userPassword);
          this.dialogFormVisible = true;
          this.dialogStatus = "update";
        }
      });
    },
    // 删除文件
    onRemove(file, fileList) {
      this.fileList = fileList;
      this.temp.mchKeyPath = "";
    },
    // 复制链接
    copyText(text) {
      var input = document.createElement("input");

      input.setAttribute("id", "input_for_copyText");
      input.value = text;

      document.getElementsByTagName("body")[0].appendChild(input);
      document.getElementById("input_for_copyText").select();
      document.execCommand("copy");
      document.getElementById("input_for_copyText").remove();
      this.$message({
        showClose: true,
        // duration: 0,
        message: "复制成功",
        type: "success",
      });
    },
    // 请求复制链接
    copyUrl(row) {
      getOAthUrl(row.proxyInfoObjId).then((response) => {
        if (response.resCode === 200) {
          this.copyText(response.resData);
        }
      });
    },
    // 更新数据
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.formData === undefined) {
            edit(this.temp).then((data) => {
              if (data.resCode === 200) {
                this.$message({ message: data.resMsg, type: "success" });
                this.dialogFormVisible = false;
                this.getList();
              }
            });
          } else {
            uploadMchKey(this.formData).then((res) => {
              if (res.resCode === 200) {
                this.temp.mchKeyPath = res.resData;
                edit(this.temp).then((data) => {
                  if (data.resCode === 200) {
                    this.$message({ message: data.resMsg, type: "success" });
                    this.dialogFormVisible = false;
                    this.getList();
                  }
                });
              }
            });
          }
        }
      });
    },
    // 查询数据
    getList() {
      this.listLoading = true;

      query(this.listQuery).then((response) => {
        this.list = response.resData.records;
        this.list.map((item, index) => (item.index = index + 1));
        this.total = Number(response.resData.totalCount);
        // Just to simulate the time of the request
        this.listLoading = false;
      });
    },
    // 重置按钮
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        proxyName: "",
        userName: "",
      };
    },
    // enter 事件
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>

<style lang="css">
.el-dialog__body {
  padding-top: 0 !important;
  padding-left: 40px !important ;
  padding-right: 40px !important ;
  padding-bottom: 0px !important ;
}
label {
  font-weight: 400;
}
.bloder {
  font-weight: bolder;
}
.input_tooltip {
  font-size: 14px;
  color: #ccc;
}
</style>