/**
 * @description:多维度分析用户上传SQL按钮。
 */
import React,{Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import { Button, Upload, message,  } from 'antd';
import {} from "../actions/action.js";

class UploadSQL extends Component {
    constructor(props) {
        super(props);

    }

    render(){
        const props = {
            name: 'file',
            action: '/upload.do',
            headers: {
                // Accept:"text/plain,*/*",
                // Accept-Language:"zh-CN,zh;q=0.8",
                // content-type:"multipart/form-data";boundary=-------------------------------7d33a816d302b6
                // User-Agent:"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36",
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                "X-CSRF-TOKEN": "csrf",
                "data":"name=xiaowang&password=password"
            },
            accept: "txt",
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功。`);
                    // info.file = {
                    //     "uid": 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                    //     "name": 'xx.png'   // 文件名
                    //     "status": 'done',  // 状态有：uploading done error removed
                    //     "response": '{"status": "success"}',  // 服务端响应内容
                    // }
                    console.log("上传成功后返回的信息",info);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                    console.error("上传失败后返回的信息",info);
                }
            },
        };
        let me = this;
        return(
            <div className="upload_SQL_condition">
                <Upload {...props}>
                    <Button className="upload_SQL_btn" type="ghost">Upload SQL</Button>
                </Upload>
            </div>
        )
    }
}
export default UploadSQL;
