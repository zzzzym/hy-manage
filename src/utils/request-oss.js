import OSS from 'ali-oss'
import {
  getAliCode
} from "@/api/product";;


// 获取oss初始化需要的相关信息
async function getOssConfigInfo(config) {
  let data = null
  await getAliCode(config).then((res) => {
    if (res.resCode === 200) {
      data = res
    }
  })
  return data
}

// 初始化oss
async function initOSSClient(config) {
  //获取初始化需要的配置
  let res = await getOssConfigInfo(config)
  if (res.resCode !== 200) return false
  let {
    aliyunOssBucket: bucket,
    endPoint: region,
    aliyunOssUrl: endPoint,
    ossBucketVideo: path,
    aliyunAccessKeyId: accessKeyId,
    aliyunccessKeySecret: accessKeySecret,
  } = res.resData
  // ossClient oss配置  path上传文件存储的路径
  let a = {
    ossClient: new OSS({
      region, //实例所在的地理位置
      endPoint,
      accessKeyId, //填写自己阿里云账户的acessKeyId
      accessKeySecret, //填写自己阿里云账户的accessKeySecret
      stsToken: null,
      bucket //在oss后台创建的bucket
    }),
    path
  }
  console.log("a", a)
  return a
}

// 读取文件
function readFile(option) {
  return new Promise((resolve, reject) => {
    try {
      let file = new FileReader()
      file.addEventListener('load', e => {
        resolve(e.target.result)
      })
      //option.file input file 文本框读取到的文件对象
      file.readAsArrayBuffer(option.file)
    } catch (e) {
      reject()
    }
  })
}

// oss上传文件
//option 上传过程中的回调参数  
//config 获取oss配置信息需要的参数
export default async (option = {}, config) => {
  const fileResult = await readFile(option)
  console.log(fileResult)
  if (!fileResult) return option.onError ? option.onError('读取文件失败') : '读取文件失败'
  let {
    ossClient,
    path
  } = await initOSSClient(config)
  console.log(ossClient, path)
  console.log(option)
  if (!ossClient) return option.onError ? option.onError('oss初始化错误') : 'oss初始化错误'
  //格式化文件名
  // let ossObj = `${path}.${option.file.name.split('.').reverse()[0]}`
  try {
    //调用 oss实例put方式上传文件
    const result = await ossClient.put(option.file.name, OSS.Buffer(fileResult), {
      headers: {
        "Content-Disposition": `attachment; filename=${encodeURIComponent(
          option.file.name
        )}`,
      },
    })
    return option.onSuccess ? option.onSuccess(result) : result
  } catch (e) {
    return option.onError ? option.onError('上传失败') : {
      res: 'FAIL'
    }
  }
}

// 获取临时访问路径
export async function getSignatureUrl(urlKey, config) {
  let {
    ossClient
  } = await initOSSClient(config)
  if (!ossClient) return
  return ossClient.signatureUrl(urlKey)
}
