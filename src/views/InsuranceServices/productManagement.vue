<template>
  <div class="app-container">
    <div class="filter-container">
      保险名称：
      <el-input
        v-model="listQuery.insuranceName"
        placeholder="保险名称"
        style="width: 200px; margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      代理公司：
      <el-input
        v-model="listQuery.proxyName"
        placeholder="代理公司"
        style="width: 200px; margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      保险公司：
      <el-input
        v-model="listQuery.insuranceCompanyName"
        placeholder="保险公司"
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
        >新增保险</el-button
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
        label="保险名称"
        align="center"
        :show-overflow-tooltip="true"
        prop="insuranceName"
      />
      <el-table-column
        label="保险金额"
        align="center"
        :show-overflow-tooltip="true"
        prop="goodPrice"
      />

      <el-table-column
        label="保险公司"
        align="center"
        :show-overflow-tooltip="true"
        prop="insuranceCompanyName"
      />

      <el-table-column
        label="产品介绍"
        align="center"
        min-width="150px"
        :show-overflow-tooltip="true"
        prop="goodsBrief"
      />
      <el-table-column
        label="代理公司"
        align="center"
        :show-overflow-tooltip="true"
        prop="proxyName"
      />
      <el-table-column
        label="状态"
        align="center"
        :show-overflow-tooltip="true"
        prop="holdFlag"
      />

      <el-table-column
        label="操作"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="editForm(row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deactivate(row)"
            >停用</el-button
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
      width="60%"
      top="20px"
      :close-on-click-modal="false"
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
            <el-form-item label="保险名称" prop="insuranceName">
              <el-input
                v-model="temp.insuranceName"
                placeholder="请输入保险名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品小图" prop="littlePicUri">
              <el-upload
                class="avatar-uploader"
                action=""
                :accept="imgAccept"
                :show-file-list="false"
                :http-request="uploaderSmallImg"
              >
                <img
                  v-if="temp.littlePicUri"
                  :src="temp.littlePicUri"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="保险公司" prop="insuranceCompanyName">
              <el-input
                v-model="temp.insuranceCompanyName"
                placeholder="请输入保险公司"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保险金额" prop="goodPrice">
              <el-input-number
                v-model="temp.goodPrice"
                style="width: 100%"
                type="number"
                :min="0"
                :max="999999999999999"
                :controls="false"
                :precision="2"
                placeholder
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保险期限" prop="protectDays">
              <el-input
                v-model.number="temp.protectDays"
                placeholder="请输入保险期限"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="绑定代理" prop="proxyName">
              <el-select
                v-model="temp.proxyName"
                @change="selectPorxy"
                class="filter-item"
                style="width: 100%"
              >
                <el-option
                  v-for="item in agentList"
                  :key="item.key"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          ><el-col :span="24">
            <el-form-item label="产品简介" prop="goodsBrief">
              <el-input
                v-model="temp.goodsBrief"
                placeholder="最多可输入15字"
                :maxlength="15"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          ><el-col :span="24">
            <el-form-item label="状态" prop="holdFlag">
              <el-radio-group v-model="temp.holdFlag">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品大图" prop="bigPicUrl">
              <el-upload
                class="avatar-uploader"
                action=""
                :accept="imgAccept"
                :show-file-list="false"
                :http-request="uploaderBigImg"
              >
                <img
                  v-if="temp.bigPicUrl"
                  :src="temp.bigPicUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品说明" prop="goodDesc">
              <div v-if="dialogFormVisible">
                <tinymce ref="editor" v-model="temp.goodDesc" :height="300" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <uploader :fileList="temp.fileList" />
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
import { query, querybyid, deactivate, edit } from "@/api/product";
import { query as queryProxy } from "@/api/proxyInfo";
import oss from "@/utils/request-oss.js";
import waves from "@/directive/waves"; // waves directive
import Tinymce from "@/components/Tinymce";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import uploader from "@/components/UserComponents/uploader";
export default {
  components: { Pagination, Tinymce, uploader },
  directives: { waves },
  data() {
    var singleWeight = (rule, value, callback) => {
      if (value <= 0) {
        return callback(new Error("单品重量必须大于0"));
      } else {
        return callback();
      }
    };
    return {
      tableKey: 0,
      // table的数据数组
      list: [],
      // 分页总数
      total: 0,
      // 等待状态
      listLoading: false,
      agentList: [],
      // 弹出层
      dialogFormVisible: false,
      formdisabled: false,
      // 表单验证规则
      rules: {
        insuranceName: [
          { required: true, message: "请输入保险名称", trigger: "change" },
        ],
        littlePicUri: [
          { required: true, message: "请上传产品小图", trigger: "blur" },
        ],
        insuranceCompanyName: [
          { required: true, message: "请输入保险公司", trigger: "change" },
        ],
        goodPrice: [
          { required: true, message: "请输入保险金额", trigger: "change" },
        ],
        protectDays: [
          { required: true, message: "请输入保险期限", trigger: "change" },
          { type: "number", message: "请输入数字" },
        ],
        proxyName: [
          { required: true, message: "请选择代理", trigger: "change" },
        ],
        goodsBrief: [
          { required: true, message: "请输入产品简介", trigger: "change" },
        ],
        holdFlag: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
        bigPicUrl: [
          { required: true, message: "请上传产品大图", trigger: "change" },
        ],
        goodDesc: [
          { required: true, message: "请输入产品说明", trigger: "change" },
        ],
      },
      // 弹出层标题
      textMap: {
        update: "编辑保险",
        create: "新增保险",
      },
      dialogStatus: "",
      // 表单数据对象
      temp: {
        insuranceName: "",
        littlePicUri: "",
        insuranceCompanyName: "",
        goodPrice: "",
        protectDays: "",
        bindProxyId: "",
        proxyName: "",
        goodsBrief: "",
        holdFlag: "",
        bigPicUrl: "",
        goodDesc: null,
        fileList: [],
      },

      // 查询数据
      listQuery: {
        page: 1,
        limit: 10,
        cooperativeName: "",
        recordNum: "",
        creationTime: "",
      },
      imgAccept: ".jpg,.png",
    };
  },
  watch: {
    dialogFormVisible(newVal, oldVal) {
      // 关闭dialog时清除数据
      if (!newVal) {
        this.temp = {
          insuranceName: "",
          littlePicUri: "",
          insuranceCompanyName: "",
          goodPrice: "",
          protectDays: "",
          bindProxyId: "",
          proxyName: "",
          goodsBrief: "",
          holdFlag: "",
          bigPicUrl: "",
          goodDesc: null,
          fileList: [],
        };
        this.agentList = [];
        // 编辑器清空
        setTimeout(() => {
          this.temp.goodDesc = null;
        }, 10);
      } else {
        this.getProxyInfo();
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 新增按钮
    addForm() {
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
    },
    // 修改按钮
    editForm(row) {
      querybyid(row.objId).then((res) => {
        if (res.resCode === 200) {
          this.temp = { ...res.resData };
          this.dialogFormVisible = true;
          this.dialogStatus = "update";
        }
      });
    },
    // 重置按钮
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        cooperativeName: "",
        recordNum: "",
        creationTime: "",
      };
    },
    // enter 事件
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 选择代理
    selectPorxy(val) {
      this.temp.bindProxyId = this.agentList.filter((item) => {
        return item.label === val;
      })[0].key;
    },
    // 获取代理下拉框值域
    getProxyInfo() {
      queryProxy({ limit: 1000, page: 1 }).then((res) => {
        if (res.resCode === 200) {
          res.resData.records.forEach((element) => {
            let obj = {
              key: "",
              label: "",
            };
            obj.key = element.proxyInfoObjId;
            obj.label = element.proxyName;
            this.agentList.push(obj);
          });
        }
      });
    },
    uploaderSmallImg(file) {
      this.handleRequest(file, 1);
    },
    uploaderBigImg(file) {
      this.handleRequest(file, 0);
    },
    // 上传阿里云
    handleRequest(file, type) {
      let onError = (err) => {
        console.log(1, err);
        this.$message("网络错误，请重新上传！");
      };
      let onSuccess = (res) => {
        console.log(2, res);
        if (res.res.status === 200) {
          if (type) {
            this.temp.littlePicUri = res.url;
          } else {
            this.temp.bigPicUrl = res.url;
          }
        }
      };
      oss(
        {
          file: file.file,
          onSuccess,
          onError,
        },
        {}
      );
    },

    // 停用接口
    deactivate(row) {
      deactivate(row.objId).then((res) => {
        if (res.resCode === 200) {
          this.$message({ message: "停用成功！", type: "success" });
          this.getList();
        }
      });
    },
    // 新增修改数据
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          edit(this.temp).then((res) => {
            if (res.resCode === 200) {
              this.$message({ message: res.resMsg, type: "success" });
              this.dialogFormVisible = false;
              this.getList();
            }
          });
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
}
</style>