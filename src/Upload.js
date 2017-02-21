import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import './Upload.less'
import request from 'superagent-bluebird-promise'

function isFunction(fn) {
    let getType = {};
    return fn && getType.toString.call(fn) === '[object Function]';
}

function formatMaxSize(size){
    size=size.toString().toUpperCase();
    var bsize,m=size.indexOf('M'),k=size.indexOf('K');
    if(m > -1){
        bsize = parseFloat(size.slice(0, m)) * 1024 * 1024
    }else if(k > -1){
        bsize = parseFloat(size.slice(0, k)) * 1024
    }else{
        bsize = parseFloat(size)
    }
    return Math.abs(bsize)
}

class Upload extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            supportClick: true,
            multiple: false,
            uploadUrl: this.props.uploadUrl || 'http://upload.qiniu.com',
            isDragActive: false,
            img : '',
            files:[]
        }
    }

    onDragLeave(e) {
        this.setState({
            isDragActive: false
        });
    }

    onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.setState({
            isDragActive: true
        });
    }

    showFiles () {
        if (this.state.files.length <= 0) {
            return ''
        }
        let files = this.state.files
        let self = this
        return (
            <div className='dropped-files' >
                <ul>
                {[].map.call(files, function (f, i) {
                    let preview = ''
                    if (/image/.test(f.type)) {
                        preview = <img src={f.preview} />
                        f.uploadPromise.then(function(res){
                            let rs = JSON.parse(res.text)
                            if(rs.response.code=='0') {
                                let origin = self.state.img
                                if(rs.data !== origin) {
                                    self.setState({img:rs.data})
                                }
                            }
                        })
                    }
                    return <li key={i}>{preview}<a className="remove" onClick={self.cleanFiles.bind(self)}>删除</a></li>;
                })}
              </ul>
          </div>
         )
    }

    cleanFiles(){
        this.setState({
            files: [],
            img:''
        })
    }
    onDrop(e) {
        e.preventDefault();

        this.setState({
            isDragActive: false
        });

        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }

        let maxFiles = (this.state.multiple) ? files.length : 1;

        if (this.props.onUpload) {
            files = Array.prototype.slice.call(files, 0, maxFiles);
            this.props.onUpload(files, e);
        }

        let maxSizeLimit=formatMaxSize(this.props.maxSize)
        for (let i = 0; i < maxFiles; i++) {
            if( maxSizeLimit && files[i].size > maxSizeLimit){
                console.trace && console.trace(new Error('文件大小错误!'))
                this.props.onError && this.props.onError({
                   coed:1,
                   message:'上传的文件大小超出了限制:' + this.props.maxSize
               })
            }else{
                files[i].preview = URL.createObjectURL(files[i]);
                files[i].request = this.upload(files[i]);
                files[i].uploadPromise = files[i].request.promise();
            }
        }

        if (this.props.onDrop) {
            files = Array.prototype.slice.call(files, 0, maxFiles);
            this.props.onDrop(files, e);
        } else {
            this.setState({
                files: files
            })
        }
    }
    onClick() {
         if (this.state.supportClick) {
             this.open();
         }
     }

     open() {
         let fileInput = ReactDOM.findDOMNode(this.refs.fileInput);
         fileInput.value = null;
         fileInput.click();
     }
     upload(file) {
         if (!file || file.size === 0) return null;
         let key = file.preview.split('/').pop() + '.' + file.name.split('.').pop();
         let onComplete = this.props.onComplete

         var r = request
             .post(this.state.uploadUrl)
             .field('key', key)
             .field('token', '6qF2ejYiRzXlPoPO3eKwaWE3juLDyX5QgE1PEMJ-:rmK8666mCDYhJuGiBXqmUttPhmw=:eyJzY29wZSI6ImxlbmFnZS1jZXNoaSIsImRlYWRsaW5lIjoxNzU3MzkxNjY1fQ==')
             .field('x:filename', file.name)
             .field('x:size', file.size)
             .attach('file', file, file.name)
             .set('Accept', 'application/json')
             if (isFunction(file.onprogress)) {
                 r.on('progress', file.onprogress);
             }
        return r;
    }

    render() {
        let className = this.props.className || 'dropzone';
        if (this.state.isDragActive) {
            className += ' active';
        }
        let style = this.props.style || {
            width: 270,
            height: 202,
            borderStyle: this.state.isDragActive ? 'solid' : 'dashed'
        };
        return (
            <div className='form-control fileUpload'>
                <div className={className} style={style} onClick={this.onClick.bind(this)} onDragLeave={this.onDragLeave.bind(this)} onDragOver={this.onDragOver.bind(this)}
                onDrop =  {this.onDrop.bind(this)}>
                   <input style={{display:'none'}} type={'file'} multiple={this.state.multiple} ref={'fileInput'} onChange={this.onDrop.bind(this)} accept={this.props.accept} />
                   <div className="info">点击或拖拽图片上传</div>
                </div>
                {this.showFiles()}
            </div>
        )
    }
}

Upload.propTypes = {
    //拖拽后的回调
    onDrop: React.PropTypes.func,
    //上传中回调
    onUpload: React.PropTypes.func,
    //最大图片尺寸
    maxSize:React.PropTypes.string,
    //样式
    style: React.PropTypes.object,
    //是否可点击
    supportClick: React.PropTypes.bool,
    //支持上传类型
    accept: React.PropTypes.string,
    //是否可多次上传
    multiple: React.PropTypes.bool,
    //上传完成的回调
    onComplete: React.PropTypes.func,
    //上传的url
    uploadUrl: React.PropTypes.string,
    //上传控件自定义样式的className
    className: React.PropTypes.string
}

export default Upload
