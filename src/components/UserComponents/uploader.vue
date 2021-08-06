
<template>
  <div style="position: relative">
    <div
      class="bloder"
      style="height: 40px; line-height: 40px; font-size: 16px"
    >
      附件上传
    </div>
    <el-upload
      class="upload-demo"
      action=""
      :http-request="handleRequest"
      :on-progress="handprogress"
      :on-error="error"
      :before-remove="beforeRemove"
      :show-file-list="false"
      style="position: absolute; right: 90px; top: 0px"
      :limit="limit"
      :file-list="fileLists"
    >
      <el-button type="primary">上传</el-button>
      <!-- <div slot="tip" class="el-upload__tip">上传文件大小不能超过 1G</div> -->
    </el-upload>
    <el-button
      type="danger"
      style="position: absolute; right: 0px; top: 0px"
      @click="deleteFile"
      >删除</el-button
    >

    <el-divider></el-divider>

    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="filesWithXH"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange"
      @row-click="handleClickTableRow"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column label="文件名" prop="agreeTitle" align="center">
        <template slot-scope="{ row }">
          <el-input v-model="row.agreeTitle" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center">
        <template slot-scope="{ row }">
          <a
            :href="row.agreeContent"
            style="color: #1890ff"
            :download="row.agreeTitle"
            :name="row.agreeTitle"
            target="new"
            >下载</a
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import oss from "@/utils/request-oss.js";

export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    limit: {
      type: Number,
      default: 50,
    },
    accept: {
      type: String,
      default: ".docx",
    },
    dir: {
      type: String,
      default: "默认单据目录",
    },
  },
  data() {
    return {
      fileLists: [],
      tableKey: 0,
      // 等待状态
      listLoading: false,
      // table选中的数据
      multipleSelection: [],
      params: [],
    };
  },
  computed: {
    filesWithXH() {
      const result = [...this.fileList];
      return result;
    },
  },

  methods: {
    handleRequest(params) {
      this.handleSuccess(params.file);
    },
    handprogress(event) {
      this.listLoading = true;
    },
    deleteFile() {
      if (this.multipleSelection.length > 0) {
        this.$confirm("您确定删除所选数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          for (let item = 0; item < this.multipleSelection.length; item++) {
            for (let i = 0; i < this.fileList.length; i++) {
              if (
                this.multipleSelection[item].agreeContent ===
                this.fileList[i].agreeContent
              ) {
                this.fileList.splice(i, 1);
              }
            }
          }
          this.$emit("update:fileList", this.fileList);
        });

        // this.list.slice();
      } else {
        this.$message({
          showClose: true,
          // duration: 0,
          message: "请选择一条数据",
          type: "warning",
        });
      }
    },
    // 表格选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClickTableRow(row) {
      row.flag = !row.flag;
      this.$refs.multipleTable.toggleRowSelection(row, row.flag);
    },
    error(err, file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 1MB!",
          type: "warning",
        });
      }
      this.listLoading = false;
    },
    handleSuccess(file) {
      this.listLoading = true;
      for (let index = 0; index < this.fileList.length; index++) {
        if (file.name === this.fileList[index].name) {
          this.$message({
            showClose: true,
            // duration: 0,
            message: "文件已上传，请勿重复上传！",
            type: "warning",
          });
          this.listLoading = false;

          return;
        }
      }

      const me = this;
      // let dotIndex = file.name.lastIndexOf(".");
      // let ext = file.name.substring(dotIndex);
      // if (!this.accept.split(",").find((i) => i == ext)) {
      //   // this.notify("提示", "非法的文件类型", 5);
      //   me.$message({
      //     type: "info",
      //     message: "非法的文件类型",
      //   });
      //   return;
      // }
      let onError = (err) => {
        console.log(1, err);
        this.$message("网络错误，请重新上传！");
      };
      let onSuccess = (res) => {
        console.log(2, res);
        if (res.res.status === 200) {
          this.listLoading = false;

          const list = me.fileList;
          // const fileName = res.name.split(".")[0];
          const fileName = res.name;
          list.push({
            agreeTitle: fileName,
            agreeContent: res.url,
            agreeType: 1,
          });

          me.$emit("change", list);
        }
      };
      oss(
        {
          file: file,
          onSuccess,
          onError,
        },
        {}
      );

      return;
    },

    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>
<style lang="css">
.title-wrap {
  display: flex;
  justify-content: space-between;
}
</style>