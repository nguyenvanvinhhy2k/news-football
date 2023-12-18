// import { updateLoadMediaByCourse } from "@/services/media.service";

export default function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader)
    }
}

class MyUploadAdapter {
    constructor(props) {
        // CKEditor 5's FileLoader instance.
        this.loader = props;
        // URL where to send files.
        // this.url = `http://localhost:8000/upload`;
    }

    // Starts the upload process.
    upload() {
        return new Promise((resolve, reject) => {
            // this._initRequest();
            // this._initListeners(resolve, reject);
            // this._sendRequest();
            this.loader.file.then(async result => {
                // const data = await updateLoadMediaByCourse({ file: result })
                const url = data?.data?.data?.[0]?.path
                resolve({
                    // default: url ? "https://minio.ftech.ai/fqa/" + url : ""
                });

            })
        });
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    // Example implementation using XMLHttpRequest.
    _initRequest() {
        // const xhr = this.xhr = new XMLHttpRequest();

        // xhr.open('POST', this.url, true);
        // xhr.responseType = 'json';
        // xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
        // XMLHttpRequest.setRequestHeader('', value)
        //   xhr.setRequestHeader('Authorization', getToken())
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = 'Couldn\'t upload file:' + ` ${loader.file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            resolve({
                default: response.s3Url
            });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    // Prepares the data and sends the request.
    _sendRequest() {
        const data = new FormData();

        this.loader.file.then( result => {
            data.append('upload', result);
            // const response = await updateLoadMediaByCourse({ resource: result })
            // this.xhr.send(data);
        }
        )
    }

}



// function MyUploadAdapter(props) {
//     const {loader} = props;
//     const url = `http://localhost:8000/upload`


//     const upload = ()=>{
//           return new Promise((resolve, reject) => {
//               initRequest();
//               initListeners(resolve, reject);
//               sendRequest();
//           } );
//     }
//     const xhr = new XMLHttpRequest();

//     const abort= ()=>{
//       if ( xhr ) {
//           xhr.abort();
//       }
//   }

//   const initRequest = ()=>{
//         xhr.open('POST', url, true);
//         xhr.responseType = 'json';
//         xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
//       //   xhr.setRequestHeader('Authorization', getToken())
//     }

//     // Initializes XMLHttpRequest listeners.
//   const initListeners = ( resolve, reject )=> {

//         const genericErrorText = 'Couldn\'t upload file:' + ` ${ loader.file.name }.`

//         xhr.addEventListener( 'error', () => reject( genericErrorText ) );
//         xhr.addEventListener( 'abort', () => reject() );
//         xhr.addEventListener( 'load', () => {
//             const response = xhr.response;
//             if ( !response || response.error ) {
//                 return reject( response && response.error ? response.error.message : genericErrorText );
//             }

//             // If the upload is successful, resolve the upload promise with an object containing
//             // at least the "default" URL, pointing to the image on the server.
//             resolve({
//                 default: response.s3Url
//             });
//         } );

//         if ( xhr.upload ) {
//             xhr.upload.addEventListener( 'progress', evt => {
//                 if ( evt.lengthComputable ) {
//                     loader.uploadTotal = evt.total;
//                     loader.uploaded = evt.loaded;
//                 }
//             } );
//         }
//     }

//     // Prepares the data and sends the request.
//   const sendRequest = ()=>{
//         const data = new FormData();

//         loader.file.then(result => {
//           data.append('upload', result);
//           xhr.send(data);
//           }
//         )
//     }


// }
