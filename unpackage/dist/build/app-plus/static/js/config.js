import config from '@/common/config.js';
const  dev = 'weixin';
const  appId = 0;

const  apiUrl 	 = 'http://127.0.0.1:5000/';
const  staticUrl = config.staticUrl;


export default {
	appId,
	dev,
	apiUrl,
	staticUrl,
}